import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { sortNavigationEntries } from '../navigation-order.mjs'

const siteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const configDirectory = resolve(siteDirectory, '../guides')
const siteConfig = JSON.parse(readFileSync(join(configDirectory, 'vitepress.site.config.json'), 'utf8'))
const site = siteConfig
const generatedDirectory = join(siteDirectory, '.generated-guides')
const sidebarMetadataPath = join(siteDirectory, '.vitepress/generated-sidebar.json')
const sidebarMetadata = existsSync(sidebarMetadataPath) ? JSON.parse(readFileSync(sidebarMetadataPath, 'utf8')) : {}
const navigationOrderPath = join(siteDirectory, '.vitepress/generated-navigation-order.json')
const navigationOrder = existsSync(navigationOrderPath) ? JSON.parse(readFileSync(navigationOrderPath, 'utf8')) : {}
const generatedFontPath = join(siteDirectory, '.vitepress/generated-fonts.json')
const generatedFonts = existsSync(generatedFontPath) ? JSON.parse(readFileSync(generatedFontPath, 'utf8')) : { site: {}, guides: {} }
const generatedGuideColorsPath = join(siteDirectory, '.vitepress/generated-guide-colors.json')
const generatedGuideColors = existsSync(generatedGuideColorsPath) ? JSON.parse(readFileSync(generatedGuideColorsPath, 'utf8')) : {}
const activeLanguage = siteConfig.languages[0]
const sourceDirectory = resolve(configDirectory, site.guidesPath)
const outputDirectory = process.env.FELUQA_DOCS_OUT_DIR
  ? resolve(process.env.FELUQA_DOCS_OUT_DIR)
  : resolve(configDirectory, site.outputDir)
const guideConfigs = Object.fromEntries(site.subguides.map((guide: { path: string }) => {
  const configPath = resolve(sourceDirectory, guide.path, 'vitepress.config.json')
  return [guide.path, { path: configPath, config: JSON.parse(readFileSync(configPath, 'utf8')) }]
}))
const routeBase = (guidePath: string) => String(site.subguides.find((guide: { path: string }) => guide.path === guidePath).uri.base).replace(/^\/+|\/+$/g, '')
const subguideRootPaths = new Set(site.subguides.map((guide: { path: string }) => routeBase(guide.path).split('/').filter(Boolean)[0]).filter(Boolean))
function publicPagePath(file: string): string {
  const sourceRelative = relative(generatedDirectory, file).replace(/\\/g, '/')
  const target = sourceRelative
  if (target === 'index.md') return '/'
  if (target.endsWith('/index.md')) return `/${target.slice(0, -'index.md'.length)}`
  return `/${target.replace(/\.md$/, '')}`
}
function directoryLink(directory: string): string {
  return publicPagePath(join(directory, 'index.md'))
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

function groupTitle(path: string, fallback: string): string {
  const metadata = sidebarMetadata[path]
  const label = metadata?.labels?.[activeLanguage] ?? fallback
  const escapedLabel = escapeHtml(label)
  if (!metadata?.icon) return escapedLabel
  return `<span class="sidebar-group-label"><span class="sidebar-group-icon" style="--sidebar-group-icon-url: url('/${escapeHtml(metadata.icon)}')" aria-hidden="true"></span><span>${escapedLabel}</span></span>`
}

function ordered<T extends { name: string }>(directory: string, entries: T[]): T[] {
  const sourceNames: Record<string, string> = {}
  for (const entry of entries) {
    const key = relative(generatedDirectory, join(directory, entry.name)).replace(/\\/g, '/')
    sourceNames[entry.name] = navigationOrder[key] ?? entry.name
  }
  return sortNavigationEntries(entries, sourceNames)
}

function sidebar(directory: string, root = directory): any[] {
  return ordered(directory, readdirSync(directory, { withFileTypes: true })).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      if (directory === root && subguideRootPaths.has(entry.name)) return []
      const items = sidebar(path, root)
      const relativePath = relative(generatedDirectory, path).replace(/\\/g, '/')
      const fallback = entry.name.replace(/^\d+[.-]/, '').replace(/[-_]/g, ' ')
      return items.length ? [{ text: groupTitle(relativePath, fallback), link: directoryLink(path), collapsed: true, items }] : []
    }
    if (!entry.name.endsWith('.md')) return []
    if (entry.name === 'index.md') return []
    const clean = relative(generatedDirectory, path).replace(/\\/g, '/').replace(/\.md$/, '').replace(/\/index$/, '')
    return [{ text: escapeHtml(titleOf(path)), link: publicPagePath(path) }]
  })
}

