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

export function transformDocumentationHead(_options: SeoOptions) {
  return [
    // Voluntary publisher signals. These are not an access-control mechanism and crawler support varies.
    ['meta', { name: 'robots', content: 'noai, noimageai' }],
    ['meta', { name: 'copyright', content: '© 2026 Numerimondes SARL AU' }],
  ]
}
