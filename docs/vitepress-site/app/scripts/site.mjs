import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, rename, rm, symlink, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { selectSite, appDirectory } from './site-registry.mjs'
import { createSite } from './spmpst/create-site.mjs'

const [command, ...args] = process.argv.slice(2)
if (command === 'new-site') {
  await createSite(args[0])
  process.exit(0)
}
const option = (name) => args.includes(name) ? args[args.indexOf(name) + 1] : undefined
const forwardedArgs = () => args.filter((argument, index) => argument !== '--site' && args[index - 1] !== '--site')
const site = await selectSite(option('--site'))
const trashDirectory = resolve(process.env.SPMPST_CACHE_DIR ?? resolve(appDirectory, '../.trash', site.id))
const devProjectRoot = resolve(trashDirectory, 'vitepress-project')
const localVitepress = resolve(appDirectory, 'node_modules/.bin/vitepress')
const hostVitepress = resolve(appDirectory, '../node_modules/.bin/vitepress')
const vitepress = existsSync(localVitepress) ? localVitepress : hostVitepress
const env = {
  ...process.env,
  SPMPST_PATHS: JSON.stringify(site.paths),
  SPMPST_SITE_ID: site.id,
  SPMPST_ROOT: site.paths.root,
  SPMPST_OUT_DIR: site.paths.output,
  SPMPST_CACHE_DIR: trashDirectory,
  SPMPST_GENERATED_DIR: devProjectRoot,
  SPMPST_MODE: 'dev',
  SPMPST_DECLARATION: site.declarationPath,
}

function run(binary, commandArgs, runEnv = env) {
  const result = spawnSync(binary, commandArgs, { cwd: appDirectory, env: runEnv, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function toolchainVariables(runEnv = env) {
  return {
    siteId: site.id,
    sourceDir: site.paths.root,
    generatedDir: runEnv.SPMPST_GENERATED_DIR ?? devProjectRoot,
    stageDir: runEnv.SPMPST_STAGE_DIR ?? site.paths.output,
    outDir: site.paths.output,
    cacheDir: trashDirectory,
    host: runEnv.HOST ?? '127.0.0.1',
    port: runEnv.PORT ?? '4173',
  }
}

function expandAction(action, runEnv = env) {
  if (!action || typeof action.command !== 'string' || !Array.isArray(action.args)) {
    throw new Error(`${site.declarationPath}: toolchain action must define command and args`)
  }
  const values = toolchainVariables(runEnv)
  const expand = (value) => String(value).replace(/\{([A-Za-z]+)\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`${site.declarationPath}: unknown toolchain placeholder {${key}}`)
    return values[key]
  })
  return { command: expand(action.command), args: action.args.map(expand) }
}

function runAction(action, runEnv = env) {
  const { command: executable, args: commandArgs } = expandAction(action, runEnv)
  process.stdout.write(`[spmpst] ${executable} ${commandArgs.join(' ')} (cwd: ${site.toolchainCwd})\n`)
  const result = spawnSync(executable, commandArgs, { cwd: site.toolchainCwd, env: runEnv, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function installToolchain() {
  const install = site.toolchain.install
  if (!install) return
  const shouldRun = install.when === 'always' || (install.when === 'missing' && !existsSync(resolve(site.toolchainCwd, 'node_modules')))
  if (shouldRun) runAction(install)
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
  installToolchain()
  await mkdir(dirname(site.paths.output), { recursive: true })
  const stagingRoot = resolve(dirname(site.paths.output), 'tmp')
  const stage = join(stagingRoot, `${basename(site.paths.output)}.stage-${process.pid}`)
  const backup = join(stagingRoot, `${basename(site.paths.output)}.backup-${process.pid}`)
  await rm(stage, { recursive: true, force: true })
  // Keep a production build isolated from a concurrently running dev server.
  // A normal preparation clears its generated Markdown tree, and sharing that
  // tree with VitePress dev would trigger page reloads across every route.
  const buildEnv = {
    ...env,
    SPMPST_PATHS: JSON.stringify({ ...site.paths, output: stage }),
    SPMPST_STAGE_DIR: stage,
    SPMPST_OUT_DIR: stage,
    SPMPST_CACHE_DIR: join(trashDirectory, 'build'),
    SPMPST_GENERATED_DIR: resolve(trashDirectory, 'build/vitepress-project'),
    SPMPST_MODE: 'build',
    SPMPST_GENERATED_DIR: resolve(trashDirectory, 'build/vitepress-project'),
  }
  try {
    await ensureVitepressProject(buildEnv.SPMPST_GENERATED_DIR)
    prepare(buildEnv)
    runAction(site.toolchain.build, buildEnv)
    await mkdir(join(stage, '.spmpst'), { recursive: true })
    await writeFile(join(stage, '.spmpst', 'build-timestamp'), `${new Date().toISOString()}\n`)
    run(process.execPath, [join(appDirectory, 'scripts/build/check-file-links.mjs'), stage], buildEnv)
    try { await rename(site.paths.output, backup) } catch (error) { if (error.code !== 'ENOENT') throw error }
    await rename(stage, site.paths.output)
    await rm(backup, { recursive: true, force: true })
    process.stdout.write(`[site] ${site.name} built to ${site.paths.output}\n`)
  } catch (error) {
    await rm(stage, { recursive: true, force: true })
    try { await rename(backup, site.paths.output) } catch (restoreError) { if (restoreError.code !== 'ENOENT') throw restoreError }
    throw error
  }
} else if (command === 'serve') {
  installToolchain()
  await ensureVitepressProject(devProjectRoot)
  prepare()
  const port = process.env.PORT ?? '4173'
  const devCommand = expandAction(site.toolchain.dev, env)
  const web = spawn(devCommand.command, devCommand.args, { cwd: site.toolchainCwd, env, stdio: 'inherit' })
  const watcher = spawn(process.execPath, [join(appDirectory, 'scripts/dev/watch.mjs')], { cwd: appDirectory, env, stdio: 'inherit' })
  const stop = () => { web.kill('SIGTERM'); watcher.kill('SIGTERM') }
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
  const result = await Promise.race([web, watcher].map((child) => new Promise((resolveExit) => child.once('exit', (code) => resolveExit(code ?? 1)))))
  stop()
  process.exit(typeof result === 'number' ? result : 0)
} else if (command === 'preview') {
  run(process.execPath, [join(appDirectory, 'scripts/site.mjs'), 'build', '--site', site.id])
  run(process.execPath, [join(appDirectory, 'scripts/dev/preview-server.mjs')], { ...env, SPMPST_CACHE_DIR: join(trashDirectory, 'build'), SPMPST_GENERATED_DIR: resolve(trashDirectory, 'build/vitepress-project') })
} else if (command === 'serve-build') {
  run(process.execPath, [join(appDirectory, 'scripts/dev/preview-server.mjs')], { ...env, SPMPST_CACHE_DIR: join(trashDirectory, 'build'), SPMPST_GENERATED_DIR: resolve(trashDirectory, 'build/vitepress-project') })
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
  await rm(site.paths.output, { recursive: true, force: true })
  await rm(resolve(dirname(site.paths.output), 'tmp'), { recursive: true, force: true })
  process.stdout.write(`[site] Cleaned ${site.id} generated files and ${site.paths.output}\n`)
} else {
  process.stderr.write('Usage: node scripts/site.mjs <prepare|build|serve|preview|serve-build|watch|clean|check|new|new-site|verify> [args] [--site <id>]\n')
  process.exitCode = 2
}
