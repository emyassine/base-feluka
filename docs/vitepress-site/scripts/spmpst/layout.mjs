import { resolve } from 'node:path'

/** Resolve the source tree while retaining compatibility with the current tree. */
export function resolveLayout(siteDirectory) {
  const treeRoot = resolve(process.env.SPMPST_ROOT ?? resolve(siteDirectory, '..'))
  const guidesDir = resolve(treeRoot, 'src/guides')
  const resourcesDir = resolve(treeRoot, 'resources')
  return {
    treeRoot,
    siteDir: resolve(treeRoot, '.site'),
    guidesDir,
    collectionsDir: resolve(treeRoot, 'src/collections'),
    resourcesDir,
    flagsDir: resolve(resourcesDir, 'flags/language'),
    iconsDir: resolve(resourcesDir, 'icons'),
    mermaidConfigPath: resolve(resourcesDir, 'diagrams/mermaid.json'),
    configBase: treeRoot,
    version: 'spmpst',
  }
}
