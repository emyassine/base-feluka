import { access, readFile, readdir } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'
import { sortNavigationEntries } from '../../shared/navigation-order.mjs'

export async function runDirectoryIndexes(ctx) {
  const { siteDirectory, configDirectory, copyAsset, publicPagePath, publicUrl, publicMarkdownLink, config, styleFiles, collections, siteThemeSlots, themeSlots, iconNamePattern, flowchartPalette, nodeBorderWidth, defaultLanguage, projectConfig, projectDirectories, findIcon, resolveIcon, resolveSidebarIcon, outputDirectory, generatedDirectory, mermaidCache, mermaidConfigPath, mermaidConfig, darkMessageTextColor, incremental, records, routeMap, generatedFiles, navigationOrder, sidebarConfigurations, sidebarIconSources, sidebarPageIcons, directories, guideUris, cleanDir, cleanFile, sourceLanguage, sourceRoot, collectionMetadata, localizedValue, stagedPath, copyIfChanged, writeIfChanged, scan, frontmatterScalar, humanize, readingMetrics, generatedFonts, generatedGuideColors, generatedOgImages, generatedCollectionNavigation, generatedCollectionPages, generatedMarkdown, generatedGuideThemeSlotsByRoute, prefixDefaultLanguage } = ctx
for (const directory of [...directories].reverse()) {
  const sourceRelative = relative(sourceRoot, directory.sourcePath).split(sep).join('/')
  const guide = config.subguides.find(({ path }) => sourceRelative === path || sourceRelative.startsWith(`${path}/`))
  if (!guide) continue
  const sourceNames = Object.fromEntries(directory.entries.map((entry) => [entry.name, entry.name]))
  const sortedEntries = sortNavigationEntries(directory.entries.filter((entry) => entry.isDirectory() || /\.md$/i.test(entry.name)), sourceNames)
  for (const language of config.languages) {
    const directoryTarget = stagedPath(directory.sourcePath, language)
    const indexPath = join(directoryTarget, 'index.md')
    if (!generatedMarkdown.has(indexPath)) {
      let childPage
      const seen = new Set()
      for (const entry of sortedEntries) {
        if (entry.isDirectory()) {
          const candidates = [join(stagedPath(join(directory.sourcePath, entry.name), language), 'index.md'), join(stagedPath(join(directory.sourcePath, entry.name), defaultLanguage), 'index.md')]
          childPage = candidates.find((candidate) => generatedMarkdown.has(candidate))
        } else {
          const slug = cleanFile(entry.name)
          if (seen.has(slug)) continue
          seen.add(slug)
          const family = sortedEntries.filter((candidate) => !candidate.isDirectory() && cleanFile(candidate.name) === slug)
          const selected = family.find((candidate) => sourceLanguage(candidate.name).toLowerCase() === language.toLowerCase())
            ?? family.find((candidate) => sourceLanguage(candidate.name).toLowerCase() === defaultLanguage.toLowerCase())
          if (selected) {
            const localizedCandidate = stagedPath(join(directory.sourcePath, selected.name), language)
            const defaultCandidate = stagedPath(join(directory.sourcePath, selected.name), defaultLanguage)
            childPage = generatedMarkdown.has(localizedCandidate) ? localizedCandidate : defaultCandidate
          }
        }
        if (childPage && generatedMarkdown.has(childPage)) break
      }
      if (!childPage || !generatedMarkdown.has(childPage)) continue
      let markdown = await readFile(childPage, 'utf8')
      if (/^---\s*\n/.test(markdown)) {
        const end = markdown.indexOf('\n---', 4)
        if (end < 0) throw new Error(`Malformed frontmatter in ${childPage}`)
        const frontmatter = markdown.slice(4, end)
        if (!/^search\s*:/m.test(frontmatter)) markdown = `---\n${frontmatter}\nsearch: false${markdown.slice(end)}`
        else markdown = markdown.replace(/^search\s*:\s*.*$/m, 'search: false')
      } else {
        markdown = `---\nsearch: false\n---\n\n${markdown}`
      }
      generatedMarkdown.add(indexPath)
      generatedFiles.add(indexPath)
      await writeIfChanged(indexPath, markdown)
    }
    const languageRoot = relative(outputDirectory, directoryTarget).replace(/\\/g, '/') === language.toLowerCase()
    const noSlashAlias = `${directoryTarget}.md`
    if (!languageRoot && !generatedMarkdown.has(noSlashAlias)) {
      let markdown = await readFile(indexPath, 'utf8')
      if (/^---\s*\n/.test(markdown)) {
        const end = markdown.indexOf('\n---', 4)
        if (end < 0) throw new Error(`Malformed frontmatter in ${indexPath}`)
        const frontmatter = markdown.slice(4, end)
        if (!/^search\s*:/m.test(frontmatter)) markdown = `---\n${frontmatter}\nsearch: false${markdown.slice(end)}`
        else markdown = markdown.replace(/^search\s*:\s*.*$/m, 'search: false')
      } else {
        markdown = `---\nsearch: false\n---\n\n${markdown}`
      }
      generatedMarkdown.add(noSlashAlias)
      generatedFiles.add(noSlashAlias)
      await writeIfChanged(noSlashAlias, markdown)
    }
  }
}
  return ctx
}