const nav = site.subguides.map((guide: { path: string; label: string }) => {
  const uri = guide.uri
  const base = routeBase(guide.path)
  const link = uri.entry
    ? `/${[base, uri.entry].filter(Boolean).join('/')}/`
    : uri.index && !base
      ? `/${uri.index}`
      : `/${base}${base ? '/' : ''}`
  return { text: guide.label, link }
})
const sidebars = Object.fromEntries(site.subguides.map((guide: { path: string; label: string }) => {
  const base = routeBase(guide.path)
  const directory = join(generatedDirectory, ...base.split('/').filter(Boolean))
  return [`/${base}${base ? '/' : ''}`, sidebar(directory)]
}))

export default defineConfig({
  title: siteConfig.site.name,
  head: [['link', { rel: 'icon', type: assetMime(primaryConfig.favicon), href: assetDataUri(primaryGuideConfig.path, primaryConfig.favicon) }]],
  srcDir: '.generated-guides',
  outDir: outputDirectory,
  cleanUrls: true,
  mpa: false,
  vite: { configFile: join(siteDirectory, 'vite.config.ts') },
  markdown: siteConfig.markdown,
  transformHead({ page }) {
    const guide = site.subguides.find((entry: { path: string }) => page.startsWith(`${entry.path}/`) || page.startsWith(`${routeBase(entry.path)}/`))
    const guideEntry = guide ? guideConfigs[guide.path] : primaryGuideConfig
    const head: any[] = []
    head.push(['link', { rel: 'icon', type: assetMime(guideEntry.config.favicon), href: assetDataUri(guideEntry.path, guideEntry.config.favicon) }])
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
      inlineCodeBackground: '--vp-code-bg',
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
    if (colors.primary && !colors.tertiary) declarations.push('--vp-c-brand-3: var(--vp-c-brand-1);')
    if (colors.primary && !colors.soft) declarations.push('--vp-c-brand-soft: color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent);')
    if (logoSettings.logoWidth) declarations.push(`--feluqa-nav-logo-width: ${logoSettings.logoWidth};`)
    if (declarations.length) head.push(['style', {}, `:root { ${declarations.join(' ')} }`])
    if (logoSettings.logoExtraStyle) head.push(['style', {}, `.VPNavBarTitle.has-sidebar .logo { ${logoSettings.logoExtraStyle} }`])
    const fonts = { ...generatedFonts.site, ...(guide ? generatedFonts.guides[guide.path] : {}) }
    const fontFaces: string[] = []
    const fontDeclarations: string[] = []
    for (const role of ['body', 'code']) {
      const font = fonts[role]
      if (!font) continue
      const family = JSON.stringify(font.family)
      const fallback = font.fallback
      const property = role === 'body' ? '--vp-font-family-base' : '--vp-font-family-mono'
      fontDeclarations.push(`${property}: ${family}, ${fallback};`)
      if (font.src) {
        fontFaces.push(`@font-face { font-family: ${family}; src: url(${JSON.stringify(font.src)}) format('woff2'); font-style: ${font.style}; font-weight: ${font.weight}; font-display: swap; }`)
      }
    }
    if (fontDeclarations.length || fontFaces.length) {
      head.push(['style', {}, `${fontFaces.join(' ')} :root { ${fontDeclarations.join(' ')} }`])
    }
    return head
  },
  themeConfig: {
    nav,
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
      alt: generatedGuideColors.root?.logoAlt ?? siteConfig.logo?.alt ?? 'Feluqa',
    },
    siteTitle: primaryConfig.showSiteTitle ? primaryConfig.title : false,
  },
})
