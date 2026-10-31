import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, rename, rm, symlink, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { selectSite, appDirectory } from './site-registry.mjs'

const [command, ...args] = process.argv.slice(2)
const option = (name) => args.includes(name) ? args[args.indexOf(name) + 1] : undefined
const forwardedArgs = () => args.filter((argument, index) => argument !== '--site' && args[index - 1] !== '--site')
const site = await selectSite(option('--site'))
const trashDirectory = resolve(process.env.VITEPRESS_TRASH_DIR ?? resolve(appDirectory, '../.trash', site.id))
const devProjectRoot = resolve(trashDirectory, 'vitepress-project')
const localVitepress = resolve(appDirectory, 'node_modules/.bin/vitepress')
const hostVitepress = resolve(appDirectory, '../node_modules/.bin/vitepress')
const vitepress = existsSync(localVitepress) ? localVitepress : hostVitepress
const env = {
  ...process.env,
  SPMPST_ROOT: site.sourceRoot,
  DOCS_OUTPUT_DIR: site.outputRoot,
  VITEPRESS_SITE_ID: site.id,
  VITEPRESS_SITE_DECLARATION: site.declarationPath,
  VITEPRESS_SITE_ROOT: site.sourceRoot,
  VITEPRESS_TRASH_DIR: trashDirectory,
  VITEPRESS_PROJECT_ROOT: devProjectRoot,
  VITEPRESS_RESOURCES_DIR: process.env.VITEPRESS_RESOURCES_DIR ?? site.resourcesRoot,
  VITEPRESS_SITE_RESOURCES_DIR: process.env.VITEPRESS_SITE_RESOURCES_DIR ?? site.siteResourcesRoot,
}

