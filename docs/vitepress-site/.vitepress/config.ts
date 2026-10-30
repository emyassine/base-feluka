import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { sortNavigationEntries } from '../navigation-order.mjs'
import { transformDocumentationHead } from './generated/hooks'

const siteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const configDirectory = resolve(siteDirectory, '../guides')
const siteConfig = JSON.parse(readFileSync(join(configDirectory, 'vitepress.site.config.json'), 'utf8'))
const site = siteConfig
const generatedDirectory = join(siteDirectory, '.generated-guides')
const generatedMetadata = join(siteDirectory, '.vitepress/generated')
const sidebarMetadataPath = join(generatedMetadata, 'sidebar.json')
const sidebarMetadata = existsSync(sidebarMetadataPath) ? JSON.parse(readFileSync(sidebarMetadataPath, 'utf8')) : {}
const sidebarPageIconsPath = join(generatedMetadata, 'sidebar-page-icons.json')
const sidebarPageIcons = existsSync(sidebarPageIconsPath) ? JSON.parse(readFileSync(sidebarPageIconsPath, 'utf8')) : {}
const navigationOrderPath = join(generatedMetadata, 'navigation-order.json')
const navigationOrder = existsSync(navigationOrderPath) ? JSON.parse(readFileSync(navigationOrderPath, 'utf8')) : {}
const generatedCollectionsPath = join(generatedMetadata, 'collections.json')
const generatedCollections = existsSync(generatedCollectionsPath) ? JSON.parse(readFileSync(generatedCollectionsPath, 'utf8')) : []
const generatedFontPath = join(generatedMetadata, 'fonts.json')
const generatedFonts = existsSync(generatedFontPath) ? JSON.parse(readFileSync(generatedFontPath, 'utf8')) : { site: {}, guides: {} }
const generatedGuideColorsPath = join(generatedMetadata, 'guide-colors.json')
const generatedGuideColors = existsSync(generatedGuideColorsPath) ? JSON.parse(readFileSync(generatedGuideColorsPath, 'utf8')) : {}
const generatedOgImages = existsSync(join(generatedMetadata, 'og-images.json'))
  ? JSON.parse(readFileSync(join(generatedMetadata, 'og-images.json'), 'utf8'))
  : {}
const defaultLanguage = siteConfig.fallbackLanguage ?? siteConfig.languages[0]
const sourceDirectory = resolve(configDirectory, site.guidesPath)
const outputDirectory = process.env.DOCS_OUTPUT_DIR
  ? resolve(process.env.DOCS_OUTPUT_DIR)
  : resolve(configDirectory, site.outputDir)
const guideConfigs = Object.fromEntries(site.subguides.map((guide: { path: string }) => {
  const configPath = resolve(sourceDirectory, guide.path, 'vitepress.config.json')
  return [guide.path, { path: configPath, config: JSON.parse(readFileSync(configPath, 'utf8')) }]
}))
const routeBase = (guidePath: string) => String(site.subguides.find((guide: { path: string }) => guide.path === guidePath).uri.base).replace(/^\/+|\/+$/g, '')
const defaultSeoLocale = site.languages[0].toLowerCase().split('-')[0]
const seoSidebarRoots = Object.keys(site.seo?.locales ?? {}).map((language: string) => {
  const seoPath = site.seo.path ?? 'faq'
  return (language.toLowerCase() === defaultSeoLocale ? seoPath : `${language}/${seoPath}`).split('/')[0]
})
const subguideRootPaths = new Set([...site.subguides.flatMap((guide: { path: string; uri: { index?: string } }) => [
  routeBase(guide.path).split('/').filter(Boolean)[0],
  guide.uri.index?.split('/').filter(Boolean)[0],
]).filter(Boolean), ...seoSidebarRoots])
function publicPagePath(file: string): string {
  const sourceRelative = relative(generatedDirectory, file).replace(/\\/g, '/')
  const target = sourceRelative
  if (target === 'index.md') return '/'
  if (target.endsWith('/index.md')) return `/${target.slice(0, -'index.md'.length)}`
  return `/${target.replace(/\.md$/, '')}`
}
function publicPageUrl(file: string): string {
  const target = relative(generatedDirectory, file).replace(/\\/g, '/')
  if (target === 'index.md') return '/'
  if (target.endsWith('/index.md')) return `/${target.slice(0, -'index.md'.length)}`
  return `/${target.replace(/\.md$/, '')}`
}
function directoryLink(directory: string): string {
  return publicPagePath(join(directory, 'index.md'))
}
function hasSourceIndex(directory: string): boolean {
  const indexKey = relative(generatedDirectory, join(directory, 'index.md')).replace(/\\/g, '/')
  return Object.hasOwn(navigationOrder, indexKey)
}
const assetMime = (assetPath: string) => ({
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
}[extname(assetPath).toLowerCase()] ?? 'application/octet-stream')
function assetDataUri(configPath: string, assetPath: string): string {
  if (/^(?:https?:|data:)/i.test(assetPath)) return assetPath
  const resolvedAsset = resolve(dirname(configPath), assetPath)
  const data = readFileSync(resolvedAsset).toString('base64')
  return `data:${assetMime(resolvedAsset)};base64,${data}`
}
const primaryGuide = site.subguides[0]
const primaryGuideConfig = guideConfigs[primaryGuide.path]
const primaryConfig = primaryGuideConfig.config

