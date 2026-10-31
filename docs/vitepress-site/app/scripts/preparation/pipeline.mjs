import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { performance } from 'node:perf_hooks'
import { prepareSources } from './source-stage.mjs'
import { resolveSitePaths } from '../paths.mjs'
import { prepareContent } from './content-stage.mjs'
import { assertIndexPath, createPreparationContext } from './context.mjs'
import { runTransformMarkdown } from './stages/transform-markdown.mjs'
import { runLanguageFallbacks } from './stages/language-fallbacks.mjs'
import { runSeoPages } from './stages/seo-pages.mjs'
import { runDirectoryIndexes } from './stages/directory-indexes.mjs'
import { runPager } from './stages/pager.mjs'
import { runCleanup } from './stages/cleanup.mjs'

const siteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const paths = resolveSitePaths(siteDirectory)
await mkdir(paths.trashDirectory, { recursive: true })

const lockPath = join(paths.trashDirectory, 'prepare.lock')
const lockOwner = join(lockPath, 'pid')
const staleLockMilliseconds = 60_000

function processIsAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return error.code === 'EPERM'
  }
}

async function lockIsStale() {
  try {
    const [metadata, pidText] = await Promise.all([stat(lockPath), readFile(lockOwner, 'utf8').catch(() => '')])
    const pid = Number.parseInt(pidText, 10)
    if (Number.isInteger(pid) && pid > 0) return !processIsAlive(pid)
    return Date.now() - metadata.mtimeMs > staleLockMilliseconds
  } catch (error) {
    return error.code === 'ENOENT'
  }
}

async function acquireLock() {
  const started = performance.now()
  for (;;) {
    try {
      await mkdir(lockPath)
      await writeFile(lockOwner, `${process.pid}\n`)
      return async () => rm(lockPath, { recursive: true, force: true })
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
    }
    if (await lockIsStale()) {
      await rm(lockPath, { recursive: true, force: true })
      continue
    }
    if (performance.now() - started > 30_000) {
      throw new Error(`Another preparation is still holding ${lockPath}; stop it or remove the directory.`)
    }
    await new Promise((resume) => setTimeout(resume, 25))
  }
}

const timings = []
function now() {
  return performance.now()
}

const releaseLock = process.env.DOCS_PREPARE_NO_LOCK === '1' ? async () => {} : await acquireLock()
try {
  let started = now()
  const sourceState = await prepareSources(siteDirectory)
  timings.push(['sources', now() - started])

  started = now()
  const contentState = await prepareContent(sourceState)
  timings.push(['content', now() - started])

  const ctx = createPreparationContext(siteDirectory, sourceState, contentState)
  assertIndexPath(ctx)

  started = now()
  ctx.metrics = await runTransformMarkdown(ctx)
  timings.push(['markdown', now() - started])

  started = now()
  await runLanguageFallbacks(ctx)
  timings.push(['fallbacks', now() - started])

  started = now()
  ctx.metrics.generatedSeoPages = await runSeoPages(ctx)
  timings.push(['seo', now() - started])

  started = now()
  await runDirectoryIndexes(ctx)
  timings.push(['indexes', now() - started])

  started = now()
  await runPager(ctx)
  timings.push(['pager', now() - started])

  started = now()
  await runCleanup(ctx)
  timings.push(['cleanup', now() - started])

  if (process.env.DOCS_PREPARE_TIMING === '1') {
    const total = timings.reduce((sum, [, duration]) => sum + duration, 0)
    process.stdout.write(`[prepare timing] ${timings.map(([name, duration]) => `${name} ${duration.toFixed(0)}ms`).join(' · ')} · total ${total.toFixed(0)}ms\n`)
  }
} finally {
  await releaseLock()
}
