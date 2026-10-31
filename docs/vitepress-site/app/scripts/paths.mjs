import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/** Resolve the single declared SpmpstPaths object and add tool-managed scratch paths. */
export function resolveSitePaths(appDirectory) {
  const declarationPath = resolve(process.env.SPMPST_DECLARATION ?? resolve(process.cwd(), 'spmpst.json'))
  let declared
  try {
    declared = process.env.SPMPST_PATHS
      ? JSON.parse(process.env.SPMPST_PATHS)
      : JSON.parse(readFileSync(declarationPath, 'utf8')).paths
  }
  catch (error) { throw new Error(`Unable to load SpmpstPaths from ${declarationPath}: ${error.message}`) }
  if (!declared || typeof declared !== 'object' || Array.isArray(declared)) {
    throw new Error(`${declarationPath}: paths must define the complete SpmpstPaths object`)
  }
  const resolvedPaths = Object.fromEntries(Object.entries(declared).map(([key, value]) => [
    key,
    key === 'configFiles'
      ? Object.fromEntries(Object.entries(value).map(([name, path]) => [name, resolve(dirname(declarationPath), path)]))
      : resolve(dirname(declarationPath), value),
  ]))
  const siteId = process.env.SPMPST_SITE_ID ?? 'unselected-site'
  const scratch = resolve(process.env.SPMPST_CACHE_DIR ?? resolve(appDirectory, '../.trash', siteId))
  const generatedProject = resolve(process.env.SPMPST_GENERATED_DIR ?? resolve(scratch, 'vitepress-project'))
  const finalOutput = resolvedPaths.output
  const stage = process.env.SPMPST_STAGE_DIR ? resolve(process.env.SPMPST_STAGE_DIR) : null
  return Object.freeze({
    ...resolvedPaths,
    output: stage ?? finalOutput,
    finalOutput,
    stage,
    declaration: declarationPath,
    appDirectory,
    scratch,
    generatedProject,
    generatedGuides: resolve(scratch, 'generated-guides'),
    generatedMetadata: resolve(scratch, 'vitepress-generated'),
    vitepressCache: resolve(scratch, 'vitepress-cache'),
    mermaidCache: resolve(scratch, 'mermaid-cache'),
    buildLock: resolve(scratch, 'build.lock'),
  })
}