function titleOf(file: string): string {
  const source = readFileSync(file, 'utf8')
  const title = source.match(/^sidebarTitle:\s*["']?(.+?)["']?\s*$/m)?.[1]
  if (!title) throw new Error(`Every published Markdown page must define sidebarTitle: ${file}`)
  return title
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!)
}

function iconTitle(label: string, icon: string): string {
  return `<span class="sidebar-group-label"><span class="sidebar-group-icon" style="--sidebar-group-icon-url: url('/${escapeHtml(icon)}')" aria-hidden="true"></span><span>${label}</span></span>`
}

function groupTitle(path: string, fallback: string, language = defaultLanguage): string {
  const metadata = sidebarMetadata[path]
  const label = metadata?.labels?.[language] ?? metadata?.labels?.[defaultLanguage] ?? fallback
  const escapedLabel = escapeHtml(label)
  if (!metadata?.icon) return escapedLabel
  return iconTitle(escapedLabel, metadata.icon)
}

function pageTitle(file: string): string {
  const title = escapeHtml(titleOf(file))
  const icon = sidebarPageIcons[publicPageUrl(file)]
  if (typeof icon !== 'string' || !icon) throw new Error(`No compiled sidebar icon for ${file}`)
  return iconTitle(title, icon)
}

function ordered<T extends { name: string }>(directory: string, entries: T[]): T[] {
  const sourceNames: Record<string, string> = {}
  for (const entry of entries) {
    const key = relative(generatedDirectory, join(directory, entry.name)).replace(/\\/g, '/')
    sourceNames[entry.name] = navigationOrder[key] ?? entry.name
  }
  return sortNavigationEntries(entries, sourceNames)
}

function sidebar(directory: string, root = directory, language = defaultLanguage): any[] {
  return ordered(directory, readdirSync(directory, { withFileTypes: true })).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      if (directory === root && subguideRootPaths.has(entry.name)) return []
      const childEntries = readdirSync(path, { withFileTypes: true }).filter((child) => !child.name.startsWith('.'))
      const pageEntries = childEntries.filter((child) => child.isDirectory() || (
        child.name.endsWith('.md') && (child.name !== 'index.md' || hasSourceIndex(path))
      ))
      const onlyPage = pageEntries.length === 1 && !pageEntries[0].isDirectory() && pageEntries[0].name.endsWith('.md')
      if (onlyPage) {
        const pagePath = join(path, pageEntries[0].name)
        return [{ text: pageTitle(pagePath), link: publicPagePath(pagePath) }]
      }
      const items = sidebar(path, root, language)
      const relativePath = relative(generatedDirectory, path).replace(/\\/g, '/')
      const fallback = entry.name.replace(/^\d+[.-]/, '').replace(/[-_]/g, ' ')
      return items.length ? [{
        text: groupTitle(relativePath, fallback, language),
        ...(hasSourceIndex(path) ? { link: directoryLink(path) } : {}),
        collapsed: true,
        items,
      }] : []
    }
    if (!entry.name.endsWith('.md')) return []
    if (entry.name === 'index.md') return []
    if (existsSync(join(directory, entry.name.slice(0, -'.md'.length)))) return []
    const clean = relative(generatedDirectory, path).replace(/\\/g, '/').replace(/\.md$/, '').replace(/\/index$/, '')
    return [{ text: pageTitle(path), link: publicPagePath(path) }]
  })
}

