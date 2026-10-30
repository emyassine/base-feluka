import { createHash } from 'node:crypto'
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { resolveSitePaths } from '../paths.mjs'

const site = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const paths = resolveSitePaths(site)
const refactor = join(site, '../.trash/refactor')
const baseline = join(refactor, 'baseline.json')
const baselineTree = join(refactor, 'baseline-tree')
const roots = [
  { path: paths.generatedGuides, snapshot: '.generated-guides' },
  { path: paths.generatedMetadata, snapshot: '.vitepress/generated' },
]

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical)
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]))
  return value
}

async function collect() {
  const files = {}
  for (const { path: root, snapshot } of roots) {
    async function visit(directory) {
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name)
        if (entry.isDirectory()) await visit(path)
        else {
          let bytes = await readFile(path)
          if (path.endsWith('.json')) bytes = Buffer.from(`${JSON.stringify(canonical(JSON.parse(bytes.toString('utf8'))), null, 2)}\n`)
          const local = relative(root, path).split('\\').join('/')
          files[`${snapshot}/${local}`] = createHash('sha256').update(bytes).digest('hex')
        }
      }
    }
    await visit(root)
  }
  return files
}

const mode = process.argv[2]
if (!['record', 'compare'].includes(mode)) throw new Error('Usage: node scripts/dev/verify.mjs record|compare')
const prep = spawnSync(process.execPath, [join(site, 'scripts/preparation/pipeline.mjs')], { cwd: site, stdio: 'inherit', env: { ...process.env, DOCS_PREPARE_INCREMENTAL: '0' } })
if (prep.status !== 0) process.exit(prep.status ?? 2)
await mkdir(refactor, { recursive: true })
const current = await collect()
if (mode === 'record') {
  await rm(baselineTree, { recursive: true, force: true })
  for (const { path: root, snapshot } of roots) await cp(join(site, root), join(baselineTree, snapshot), { recursive: true })
  await writeFile(baseline, `${JSON.stringify(current, null, 2)}\n`)
  process.stdout.write(`Recorded ${Object.keys(current).length} generated files.\n`)
} else {
  const previous = JSON.parse(await readFile(baseline, 'utf8'))
  const allowed = JSON.parse(await readFile(join(refactor, 'allowed-output-diffs.json'), 'utf8').catch(() => '[]'))
  const allowedPaths = new Set(allowed.filter((entry) => typeof entry.path === 'string' && typeof entry.reason === 'string' && entry.reason.trim()).map((entry) => entry.path))
  const added = Object.keys(current).filter((path) => !(path in previous) && !allowedPaths.has(path))
  const removed = Object.keys(previous).filter((path) => !(path in current) && !allowedPaths.has(path))
  const changed = Object.keys(current).filter((path) => path in previous && current[path] !== previous[path] && !allowedPaths.has(path))
  process.stdout.write(`added:   ${added.length}\nremoved: ${removed.length}\nchanged: ${changed.length}\n`)
  for (const path of [...added, ...removed, ...changed]) process.stdout.write(`  ${path}\n`)
  if (added.length || removed.length || changed.length) process.exitCode = 1
}
