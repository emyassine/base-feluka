export interface SeoOptions {
  page: string
  pageData: { title?: string; description?: string; frontmatter?: Record<string, unknown> }
  title: string
  description: string
  siteName: string
  siteUrl?: string | null
  images: string[]
  defaultLanguage: string
  languages: string[]
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

function cleanPageUrl(page: string): string {
  const normalized = `/${page.replace(/^\/+/, '').replace(/\.md$/, '')}`
  return normalized.endsWith('/index') ? `${normalized.slice(0, -'index'.length)}` : normalized
}

function absoluteUrl(path: string, base: string | null | undefined): string | null {
  if (!base) return null
  try {
    return new URL(path, base).href
  } catch {
    return null
  }
}

export function transformDocumentationHead(options: SeoOptions) {
  const frontmatter = options.pageData.frontmatter ?? {}
  const title = String(options.pageData.title ?? options.title)
  const description = String(options.pageData.description ?? frontmatter.description ?? options.description ?? '')
  const pageUrl = cleanPageUrl(options.page)
  const localeCodes = options.languages.map((language) => language.toLowerCase())
  const firstSegment = pageUrl.split('/').filter(Boolean)[0]?.toLowerCase()
  const routePath = firstSegment && localeCodes.includes(firstSegment) && firstSegment !== options.defaultLanguage.toLowerCase()
    ? `/${pageUrl.split('/').filter(Boolean).slice(1).join('/')}${pageUrl.endsWith('/') ? '/' : ''}`
    : pageUrl
  const canonicalPath = pageUrl
  const canonicalUrl = absoluteUrl(canonicalPath, options.siteUrl)
  const imageUrls = shuffle(options.images.filter((image) => typeof image === 'string' && image.length > 0))
  const locale = String(frontmatter.requestedLanguage ?? frontmatter.lang ?? options.defaultLanguage)
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : []
  const head: unknown[][] = [
    ['meta', { name: 'description', content: description }],
    ['meta', { property: 'og:type', content: 'article' }],
    ['meta', { property: 'og:site_name', content: options.siteName }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:locale', content: locale.replace('-', '_') }],
    ['meta', { name: 'twitter:card', content: imageUrls.length ? 'summary_large_image' : 'summary' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
  ]
  if (canonicalUrl) {
    head.push(['link', { rel: 'canonical', href: canonicalUrl }])
    head.push(['meta', { property: 'og:url', content: canonicalUrl }])
    for (const language of options.languages) {
      const localizedPath = language.toLowerCase() === options.defaultLanguage.toLowerCase()
        ? routePath
        : `/${language.toLowerCase()}${routePath === '/' ? '/' : routePath}`
      const localizedUrl = absoluteUrl(localizedPath, options.siteUrl)
      if (localizedUrl) head.push(['link', { rel: 'alternate', hreflang: language, href: localizedUrl }])
    }
    const defaultUrl = absoluteUrl(routePath, options.siteUrl)
    if (defaultUrl) head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: defaultUrl }])
  }
  if (frontmatter.date) head.push(['meta', { property: 'article:published_time', content: String(frontmatter.date) }])
  if (frontmatter.lastmod) head.push(['meta', { property: 'article:modified_time', content: String(frontmatter.lastmod) }])
  for (const tag of tags) head.push(['meta', { property: 'article:tag', content: tag }])
  for (const image of imageUrls) head.push(['meta', { property: 'og:image', content: absoluteUrl(image, canonicalUrl) ?? image }])
  if (imageUrls[0]) head.push(['meta', { name: 'twitter:image', content: absoluteUrl(imageUrls[0], canonicalUrl) ?? imageUrls[0] }])
  head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
    '@context': 'https://schema.org',
    '@type': frontmatter.date || frontmatter.lastmod ? 'TechArticle' : 'WebPage',
    name: title,
    description,
    inLanguage: locale,
    ...(canonicalUrl ? { url: canonicalUrl, mainEntityOfPage: canonicalUrl } : {}),
    ...(frontmatter.date ? { datePublished: String(frontmatter.date) } : {}),
    ...(frontmatter.lastmod ? { dateModified: String(frontmatter.lastmod) } : {}),
    ...(tags.length ? { keywords: tags.join(', ') } : {}),
    ...(imageUrls.length ? { image: imageUrls.map((image) => absoluteUrl(image, canonicalUrl) ?? image) } : {}),
    publisher: { '@type': 'Organization', name: options.siteName },
  })])
  return head
}