function navigation(language = defaultLanguage): any[] {
 const collectionSources = new Set(generatedCollections.map((collection: { sourcePath: string }) => collection.sourcePath))
 const guideLinks = site.subguides.filter((guide: { path: string }) => !collectionSources.has(guide.path)).map((guide: { path: string; label: string; labels?: Record<string, string> }) => {
  const uri = guide.uri
  const base = routeBase(guide.path)
  const localePrefix = language.toLowerCase() === defaultLanguage.toLowerCase() ? '' : `/${language}`
  const link = uri.entry
    ? `${localePrefix}/${[base, uri.entry].filter(Boolean).join('/')}/`
    : uri.index && !base
      ? `${localePrefix}/${uri.index}`
      : `${localePrefix}/${base}${base ? '/' : ''}`
  const activeMatch = base
    ? `^${localePrefix}/${base}/`
    : `^${localePrefix}/(?!(?:${site.subguides.filter((other: { path: string; uri: { base: string } }) => other.path !== guide.path).map((other: { uri: { base: string } }) => routeBase(other.path)).filter(Boolean).join('|')})(?:/|$))`
  return { text: guide.labels?.[language] ?? guide.label, link, activeMatch }
 })
 const collectionLinks = generatedCollections.map((collection: { id: string; titles: Record<string, string>; links: Record<string, string> }) => ({
  text: collection.titles[language] ?? collection.titles[defaultLanguage] ?? collection.id,
  link: collection.links[language] ?? collection.links[defaultLanguage],
 }))
 return [...guideLinks, ...collectionLinks]
}
function localizedSidebars(language = defaultLanguage): Record<string, any> {
  const prefix = language.toLowerCase() === defaultLanguage.toLowerCase() ? '' : `${language}/`
  const guideSidebars = Object.fromEntries(site.subguides.flatMap((guide: { path: string; label: string; uri: { entry?: string; index?: string } }) => {
    const base = routeBase(guide.path)
    const route = base || guide.uri.entry || guide.uri.index?.replace(/\/$/, '') || ''
    const routeParts = route.split('/').filter(Boolean)
    const isRootGuide = !base && Boolean(guide.uri.entry)
    const directory = isRootGuide
      ? join(generatedDirectory, prefix)
      : join(generatedDirectory, prefix, ...routeParts)
    const items = sidebar(directory, directory, language)
    const guideIndex = base ? join(directory, 'index.md') : ''
    const sidebarItems = guideIndex && existsSync(guideIndex) && hasSourceIndex(directory)
      ? [{ text: escapeHtml(titleOf(guideIndex)), link: publicPagePath(guideIndex), collapsed: false, items }]
      : items
    const routes = isRootGuide
      ? [`/${prefix}`, `/${prefix}${route}/`]
      : [`/${prefix}${route}${route ? '/' : ''}`]
    return routes.map((path) => [path, sidebarItems])
  }))
  const collectionSidebars = Object.fromEntries(generatedCollections.map((collection: { links: Record<string, string> }) => [collection.links[language] ?? collection.links[defaultLanguage], []]))
  return { ...guideSidebars, ...collectionSidebars }
}
const sidebars = localizedSidebars()
const localizedThemeConfig = Object.fromEntries(site.languages
  .filter((language: string) => language.toLowerCase() !== defaultLanguage.toLowerCase())
  .map((language: string) => [language, {
    nav: navigation(language),
    sidebar: localizedSidebars(language),
    outline: { label: siteConfig.outline.labels[language] ?? siteConfig.outline.labels[defaultLanguage] ?? 'On this page' },
    footer: siteConfig.footer?.[language] ?? siteConfig.footer?.[defaultLanguage],
    langMenuLabel: siteConfig.languageMenuLabels?.[language] ?? 'Change language',
  }]))
const vitepressLocales = Object.fromEntries(site.languages.map((language: string) => [
  language.toLowerCase() === defaultLanguage.toLowerCase() ? 'root' : language,
  {
    label: site.languageLabels[language],
    lang: language,
    ...(language.toLowerCase() === defaultLanguage.toLowerCase() ? {} : { link: `/${language}/` }),
  },
]))

