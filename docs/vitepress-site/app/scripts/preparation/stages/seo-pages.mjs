import { extname, isAbsolute, join } from 'node:path'
import { localePrefix } from '../../spmpst/routing.mjs'
import { writeStagedMarkdownIfChanged } from '../../spmpst/fs-utils.mjs'

export async function runSeoPages(ctx) {
  const { siteDirectory, configDirectory, copyAsset, publicPagePath, publicUrl, publicMarkdownLink, config, styleFiles, collections, siteThemeSlots, themeSlots, iconNamePattern, flowchartPalette, nodeBorderWidth, defaultLanguage, projectConfig, projectDirectories, findIcon, resolveIcon, resolveSidebarIcon, outputDirectory, generatedDirectory, mermaidCache, mermaidConfigPath, mermaidConfig, darkMessageTextColor, incremental, records, routeMap, generatedFiles, navigationOrder, sidebarConfigurations, sidebarIconSources, sidebarPageIcons, directories, guideUris, cleanDir, cleanFile, sourceLanguage, sourceRoot, collectionMetadata, localizedValue, stagedPath, copyIfChanged, writeIfChanged, scan, frontmatterScalar, humanize, readingMetrics, generatedFonts, generatedGuideColors, generatedOgImages, generatedCollectionNavigation, generatedCollectionPages, generatedMarkdown, generatedGuideThemeSlotsByRoute, prefixDefaultLanguage } = ctx
let generatedSeoPages = 0
const seoPath = config.seo?.path ?? 'faq'
const seoLocales = config.seo?.locales ?? {}
for (const [language, locale] of Object.entries(seoLocales)) {
  if (!locale || (!locale.quickLinks?.length && !locale.faq?.length)) continue
  const localizedPath = [...localePrefix(language, defaultLanguage, prefixDefaultLanguage), seoPath].filter(Boolean).join('/')
  const pathParts = localizedPath.split('/')
  const indexPath = join(outputDirectory, ...pathParts, 'index.md')
  const noSlashAlias = join(outputDirectory, ...pathParts.slice(0, -1), `${pathParts.at(-1)}.md`)
  if (generatedMarkdown.has(indexPath) || generatedMarkdown.has(noSlashAlias)) {
    throw new Error(`SEO page path conflicts with a documentation page: ${localizedPath}`)
  }
  const title = locale.pageTitle ?? locale.faqTitle
  const description = locale.description
  const quickLinks = (locale.quickLinks ?? []).map((link) => `- [${link.label}](${link.url}) — ${link.description}`).join('\n')
  const answers = (locale.faq ?? []).map((item) => `### ${item.question}\n\n${item.answer}`).join('\n\n')
  const icon = locale.icon
  if (typeof icon !== 'string' || (!iconNamePattern.test(icon) && !(isAbsolute(icon) && extname(icon).toLowerCase() === '.svg'))) {
    throw new Error(`seo.locales.${language}.icon must name an SVG in project.iconLibrary`)
  }
  const iconPath = isAbsolute(icon) ? icon : resolveIcon(icon, `seo.locales.${language}`)
  const iconAsset = await copyAsset(iconPath)
  const content = `---\ntitle: ${JSON.stringify(title)}\nsidebarTitle: ${JSON.stringify(locale.pageNavTitle)}\nicon: ${JSON.stringify(icon)}\ndescription: ${JSON.stringify(description)}\nlang: ${JSON.stringify(language)}\n---\n\n# ${title}\n\n${locale.quickLinks?.length ? `## ${locale.quickLinksTitle}\n\n${quickLinks}\n\n` : ''}${locale.faq?.length ? `## ${locale.faqTitle}\n\n${answers}\n` : ''}`
  sidebarPageIcons[publicMarkdownLink(indexPath)] = iconAsset
  sidebarPageIcons[publicMarkdownLink(noSlashAlias)] = iconAsset
  generatedMarkdown.add(indexPath)
  generatedFiles.add(indexPath)
  await writeStagedMarkdownIfChanged(indexPath, content)
  generatedMarkdown.add(noSlashAlias)
  generatedFiles.add(noSlashAlias)
  await writeStagedMarkdownIfChanged(noSlashAlias, content.replace(/\n---\n/, '\nsearch: false\n---\n'))
  generatedSeoPages += 1
}

await writeIfChanged(join(generatedDirectory, 'sidebar-page-icons.json'), JSON.stringify(sidebarPageIcons, null, 2))
  return generatedSeoPages
}
