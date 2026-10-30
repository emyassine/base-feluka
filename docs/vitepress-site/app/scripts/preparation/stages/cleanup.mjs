import { readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'

export async function runCleanup(ctx) {
  const { siteDirectory, configDirectory, copyAsset, publicPagePath, publicUrl, publicMarkdownLink, config, styleFiles, collections, siteThemeSlots, themeSlots, iconNamePattern, flowchartPalette, nodeBorderWidth, defaultLanguage, projectConfig, projectDirectories, findIcon, resolveIcon, resolveSidebarIcon, outputDirectory, generatedDirectory, mermaidCache, mermaidConfigPath, mermaidConfig, darkMessageTextColor, incremental, records, routeMap, generatedFiles, navigationOrder, sidebarConfigurations, sidebarIconSources, sidebarPageIcons, directories, guideUris, cleanDir, cleanFile, sourceLanguage, sourceRoot, collectionMetadata, localizedValue, stagedPath, copyIfChanged, writeIfChanged, scan, frontmatterScalar, humanize, readingMetrics, generatedFonts, generatedGuideColors, generatedOgImages, generatedCollectionNavigation, generatedCollectionPages, generatedMarkdown, generatedGuideThemeSlotsByRoute, prefixDefaultLanguage } = ctx
if (incremental) {
  async function removeStale(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) {
        await removeStale(path)
        if ((await readdir(path)).length === 0) await rm(path, { recursive: true, force: true })
      } else if (!generatedFiles.has(path)) {
        await rm(path, { force: true })
      }
    }
  }
  await removeStale(outputDirectory)
}
  const metrics = ctx.metrics ?? {}
  process.stdout.write(`Prepared ${records.length + (metrics.generatedSeoPages ?? 0)} Markdown pages; Mermaid diagrams: ${metrics.diagramsCached ?? 0} cached, ${metrics.diagramsRendered ?? 0} rendered.\n`)
}