export default defineConfig({
  title: siteConfig.site.name,
  locales: vitepressLocales,
  head: [['link', { rel: 'icon', type: assetMime(primaryConfig.favicon), href: assetDataUri(primaryGuideConfig.path, primaryConfig.favicon) }]],
  srcDir: '.generated-guides',
  outDir: outputDirectory,
  cleanUrls: true,
  mpa: false,
  vite: { configFile: join(siteDirectory, 'vite.config.ts') },
  markdown: siteConfig.markdown,
  transformHead({ page, pageData, title, description }) {
    const pageParts = page.replace(/^\/+/, '').split('/')
    const normalizedPage = site.languages.some((language: string) => language.toLowerCase() !== defaultLanguage.toLowerCase() && language.toLowerCase() === pageParts[0].toLowerCase())
      ? pageParts.slice(1).join('/')
      : pageParts.join('/')
    const guide = site.subguides.find((entry: { path: string }) => {
      const base = routeBase(entry.path)
      return Boolean(base && (normalizedPage === base || normalizedPage.startsWith(`${base}/`)))
    })
    const guideEntry = guide ? guideConfigs[guide.path] : primaryGuideConfig
    const head: any[] = []
    head.push(['link', { rel: 'icon', type: assetMime(guideEntry.config.favicon), href: assetDataUri(guideEntry.path, guideEntry.config.favicon) }])
    const siteUrl = siteConfig.seo?.siteUrl ?? process.env.DOCS_PUBLIC_URL
    if (siteUrl && !/^https:\/\/[^\s/]+(?:\/[^\s]*)?$/.test(siteUrl)) {
      throw new Error('seo.siteUrl or DOCS_PUBLIC_URL must be an absolute HTTPS URL')
    }
    const guideRouteKey = guide ? routeBase(guide.path).split('/').filter(Boolean)[0] || 'root' : 'root'
    const seoHead = transformDocumentationHead({
      page,
      pageData,
      title,
      description,
      siteName: siteConfig.site.name,
      siteUrl,
      images: (generatedOgImages as Record<string, string[]>)[guideRouteKey] ?? (generatedOgImages as Record<string, string[]>).root ?? [],
      defaultLanguage,
      languages: siteConfig.languages,
    })
    head.push(...seoHead)
    const faqEntry = Object.entries(siteConfig.seo?.locales ?? {}).find(([language]) => {
      const seoPath = siteConfig.seo.path ?? 'faq'
      const languagePath = language.toLowerCase() === defaultSeoLocale ? seoPath : `${language}/${seoPath}`
      return page.replace(/^\/+/, '') === `${languagePath}/index.md`
    })
    if (faqEntry && siteUrl) {
      const [language, discovery] = faqEntry as [string, any]
      const localizedPath = language.toLowerCase() === defaultSeoLocale ? siteConfig.seo.path ?? 'faq' : `${language}/${siteConfig.seo.path ?? 'faq'}`
      const canonicalUrl = new URL(`/${localizedPath}/`, siteUrl).href
      const graph: any[] = [
        { '@type': 'WebSite', name: siteConfig.site.name, url: siteUrl },
        { '@type': 'WebPage', name: discovery.pageTitle ?? discovery.faqTitle ?? 'FAQ', url: canonicalUrl, inLanguage: language },
      ]
        if (discovery.quickLinks?.length) {
          graph.push({
            '@type': 'ItemList',
            name: discovery.quickLinksTitle,
            itemListElement: discovery.quickLinks.map((link: any, index: number) => ({
              '@type': 'ListItem', position: index + 1, name: link.label, url: new URL(link.url, siteUrl).href,
            })),
          })
        }
      if (discovery.faq?.length) {
          graph.push({
            '@type': 'FAQPage',
            mainEntity: discovery.faq.map((item: any) => ({
              '@type': 'Question', name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
          })
        }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })])
    }
    const colors = guideEntry.config.colors ?? primaryConfig.colors ?? {}
    const routeKey = guide ? routeBase(guide.path).split('/').filter(Boolean)[0] || 'root' : 'root'
    const logoSettings = generatedGuideColors[routeKey] ?? generatedGuideColors.root ?? {}
    const declarations: string[] = []
    const colorProperties: Record<string, string> = {
      primary: '--vp-c-brand-1',
      secondary: '--vp-c-brand-2',
      tertiary: '--vp-c-brand-3',
      soft: '--vp-c-brand-soft',
      sidebarIcon: '--vp-sidebar-icon-color',
      inlineCode: '--vp-code-color',
      heroNameColor: '--vp-home-hero-name-color',
      heroNameBackground: '--vp-home-hero-name-background',
    }
    for (const [key, property] of Object.entries(colorProperties)) {
      const value = colors[key]
      if (value === undefined) continue
      if (typeof value !== 'string' || !value.trim() || /[<>;{}]/.test(value)) {
        throw new Error(`Invalid colors.${key} in ${guide ? guide.path : primaryGuide.path}/vitepress.config.json`)
      }
      declarations.push(`${property}: ${value.trim()};`)
    }
    const codeBackgroundRules: string[] = []
    for (const [key, selector] of [['inlineCodeBackgroundDarkMode', ':root.dark'], ['inlineCodeBackgroundLightMode', ':root:not(.dark)']]) {
      const value = colors[key]
      if (value === undefined) continue
      if (typeof value !== 'string' || !value.trim() || /[<>;{}]/.test(value)) {
        throw new Error(`Invalid colors.${key} in ${guide ? guide.path : primaryGuide.path}/vitepress.config.json`)
      }
      codeBackgroundRules.push(`${selector} { --vp-code-bg: ${value.trim()}; }`)
    }
    if (colors.primary && !colors.tertiary) declarations.push('--vp-c-brand-3: var(--vp-c-brand-1);')
    if (colors.primary && !colors.soft) declarations.push('--vp-c-brand-soft: color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent);')
    if (logoSettings.logoWidth) declarations.push(`--docs-nav-logo-width: ${logoSettings.logoWidth};`)
    if (logoSettings.logoHeight) declarations.push(`--docs-nav-logo-height: ${logoSettings.logoHeight};`)
    if (declarations.length || codeBackgroundRules.length) head.push(['style', {}, `${declarations.length ? `:root { ${declarations.join(' ')} }` : ''} ${codeBackgroundRules.join(' ')}`])
    if (logoSettings.logoExtraStyle) head.push(['style', {}, `.VPNavBarTitle .logo { ${logoSettings.logoExtraStyle} }`])
    const fonts = { ...generatedFonts.site, ...(guide ? generatedFonts.guides[guide.path] : {}) }
    const fontFaces: string[] = []
    const fontDeclarations: string[] = []
    for (const role of ['body', 'heading', 'code']) {
      const font = fonts[role]
      if (!font) continue
      const family = JSON.stringify(font.family)
      const fallback = font.fallback
      const property = role === 'body' ? '--vp-font-family-base' : role === 'heading' ? '--vp-font-family-heading' : '--vp-font-family-mono'
      fontDeclarations.push(`${property}: ${family}, ${fallback};`)
      if (font.src) {
        fontFaces.push(`@font-face { font-family: ${family}; src: url(${JSON.stringify(font.src)}) format('${font.format}'); font-style: ${font.style}; font-weight: ${font.weight}; font-display: swap; }`)
      }
    }
    if (fontDeclarations.length || fontFaces.length) {
      head.push(['style', {}, `${fontFaces.join(' ')} :root { ${fontDeclarations.join(' ')} }`])
    }
    return head
  },
  themeConfig: {
    nav: navigation(),
    locales: localizedThemeConfig,
    langMenuLabel: siteConfig.languageMenuLabels?.[defaultLanguage] ?? 'Change language',
    socialLinks: site.socialLinks ?? [],
    sidebar: sidebars,
    search: { provider: siteConfig.search.provider, options: {
      miniSearch: { searchOptions: siteConfig.search.miniSearch },
      locales: Object.fromEntries(Object.entries(siteConfig.search.labels).map(([lang, labels]: [string, any]) => [lang, { translations: {
        button: { buttonText: labels.buttonText, buttonAriaLabel: labels.buttonAriaLabel },
        modal: { displayDetails: labels.displayDetails, resetButtonTitle: labels.resetButtonTitle, backButtonTitle: labels.backButtonTitle, noResultsText: labels.noResultsText,
          footer: { selectText: labels.selectText, selectKeyAriaLabel: labels.selectKeyAriaLabel, navigateText: labels.navigateText, navigateUpKeyAriaLabel: labels.navigateUpKeyAriaLabel, navigateDownKeyAriaLabel: labels.navigateDownKeyAriaLabel, closeText: labels.closeText, closeKeyAriaLabel: labels.closeKeyAriaLabel } }
      } }])),
      _render: (source: string, env: { relativePath: string; frontmatter?: { search?: boolean } }, markdown: { render: (source: string, env: unknown) => string }) => {
        const html = markdown.render(source, env)
        const excluded = (siteConfig.search.excludePaths ?? []).some((path: string) => env.relativePath.startsWith(path))
        return env.frontmatter?.search === false || excluded ? '' : html
      },
    } },
    outline: { label: siteConfig.outline.labels[siteConfig.languages[0]] ?? siteConfig.outline.labels.root, level: siteConfig.outline.level },
    aside: true,
    footer: siteConfig.footer?.[siteConfig.languages[0]] ?? siteConfig.footer?.root,
    logo: {
      light: generatedGuideColors.root?.logoLight,
      dark: generatedGuideColors.root?.logoDark,
      alt: generatedGuideColors.root?.logoAlt ?? siteConfig.logo?.alt ?? siteConfig.site?.name ?? 'Documentation',
    },
    siteTitle: primaryConfig.showSiteTitle ? primaryConfig.title : false,
  },
})
