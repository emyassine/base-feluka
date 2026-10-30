import { resolve } from 'node:path'

export function resolveSitePaths(appDirectory) {
  const trashDirectory = resolve(process.env.VITEPRESS_TRASH_DIR ?? resolve(appDirectory, '../.trash'))
  const resourcesDirectory = resolve(process.env.VITEPRESS_RESOURCES_DIR ?? resolve(appDirectory, '../resources'))
  const sourceRoot = resolve(process.env.SPMPST_ROOT ?? resolve(appDirectory, '../../'))
  return {
    appDirectory,
    sourceRoot,
    resourcesDirectory,
    trashDirectory,
    generatedGuides: resolve(trashDirectory, 'generated-guides'),
    generatedMetadata: resolve(trashDirectory, 'vitepress-generated'),
    vitepressCache: resolve(trashDirectory, 'vitepress-cache'),
    mermaidCache: resolve(trashDirectory, 'mermaid-cache'),
    buildLock: resolve(trashDirectory, 'build.lock'),
  }
}
