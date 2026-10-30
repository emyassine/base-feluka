import { existsSync, watch as watchFs } from 'node:fs'
import { readFile, readdir, utimes } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveSitePaths } from '../paths.mjs'

const siteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const sitePaths = resolveSitePaths(siteDirectory)
const sourceDirectory = resolve(sitePaths.sourceRoot, 'src')
const siteConfigDirectory = resolve(sitePaths.sourceRoot, '.site')
const resourceDirectory = sitePaths.resourcesDirectory
const sourceResourceDirectory = resolve(sitePaths.sourceRoot, 'resources')
const prepareScript = join(siteDirectory, 'scripts/preparation/pipeline.mjs')
const vitepressConfig = join(siteDirectory, '.vitepress/config.ts')
const ignoredDirectories = new Set(['node_modules', '.git', '.trash', 'build'])
const pendingPaths = new Set()
let debounceTimer
let isPreparing = false
let stopping = false

function log(message) {
  process.stdout.write(`[watch ${new Date().toLocaleTimeString('en-GB', { hour12: false })}] ${message}\n`)
}

async function structuralSignature() {
  const hash = createHash('sha256')
  async function visit(directory, root) {
    for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue
      const path = join(directory, entry.name)
      const relativePath = relative(root, path).split(sep).join('/')
      if (entry.isDirectory()) {
        hash.update(`dir:${relativePath}\0`)
        await visit(path, root)
        continue
      }
      if (entry.name === 'README.md') continue
      hash.update(`file:${relativePath}\0`)
      if (entry.name.endsWith('.json')) {
        hash.update(await readFile(path))
      } else if (extname(entry.name).toLowerCase() === '.md') {
        const source = await readFile(path, 'utf8')
        const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/)
        const sidebarTitle = frontmatter?.[1].match(/^sidebarTitle:\s*(.+?)\s*$/m)?.[1] ?? ''
        hash.update(`sidebarTitle:${sidebarTitle}\0`)
      }
    }
  }
  hash.update('source\0')
  await visit(sourceDirectory, sourceDirectory)
  hash.update('site-config\0')
  await visit(siteConfigDirectory, siteConfigDirectory)
  hash.update('resources\0')
  await visit(resourceDirectory, resourceDirectory)
  if (existsSync(sourceResourceDirectory)) {
    hash.update('source-resources\0')
    await visit(sourceResourceDirectory, sourceResourceDirectory)
  }
  return hash.digest('hex')
}

async function runPrepare() {
  return new Promise((resolveResult) => {
    const child = spawn(process.execPath, [prepareScript], {
      cwd: siteDirectory,
      env: { ...process.env, DOCS_PREPARE_INCREMENTAL: '1' },
      stdio: 'inherit',
    })
    child.once('error', (error) => resolveResult({ code: 1, error }))
    child.once('exit', (code, signal) => resolveResult({ code: code ?? 1, signal }))
  })
}

async function processChanges() {
  if (isPreparing || stopping) return
  isPreparing = true
  while (pendingPaths.size && !stopping) {
    const changed = [...pendingPaths]
    pendingPaths.clear()
    log(`Change detected (${changed.length} path${changed.length === 1 ? '' : 's'}): ${changed.slice(0, 4).join(', ')}${changed.length > 4 ? ', …' : ''}`)
    const started = Date.now()
    const previousSignature = signature
    const result = await runPrepare()
    if (result.code !== 0) {
      log(`Preparation failed${result.signal ? ` (${result.signal})` : ''}; the watcher remains active and will retry after the next edit.`)
      continue
    }
    const nextSignature = await structuralSignature()
    if (nextSignature !== previousSignature) {
      const now = new Date()
      await utimes(vitepressConfig, now, now)
      log('Navigation or site configuration changed; VitePress is restarting to reload its config.')
    } else {
      log(`Updated generated documentation in ${((Date.now() - started) / 1000).toFixed(2)}s; VitePress will hot reload changed pages.`)
    }
    signature = nextSignature
  }
  isPreparing = false
}

function schedule(path) {
  pendingPaths.add(path)
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => void processChanges(), 220)
}

const watchers = []
try {
  watchers.push(await watchFs(sourceDirectory, { recursive: true }, (_event, filename) => {
    schedule(`src/${filename?.toString() || '(unknown source path)'}`)
  }))
  watchers.push(await watchFs(siteConfigDirectory, { recursive: true }, (_event, filename) => {
    schedule(`.site/${filename?.toString() || '(unknown config path)'}`)
  }))
  watchers.push(await watchFs(resourceDirectory, { recursive: true }, (_event, filename) => {
    schedule(`resources/${filename?.toString() || '(unknown resource path)'}`)
  }))
  if (existsSync(sourceResourceDirectory)) {
    watchers.push(await watchFs(sourceResourceDirectory, { recursive: true }, (_event, filename) => {
      schedule(`source-resources/${filename?.toString() || '(unknown source resource path)'}`)
    }))
  }
} catch (error) {
  for (const watcher of watchers) watcher.close()
  throw new Error(`Unable to watch the documentation sources on this platform: ${error.message}`)
}

let signature = await structuralSignature()
log(`Watching ${sourceDirectory}, ${siteConfigDirectory}, ${resourceDirectory}, and ${sourceResourceDirectory}.`)

async function shutdown() {
  if (stopping) return
  stopping = true
  clearTimeout(debounceTimer)
  for (const watcher of watchers) watcher.close()
  while (isPreparing) await new Promise((resume) => setTimeout(resume, 50))
  process.exit(0)
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)

