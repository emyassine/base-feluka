import { resolve } from 'node:path'

/** Resolve the source tree while retaining compatibility with the current tree. */
export function resolveLayout(siteDirectory) {
  const treeRoot = resolve(process.env.SPMPST_ROOT ?? resolve(siteDirectory, '../..'))
  const guidesDir = resolve(treeRoot, 'src/guides')
  const resourcesDir = resolve(treeRoot, 'resources')
  const targetResourcesDir = resolve(process.env.VITEPRESS_RESOURCES_DIR ?? resolve(siteDirectory, '../resources'))
  const siteResourcesDir = resolve(process.env.VITEPRESS_SITE_RESOURCES_DIR ?? resolve(siteDirectory, '../sites/feluqa/resources'))
  return {
    treeRoot,
    siteDir: resolve(treeRoot, '.site'),
    guidesDir,
    collectionsDir: resolve(treeRoot, 'src/collections'),
    resourcesDir,
    targetResourcesDir,
    siteResourcesDir,
    flagsDir: resolve(targetResourcesDir, 'flags/language'),
    iconsDir: resolve(targetResourcesDir, 'icons'),
    mermaidConfigPath: resolve(siteResourcesDir, 'diagrams/mermaid.json'),
    configBase: treeRoot,
    version: 'spmpst',
  }
}
