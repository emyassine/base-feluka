/** Renderer configuration assembled from the SPMPST model. */
export type LocalizedText = string | Record<string, string>

export interface SiteConfig {
  site: { name: string; description?: string }
  fonts?: Partial<Record<'body' | 'heading' | 'code', FontConfig>>
  styles?: string[]
  guidesPath: string
  indexPath: string
  outputDir: string
  collections?: CollectionConfig[]
  project?: {
    components?: string
    hooks?: string
    iconLibrary?: string
    iconFallback?: string
    viteConfig?: string
    mermaidConfig?: string
  }
  mermaid: {
    flowchartPalette: Array<{ fill: string; text: string; stroke: string }>
    nodeBorderWidth?: string
    darkMessageTextColor?: string
  }
  theme?: { slots?: Record<string, string | null> }
  topbar?: TopbarConfig
  subguides: SubguideConfig[]
  languages: string[]
  fallbackLanguage?: string
  languageLabels: Record<string, string>
  languageMenuLabels?: Record<string, string>
  fallbackNotices?: Record<string, string>
  socialLinks?: Array<{ icon: string | { svg: string }; link: string; ariaLabel?: string }>
  markdown?: Record<string, unknown>
  search: { provider: 'local'; miniSearch?: Record<string, unknown>; labels: Record<string, Record<string, string>>; excludePaths?: string[] }
  outline: { labels: Record<string, string>; level?: number | 'deep' }
  footer?: Record<string, unknown>
  logo?: LogoConfig
  publicFiles?: Record<string, string>
  ogImages?: string | string[]
  documentationNotices?: Record<string, unknown>
  seo?: SeoConfig
}

export interface TopbarConfig {
  items?: TopbarItem[]
  language?: { showSelector?: boolean; prefixDefaultLanguage?: boolean; showFlags?: boolean }
  theme?: 'switch' | 'system' | 'light' | 'dark'
}

export interface MenuTemplateOptions {
  mobileToo?: boolean
  maxItems?: number
  more?: {
    image?: string
    text?: LocalizedText
    link?: string
    position?: 'before' | 'after'
  }
}

export type MenuTemplate = [id: string, fields?: string[], options?: MenuTemplateOptions]

export type TopbarGroupEntry =
  | { type: 'link'; label: LocalizedText; href: string; icon?: string; target?: string; rel?: string; include?: string[]; exclude?: string[] }
  | { type: 'guide'; path: string; label?: LocalizedText; icon?: string; children?: Record<string, unknown>; include?: string[]; exclude?: string[] }
  | { type: 'collection'; id: string; icon?: string; children?: boolean; include?: string[]; exclude?: string[] }
  | { type: 'collections'; children: Record<string, unknown>; include?: string[]; exclude?: string[] }

export interface TopbarGroup {
  label: LocalizedText
  showLabel?: boolean
  entries?: TopbarGroupEntry[]
  groupBy?: { ids: string[] } | { filter: { menuTags: string[] } }
  include?: string[]
  exclude?: string[]
}

export type TopbarItem =
  | { type: 'menu'; label: LocalizedText; groups: TopbarGroup[]; sources?: TopbarGroupEntry[]; icon?: string; hideIcon?: boolean; menuTemplate?: MenuTemplate }
  | { type: 'guide'; path: string; label?: LocalizedText; icon?: string; children?: Record<string, unknown> }
  | { type: 'collection'; id: string; icon?: string; children?: boolean }
  | { type: 'link'; label: LocalizedText; href: string; icon?: string; target?: string; rel?: string }
  | { guide: string; icon?: string; menuTitle?: LocalizedText; menuTemplate?: MenuTemplate; include?: string[]; exclude?: string[] }
  | { collection: string; icon?: string }
  | {
      text?: LocalizedText
      link?: string
      icon?: string
      activeMatch?: string
      target?: string
      rel?: string
      items?: TopbarItem[]
      menuTemplate?: MenuTemplate
      include?: string[]
      exclude?: string[]
    }

export interface SubguideConfig {
  path: string
  label: string
  labels?: Record<string, string>
  uri: { base: string; entry?: string; index?: string }
}

export interface CollectionConfig {
  id: string
  path: string
  title?: LocalizedText
  description?: LocalizedText
  layout?: 'article' | 'doc'
  indexLayout?: 'list' | 'spotlight'
  categoryFile?: string
}

export interface FontConfig {
  family: string
  src?: string
  weight?: number | string
  style?: 'normal' | 'italic'
  fallback?: string
}

export interface LogoConfig {
  light?: string
  dark?: string
  alt?: string
  width?: string
  height?: string
  extraStyle?: string
}

export interface SeoConfig {
  siteUrl?: string | null
  path?: string
  locales?: Record<string, {
    pageTitle?: string
    faqTitle?: string
    quickLinksTitle?: string
    quickLinks?: Array<{ label: string; description: string; url: string }>
    faq?: Array<{ question: string; answer: string }>
  }>
}

/** Typed contract for each guide's spmpst.guide.json. */
export interface GuideConfig {
  title: string
  favicon: string
  showSiteTitle?: boolean
  theme?: { slots?: Record<string, string | null> }
  uri?: SubguideConfig['uri']
  fonts?: SiteConfig['fonts']
  logo?: LogoConfig
  colors?: Record<string, string>
  ogImages?: string | string[]
}

/** Values passed to project.hooks/documentation-seo.ts. */
export interface DocumentationSeoOptions {
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

/** Common Feluqa guide frontmatter read by preparation and theme adapters. */
export interface GuideFrontmatter {
  title?: string
  sidebarTitle: string
  description?: string
  icon: string
  date?: string
  lastmod?: string
  lastModified?: string
  tags?: string[]
  status?: 'exploring' | 'validated' | 'verified' | 'complete' | 'completed' | string
  requestedLanguage?: string
  languageFallbackNotice?: string
  search?: boolean
  category?: string
  collection?: string
  wordCount?: number
  readingTime?: number
  [key: string]: unknown
}
