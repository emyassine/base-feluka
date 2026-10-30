export interface SiteLayout {
  treeRoot: string
  siteDir: string
  guidesDir: string
  collectionsDir: string
  resourcesDir: string
  flagsDir: string
  iconsDir: string
  mermaidConfigPath: string
  configBase: string
  version: 'legacy' | 'spmpst'
}
export function resolveLayout(siteDirectory: string): SiteLayout
