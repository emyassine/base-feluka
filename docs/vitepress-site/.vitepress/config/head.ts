import type { GuideConfig, SiteConfig, DocumentationSeoOptions } from '../types/site-config'

type HeadTransformInput = {
  page: string
  pageData: { title?: string; description?: string; frontmatter?: Record<string, unknown> }
  title: string
  description: string
}
type HeadDependencies = {
  site: SiteConfig
  siteConfig: SiteConfig
  guideConfigs: Record<string, { path: string; config: GuideConfig }>
  defaultLanguage: string
  defaultSeoLocale: string
  primaryGuide: SiteConfig['subguides'][number]
  primaryGuideConfig: { path: string; config: GuideConfig }
  primaryConfig: GuideConfig
  generatedOgImages: Record<string, string[]>
  generatedGuideColors: Record<string, Record<string, string>>
  generatedFonts: { site: Record<string, any>; guides: Record<string, Record<string, any>> }
  routeBase: (path: string) => string
  assetMime: (path: string) => string
  assetDataUri: (configPath: string, assetPath: string) => string
  transformDocumentationHead: (options: DocumentationSeoOptions) => unknown[][]
}

/** Creates the SEO and theme head hook with its inputs supplied by the composition root. */
export function createTransformHead(dependencies: HeadDependencies) {
  const { site, siteConfig, guideConfigs, defaultLanguage, defaultSeoLocale,
    primaryGuide, primaryGuideConfig, primaryConfig, generatedOgImages,
    generatedGuideColors, generatedFonts, routeBase, assetMime, assetDataUri,
    transformDocumentationHead } = dependencies
  return function transformHead({ page, pageData, title, description }: HeadTransformInput): unknown[][] {
    // HEAD ADAPTER — per-guide favicon, SEO, structured data, colors, and font faces.
    const pageParts = page.replace(/^\/+/, '').split('/')
    const normalizedPage = site.languages.some((language: string) =>
      (language.toLowerCase() !== defaultLanguage.toLowerCase() || siteConfig.topbar?.language?.prefixDefaultLanguage)
      && language.toLowerCase() === pageParts[0].toLowerCase())
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
  }
}
