export interface SiteLayout {
  treeRoot: string
  siteDir: string
  guidesDir: string
  collectionsDir: string
  resourcesDir: string
  targetResourcesDir: string
  siteResourcesDir: string
  flagsDir: string
  iconsDir: string
  mermaidConfigPath: string
  configBase: string
  version: 'spmpst'
}
export function resolveLayout(siteDirectory: string): SiteLayout
