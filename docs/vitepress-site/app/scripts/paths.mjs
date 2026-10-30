import { resolve } from 'node:path'

export function resolveSitePaths(appDirectory) {
  const sourceRoot = resolve(process.env.SPMPST_ROOT ?? process.cwd())
  const trashDirectory = resolve(process.env.VITEPRESS_TRASH_DIR ?? resolve(appDirectory, '../.trash', process.env.VITEPRESS_SITE_ID ?? 'unselected-site'))
  const resourcesDirectory = resolve(process.env.VITEPRESS_RESOURCES_DIR ?? resolve(appDirectory, '../resources'))
  const siteResourcesDirectory = resolve(process.env.VITEPRESS_SITE_RESOURCES_DIR ?? resolve(sourceRoot, 'resources'))
  return {
    appDirectory,
    sourceRoot,
    resourcesDirectory,
    siteResourcesDirectory,
    trashDirectory,
    generatedGuides: resolve(trashDirectory, 'generated-guides'),
    generatedMetadata: resolve(trashDirectory, 'vitepress-generated'),
    vitepressCache: resolve(trashDirectory, 'vitepress-cache'),
    mermaidCache: resolve(trashDirectory, 'mermaid-cache'),
    buildLock: resolve(trashDirectory, 'build.lock'),
  }
}
