export interface SitePaths {
  appDirectory: string
  sourceRoot: string
  resourcesDirectory: string
  trashDirectory: string
  generatedGuides: string
  generatedMetadata: string
  vitepressCache: string
  mermaidCache: string
  buildLock: string
}
export function resolveSitePaths(appDirectory: string): SitePaths
