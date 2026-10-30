import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir } from 'node:fs/promises'
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
if (process.env.DOCS_PREPARE_LOCK_HELD !== '1') {
  const result = spawnSync('flock', ['--exclusive', paths.buildLock, process.execPath, fileURLToPath(import.meta.url)], {
    cwd: siteDirectory,
    env: { ...process.env, DOCS_PREPARE_LOCK_HELD: '1' },
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  process.exit(result.status ?? 1)
}

const sourceState = await prepareSources(siteDirectory)
const contentState = await prepareContent(sourceState)
const ctx = createPreparationContext(siteDirectory, sourceState, contentState)
assertIndexPath(ctx)
ctx.metrics = await runTransformMarkdown(ctx)
await runLanguageFallbacks(ctx)
ctx.metrics.generatedSeoPages = await runSeoPages(ctx)
await runDirectoryIndexes(ctx)
await runPager(ctx)
await runCleanup(ctx)