function run(binary, commandArgs, runEnv = env) {
  const result = spawnSync(binary, commandArgs, { cwd: appDirectory, env: runEnv, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function prepare(prepareEnv = env) {
  run(process.execPath, [join(appDirectory, 'scripts/preparation/pipeline.mjs')], prepareEnv)
}

async function ensureVitepressProject(projectRoot) {
  const configRoot = join(projectRoot, '.vitepress')
  await mkdir(configRoot, { recursive: true })
  for (const name of ['config.ts', 'config', 'theme']) {
    const linkPath = join(configRoot, name)
    if (!existsSync(linkPath)) {
      await symlink(resolve(appDirectory, '.vitepress', name), linkPath, name === 'config.ts' ? 'file' : 'dir')
    }
  }
}

if (command === 'prepare') {
  prepare()
} else if (command === 'check' || command === 'new' || command === 'verify') {
  const script = {
    check: 'scripts/dev/docs-check.mjs',
    new: 'scripts/dev/docs-new.mjs',
    verify: 'scripts/dev/verify.mjs',
  }[command]
  run(process.execPath, [join(appDirectory, script), ...forwardedArgs()])
} else if (command === 'build') {
  await mkdir(dirname(site.outputRoot), { recursive: true })
  const stagingRoot = resolve(dirname(site.outputRoot), 'tmp')
  const stage = join(stagingRoot, `${basename(site.outputRoot)}.stage-${process.pid}`)
  const backup = join(stagingRoot, `${basename(site.outputRoot)}.backup-${process.pid}`)
  await rm(stage, { recursive: true, force: true })
  // Keep a production build isolated from a concurrently running dev server.
  // A normal preparation clears its generated Markdown tree, and sharing that
  // tree with VitePress dev would trigger page reloads across every route.
  const buildEnv = {
    ...env,
    DOCS_OUTPUT_DIR: stage,
    VITEPRESS_TRASH_DIR: join(trashDirectory, 'build'),
    VITEPRESS_PROJECT_ROOT: resolve(trashDirectory, 'build/vitepress-project'),
  }
  try {
    await ensureVitepressProject(buildEnv.VITEPRESS_PROJECT_ROOT)
    prepare(buildEnv)
    run(vitepress, ['build', buildEnv.VITEPRESS_PROJECT_ROOT], buildEnv)
    await mkdir(join(stage, '.spmpst'), { recursive: true })
    await writeFile(join(stage, '.spmpst', 'build-timestamp'), `${new Date().toISOString()}\n`)
    run(process.execPath, [join(appDirectory, 'scripts/build/check-file-links.mjs'), stage], buildEnv)
    try { await rename(site.outputRoot, backup) } catch (error) { if (error.code !== 'ENOENT') throw error }
    await rename(stage, site.outputRoot)
    await rm(backup, { recursive: true, force: true })
    process.stdout.write(`[site] ${site.name} built to ${site.outputRoot}\n`)
  } catch (error) {
    await rm(stage, { recursive: true, force: true })
    try { await rename(backup, site.outputRoot) } catch (restoreError) { if (restoreError.code !== 'ENOENT') throw restoreError }
    throw error
  }
} else if (command === 'serve') {
  await ensureVitepressProject(devProjectRoot)
  prepare()
  const port = process.env.PORT ?? '4173'
  const web = spawn(vitepress, ['dev', devProjectRoot, '--host', process.env.HOST ?? '127.0.0.1', '--port', port, '--strictPort'], { cwd: appDirectory, env, stdio: 'inherit' })
  const watcher = spawn(process.execPath, [join(appDirectory, 'scripts/dev/watch.mjs')], { cwd: appDirectory, env, stdio: 'inherit' })
  const stop = () => { web.kill('SIGTERM'); watcher.kill('SIGTERM') }
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
  const result = await Promise.race([web, watcher].map((child) => new Promise((resolveExit) => child.once('exit', (code) => resolveExit(code ?? 1)))))
  stop()
  process.exit(typeof result === 'number' ? result : 0)
} else if (command === 'preview') {
  run(process.execPath, [join(appDirectory, 'scripts/site.mjs'), 'build', '--site', site.id])
  run(process.execPath, [join(appDirectory, 'scripts/dev/preview-server.mjs')], { ...env, VITEPRESS_TRASH_DIR: join(trashDirectory, 'build'), VITEPRESS_PROJECT_ROOT: resolve(trashDirectory, 'build/vitepress-project') })
} else if (command === 'serve-build') {
  run(process.execPath, [join(appDirectory, 'scripts/dev/preview-server.mjs')], { ...env, VITEPRESS_TRASH_DIR: join(trashDirectory, 'build'), VITEPRESS_PROJECT_ROOT: resolve(trashDirectory, 'build/vitepress-project') })
} else if (command === 'watch') {
  const watcher = spawn(process.execPath, [join(appDirectory, 'scripts/dev/watch.mjs')], {
    cwd: appDirectory,
    env: { ...env, DOCS_WATCH_BUILD: '1' },
    stdio: 'inherit',
  })
  const stop = () => watcher.kill('SIGTERM')
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
  watcher.once('exit', (code) => process.exit(code ?? 0))
} else if (command === 'clean') {
  for (const path of [
    join(trashDirectory, 'generated-guides'),
    join(trashDirectory, 'generated-guides.md'),
    join(trashDirectory, 'vitepress-generated'),
    join(trashDirectory, 'vitepress-cache'),
    join(trashDirectory, 'vitepress-project'),
    join(trashDirectory, 'build/vitepress-project'),
    join(trashDirectory, 'app-vitepress-cache'),
    join(trashDirectory, 'legacy-vitepress-cache'),
    join(trashDirectory, 'mermaid-cache'),
    join(trashDirectory, 'build.lock'),
    join(trashDirectory, 'prepare.lock'),
    join(appDirectory, '.vitepress/cache'),
  ]) await rm(path, { recursive: true, force: true })
  await rm(site.outputRoot, { recursive: true, force: true })
  await rm(resolve(dirname(site.outputRoot), 'tmp'), { recursive: true, force: true })
  process.stdout.write(`[site] Cleaned ${site.id} generated files and ${site.outputRoot}\n`)
} else {
  process.stderr.write('Usage: node scripts/site.mjs <prepare|build|serve|preview|serve-build|watch|clean|check|new|verify> [args] [--site <id>]\n')
  process.exitCode = 2
}
