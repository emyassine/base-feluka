import { access, mkdir, readFile } from 'node:fs/promises'
import { dirname, join, resolve, sep } from 'node:path'
import { isDefaultLanguage } from '../../spmpst/routing.mjs'

export async function runLanguageFallbacks(ctx) {
  const { siteDirectory, configDirectory, copyAsset, publicPagePath, publicUrl, publicMarkdownLink, config, styleFiles, collections, siteThemeSlots, themeSlots, iconNamePattern, flowchartPalette, nodeBorderWidth, defaultLanguage, projectConfig, projectDirectories, findIcon, resolveIcon, resolveSidebarIcon, outputDirectory, generatedDirectory, mermaidCache, mermaidConfigPath, mermaidConfig, darkMessageTextColor, incremental, records, routeMap, generatedFiles, navigationOrder, sidebarConfigurations, sidebarIconSources, sidebarPageIcons, directories, guideUris, cleanDir, cleanFile, sourceLanguage, sourceRoot, collectionMetadata, localizedValue, stagedPath, copyIfChanged, writeIfChanged, scan, frontmatterScalar, humanize, readingMetrics, generatedFonts, generatedGuideColors, generatedOgImages, generatedCollectionNavigation, generatedCollectionPages, generatedMarkdown, generatedGuideThemeSlotsByRoute, prefixDefaultLanguage } = ctx
const defaultPageRecords = records.filter(({ from }) => sourceLanguage(from).toLowerCase() === defaultLanguage.toLowerCase())
const defaultRouteUrls = new Set(defaultPageRecords.map(({ to }) => publicMarkdownLink(to).replace(/\/$/, '') || '/'))
for (const directory of directories) {
  const indexPath = join(stagedPath(directory.sourcePath, defaultLanguage), 'index.md')
  defaultRouteUrls.add(publicMarkdownLink(indexPath).replace(/\/$/, '') || '/')
}
for (const language of config.languages) {
  if (isDefaultLanguage(language, defaultLanguage)) continue
  const requestedLabel = config.languageLabels[language]
  const fallbackLabel = config.languageLabels[defaultLanguage]
  const notice = config.fallbackNotices[language]
    .replaceAll('{requested}', requestedLabel)
    .replaceAll('{fallback}', fallbackLabel)
  for (const record of defaultPageRecords) {
    const localizedTarget = stagedPath(record.from, language)
    if (generatedMarkdown.has(localizedTarget)) continue
    sidebarPageIcons[publicMarkdownLink(localizedTarget)] = record.iconAsset
    let markdown = await readFile(record.to, 'utf8')
    if (/^---\s*\n/.test(markdown)) {
      const end = markdown.indexOf('\n---', 4)
      if (end < 0) throw new Error(`Malformed frontmatter in ${record.to}`)
      const metadata = `requestedLanguage: ${JSON.stringify(language)}\ncontentLanguage: ${JSON.stringify(defaultLanguage)}\nlanguageFallbackNotice: ${JSON.stringify(notice)}\n`
      const frontmatter = markdown.slice(4, end).replace(/^lang:\s*.*$/m, `lang: ${JSON.stringify(language)}`)
      markdown = `---\n${metadata}${frontmatter}\n---${markdown.slice(end + 4)}`
    } else {
      markdown = `---\nrequestedLanguage: ${JSON.stringify(language)}\ncontentLanguage: ${JSON.stringify(defaultLanguage)}\nlanguageFallbackNotice: ${JSON.stringify(notice)}\n---\n\n${markdown}`
    }
    markdown = markdown.replace(/(!?\[[^\]]*\]\()([^)]+)(\))/g, (all, before, href, after) => {
      if (before.startsWith('!') || !href.startsWith('/') || href.startsWith('//')) return all
      const path = href.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/'
      if (!defaultRouteUrls.has(path)) return all
      return `${before}/${language}${href}${after}`
    })
    // Markdown SFC imports resolve from the localized file's directory. Keep
    // relative assets available at that exact path for generated fallback pages.
    for (const [, , specifier] of markdown.matchAll(/\bfrom\s+(['"])(\.{1,2}\/[^'"]+)\1/g)) {
      const sourceAsset = resolve(dirname(record.to), specifier)
      const localizedAsset = resolve(dirname(localizedTarget), specifier)
      try {
        await access(sourceAsset)
        await mkdir(dirname(localizedAsset), { recursive: true })
        await copyIfChanged(sourceAsset, localizedAsset)
        generatedFiles.add(localizedAsset)
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
    generatedMarkdown.add(localizedTarget)
    generatedFiles.add(localizedTarget)
    await writeIfChanged(localizedTarget, markdown)
  }
}
  return ctx
}
