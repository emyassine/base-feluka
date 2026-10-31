import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path'
import { sortNavigationEntries } from '../../scripts/shared/navigation-order.mjs'
import type { GuideConfig, SiteConfig } from '../types/site-config'

export interface NavigationInputs {
  site: SiteConfig
  siteConfig: SiteConfig
  siteDirectory: string
  defaultLanguage: string
  generatedDirectory: string
  sidebarMetadata: Record<string, any>
  sidebarPageIcons: Record<string, string>
  navigationOrder: Record<string, string>
  generatedCollections: any[]
  guideConfigs: Record<string, { path: string; config: GuideConfig }>
}

export function createNavigation(inputs: NavigationInputs) {
  const { site, siteConfig, siteDirectory, defaultLanguage, generatedDirectory, sidebarMetadata,
    sidebarPageIcons, navigationOrder, generatedCollections, guideConfigs } = inputs
// ROUTE AND SIDEBAR MODEL — translate generated Markdown paths into VitePress routes.
const routeBase = (guidePath: string) => String(site.subguides.find((guide: { path: string }) => guide.path === guidePath).uri.base).replace(/^\/+|\/+$/g, '')
const defaultSeoLocale = site.languages[0].toLowerCase().split('-')[0]
const seoSidebarRoots = Object.keys(site.seo?.locales ?? {}).map((language: string) => {
  const seoPath = site.seo.path ?? 'faq'
  return (language.toLowerCase() === defaultSeoLocale ? seoPath : `${language}/${seoPath}`).split('/')[0]
})
const subguideRootPaths = new Set([...site.subguides.flatMap((guide: { path: string; uri: { index?: string } }) => [
  routeBase(guide.path).split('/').filter(Boolean)[0],
  guide.uri.index?.split('/').filter(Boolean)[0],
]).filter(Boolean), ...generatedCollections.map((collection: { route?: string; id: string }) => (collection.route ?? collection.id).split('/')[0]), ...seoSidebarRoots])
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
  if (Object.hasOwn(navigationOrder, indexKey)) return true
  const [first, ...rest] = indexKey.split('/')
  return rest.length > 0
    && site.languages.some((language: string) => language.toLowerCase() === first)
    && Object.hasOwn(navigationOrder, rest.join('/'))
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

function iconSource(icon: string, link?: string): string | undefined {
  if (icon === 'INHERIT') {
    const normalized = link?.startsWith('/') ? link : `/${link ?? ''}`
    const candidates = [normalized, normalized.replace(/\/$/, ''), `${normalized.replace(/\/$/, '')}/`]
    const inherited = candidates.map((candidate) => sidebarPageIcons[candidate]).find(Boolean)
    if (!inherited) throw new Error(`topbar icon INHERIT could not find page frontmatter icon for ${normalized}`)
    return `/${inherited.replace(/^\/+/, '')}`
  }
  if (!icon) return undefined
  if (isAbsolute(icon) && existsSync(icon)) {
    return `data:image/svg+xml;base64,${readFileSync(icon).toString('base64')}`
  }
  const library = resolve(siteDirectory, '..', site.project?.iconLibrary ?? '')
  const families = ['lucide', 'custom', 'heroicons', 'simple-icons']
  const candidates = icon.includes('/') ? [resolve(library, `${icon}.svg`)] : families.map((family) => resolve(library, family, `${icon}.svg`))
  const source = candidates.find((candidate) => candidate.startsWith(`${library}/`) && existsSync(candidate))
  if (!source) throw new Error(`topbar icon not found in project.iconLibrary: ${icon}`)
  return `data:image/svg+xml;base64,${readFileSync(source).toString('base64')}`
}
function itemText(label: string, icon?: string, link?: string, resolvedSource?: string): string {
  const source = resolvedSource ?? (icon ? iconSource(icon, link) : undefined)
  return source
    ? `<span class="docs-topbar-item"><span class="docs-topbar-icon" style="--docs-topbar-icon-url: url('${escapeHtml(source)}')" aria-hidden="true"></span><span>${escapeHtml(label)}</span></span>`
    : escapeHtml(label)
}
function navigation(language = defaultLanguage): any[] {
  const localePrefix = language.toLowerCase() === defaultLanguage.toLowerCase()
    ? (site.topbar?.language?.prefixDefaultLanguage ? `/${language}` : '')
    : `/${language}`
  const guideLink = (path: string, icon?: string) => {
    const guide = site.subguides.find((entry: { path: string }) => entry.path === path)
    if (!guide) throw new Error(`topbar references unknown subguide: ${path}`)
    const base = routeBase(path)
    const link = guide.uri.entry
      ? `${localePrefix}/${[base, guide.uri.entry].filter(Boolean).join('/')}/`
      : guide.uri.index && !base
        ? `${localePrefix}/${guide.uri.index}`
        : `${localePrefix}/${base}${base ? '/' : ''}`
    const otherRoots = [
      ...site.subguides.filter((other: { path: string }) => other.path !== path).map((other: { path: string }) => routeBase(other.path)),
      ...generatedCollections.map((collection: { route?: string; id: string }) => (collection.route ?? collection.id).split('/')[0]),
    ].filter(Boolean)
    const activeMatch = base
      ? `^${localePrefix}/${base}(?:/|$)`
      : `^${localePrefix}/(?!$)(?!(?:${otherRoots.join('|')})(?:/|$))`
    return { text: itemText(guide.labels?.[language] ?? guide.label, icon, link), link, activeMatch }
  }
  const guideSubguides = (path: string, depth: number | number[] | 'all' | undefined, showIcons: boolean) => {
    const guide = site.subguides.find((entry: { path: string }) => entry.path === path)
    const guideConfig = guideConfigs[path]
    if (!guide || !guideConfig) throw new Error(`cannot discover topbar children for unknown guide: ${path}`)
    const baseParts = routeBase(path).split('/').filter(Boolean)
    const selectedDepths = depth == null || depth === 'all'
      ? null
      : new Set(Array.isArray(depth) ? depth : [depth])
    const sortDirectories = (directory: string) => sortNavigationEntries(
      readdirSync(directory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
        .map((entry) => ({ name: entry.name })),
    )
    const visit = (directory: string, routeParts: string[], level: number): any[] =>
      sortDirectories(directory).flatMap(({ name }) => {
        const segment = name.replace(/^\d+[.-]/, '')
        if (!segment) return []
        const childDirectory = join(directory, name)
        const childRouteParts = [...routeParts, segment]
        const metadataKey = childRouteParts.join('/')
        const metadata = sidebarMetadata[metadataKey]
        const nestedItems = visit(childDirectory, childRouteParts, level + 1)
        if (!metadata || (selectedDepths && !selectedDepths.has(level))) return nestedItems
        const link = `${localePrefix}/${childRouteParts.join('/')}/`
        const label = metadata.labels?.[language] ?? metadata.labels?.[defaultLanguage]
        if (typeof label !== 'string' || !label.trim()) {
          throw new Error(`topbar child ${metadataKey} has no localized spmpst.sidebar.json label for ${language}`)
        }
        const icon = showIcons && typeof metadata.icon === 'string'
          ? `/${metadata.icon.replace(/^\/+/, '')}`
          : undefined
        return [{
          text: itemText(label, undefined, undefined, icon),
          link,
          activeMatch: `^${link.replace(/\/+$/, '')}(?:/|$)`,
          ...(nestedItems.length ? { items: nestedItems } : {}),
        }]
      })
    return visit(dirname(guideConfig.path), baseParts, 1)
  }
  const collectionLink = (id: string, icon?: string) => {
    const collection = generatedCollections.find((entry: { id: string }) => entry.id === id)
    if (!collection) throw new Error(`topbar references unknown collection: ${id}`)
    const link = collection.links[language] ?? collection.links[defaultLanguage]
    return {
      text: itemText(collection.titles[language] ?? collection.titles[defaultLanguage] ?? collection.id, icon, link),
      link,
      activeMatch: `^${link.replace(/\/+$/, '')}(?:/|$)`,
    }
  }
  const collectionSubmenus = (pathPrefix: string | undefined, depth: number | number[] | 'all' | undefined, showIcons: boolean, hideChildren: string[] = [], hideIconFromParents = false, hideIcon = false) => {
    const selectedDepths = depth == null || depth === 'all' ? null : new Set(Array.isArray(depth) ? depth : [depth])
    return [...generatedCollections]
      .filter((collection: any) => !pathPrefix || collection.path === pathPrefix || collection.path.startsWith(`${pathPrefix}/`))
      .filter((collection: any) => {
        const level = pathPrefix ? collection.path.split('/').length - pathPrefix.split('/').length : collection.path.split('/').length
        return !selectedDepths || selectedDepths.has(level)
      })
      .sort((left: any, right: any) => left.path.localeCompare(right.path))
      .map((collection: any) => {
        const link = collection.links[language] ?? collection.links[defaultLanguage]
        const route = collection.route ?? collection.id
        const metadata = sidebarMetadata[route]
        const icon = showIcons && !hideIconFromParents && !hideIcon ? metadata?.icon : undefined
        const articles = collection.articles?.[language] ?? collection.articles?.[defaultLanguage] ?? []
        const rootParts = route.split('/')
        const tree: any = { children: new Map(), articles: [], orderName: '' }
        for (const article of articles) {
          const urlParts = String(article.url ?? '').split('/').filter(Boolean)
          if (urlParts[0]?.toLowerCase() === language.toLowerCase() && language.toLowerCase() !== defaultLanguage.toLowerCase()) urlParts.shift()
          else if (urlParts[0]?.toLowerCase() === defaultLanguage.toLowerCase() && site.topbar?.language?.prefixDefaultLanguage) urlParts.shift()
          const routePartsInUrl = urlParts.slice(0, rootParts.length)
          if (routePartsInUrl.join('/') !== rootParts.join('/')) continue
          const relativeParts = urlParts.slice(rootParts.length)
          const sourceParts = String(article.sourcePath ?? '').split('/')
          let parent = tree
          relativeParts.forEach((segment: string, index: number) => {
            let child = parent.children.get(segment)
            if (!child) {
              child = { segment, sourceName: sourceParts[index] ?? segment, pathParts: [...(parent.pathParts ?? []), segment], children: new Map(), articles: [], orderName: sourceParts[index] ?? segment }
              parent.children.set(segment, child)
            }
            parent = child
          })
          parent.articles.push(article)
        }
        const renderTree = (node: any, parents: string[] = []): any[] => {
          const entries = [...node.children.values()].map((child: any) => ({ name: child.segment, child }))
          const sourceNames = Object.fromEntries(entries.map(({ name, child }: any) => [name, child.orderName]))
          return sortNavigationEntries(entries, sourceNames).flatMap(({ child }: any) => {
            const article = child.articles[0]
            const metadata = sidebarMetadata[`${route}/${child.pathParts.join('/')}`]
            const folderLabel = metadata?.labels?.[language] ?? child.segment.replace(/^\d+[.-]/, '').replace(/[-_]/g, ' ')
            const icon = showIcons && !hideIcon ? article && sidebarPageIcons[article.url] : undefined
            const pageLabel = article ? [...parents, article.title].join(' · ') : ''
            const pageItem = article ? [{
              text: itemText(pageLabel, undefined, undefined, icon ? `/${icon.replace(/^\/+/, '')}` : undefined),
              link: article.url,
              activeMatch: `^${article.url.replace(/\/+$/, '')}(?:/|$)`,
            }] : []
            return [...pageItem, ...renderTree(child, [...parents, folderLabel])]
          })
        }
        const childItems = hideChildren.includes(collection.id) ? [] : renderTree(tree)
        const items = childItems
        const label = metadata?.labels?.[language] ?? collection.titles[language] ?? collection.titles[defaultLanguage] ?? collection.id
        const linkItem = {
          text: itemText(label, undefined, link, icon ? `/${icon.replace(/^\/+/, '')}` : undefined),
          link,
          activeMatch: `^${link.replace(/\/+$/, '')}(?:/|$)`,
        }
        if (hideChildren.includes(collection.id) || !items.length) return linkItem
        return { text: label, items }
      })
  }
  const localize = (value: string | Record<string, string> | undefined) =>
    typeof value === 'string' ? value : value?.[language] ?? value?.[defaultLanguage]
  const resolveItem = (item: any): any => {
    if (item.guide) {
      const guide = guideLink(item.guide, item.hideIcon ? undefined : item.icon)
      if (item.items && !Array.isArray(item.items) && ['subguides', 'subguides no-guide-index'].includes(item.items.source)) {
        const guideConfig = guideConfigs[item.guide]
        const rootIcon = sidebarPageIcons[guide.link]
        const overview = {
          text: itemText(
            guideConfig.config.title ?? site.subguides.find((entry: { path: string }) => entry.path === item.guide)?.labels?.[language] ?? item.guide,
            undefined,
            undefined,
            typeof rootIcon === 'string' ? `/${rootIcon.replace(/^\/+/, '')}` : undefined,
          ),
          link: guide.link,
        }
        return {
          text: guide.text,
          activeMatch: guide.activeMatch,
          items: [
            ...(item.items.source === 'subguides' ? [overview] : []),
            ...guideSubguides(item.guide, item.items.depth, item.items.icon !== false),
          ],
        }
      }
      if (Array.isArray(item.items)) return { ...guide, items: item.items.map(resolveItem) }
      return guide
    }
    if (item.items && !Array.isArray(item.items) && item.items.source === 'collections') {
      const routePrefix = item.items.pathPrefix?.split('/').join('/')
      const activeRoot = routePrefix ?? ''
      return {
        text: itemText(localize(item.text) ?? '', item.hideIcon ? undefined : item.icon),
        activeMatch: item.activeMatch ?? (activeRoot ? `^${localePrefix}/${activeRoot}(?:/|$)` : undefined),
        items: collectionSubmenus(item.items.pathPrefix, item.items.depth, item.items.icon !== false, item.items.hideChildren ?? [], item.items.hideIconFromParents === true, item.items.hideIcon === true),
      }
    }
    if (item.collection) return collectionLink(item.collection, item.hideIcon ? undefined : item.icon)
    const text = localize(item.text)
    const link = localize(item.link)
    const external = typeof link === 'string' && /^(?:https?:)?\/\//i.test(link)
    const target = item.target ?? (external ? '_blank' : undefined)
    const rel = item.rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)
    return {
      ...(text ? { text: itemText(text, item.hideIcon ? undefined : item.icon, link) } : {}),
      ...(link ? { link } : {}),
      ...(item.activeMatch ? { activeMatch: item.activeMatch } : {}),
      ...(target ? { target } : {}),
      ...(rel ? { rel } : {}),
      ...(item.items ? { items: item.items.map(resolveItem) } : {}),
    }
  }
  const configuredItems = site.topbar?.items
    ?? [...site.subguides.map((guide: { path: string }) => ({ guide: guide.path })), ...generatedCollections.map((collection: { id: string }) => ({ collection: collection.id }))]
  return configuredItems.map(resolveItem)
}
function localizedSidebars(language = defaultLanguage): Record<string, any> {
  const prefix = language.toLowerCase() === defaultLanguage.toLowerCase()
    ? (site.topbar?.language?.prefixDefaultLanguage ? `${language}/` : '')
    : `${language}/`
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
// LOCALE CONFIG — VitePress locale entries share the generated route/sidebar model.
const localizedThemeConfig = Object.fromEntries(site.languages
  .filter((language: string) => language.toLowerCase() !== defaultLanguage.toLowerCase() || site.topbar?.language?.prefixDefaultLanguage)
  .map((language: string) => [language, {
    nav: navigation(language),
    sidebar: localizedSidebars(language),
    outline: { label: siteConfig.outline.labels[language] ?? siteConfig.outline.labels[defaultLanguage] },
    footer: siteConfig.footer?.[language] ?? siteConfig.footer?.[defaultLanguage],
    langMenuLabel: siteConfig.languageMenuLabels?.[language],
  }]))
// VitePress merges theme config from `locales[lang].themeConfig`, so translated
// navigation and sidebars belong on the locale entries, not in `themeConfig.locales`.
const showLanguageSelector = site.topbar?.language?.showSelector ?? true
const vitepressLocales = Object.fromEntries(site.languages.map((language: string) => {
  const isDefaultLanguage = language.toLowerCase() === defaultLanguage.toLowerCase()
  // Locale labels are rendered as text by VitePress. Keep markup out of this
  // field; the theme decorates the current locale and menu links with flags.
  const languageLabel = site.languageLabels[language]
  if (isDefaultLanguage && !site.topbar?.language?.prefixDefaultLanguage) {
    return ['root', { label: showLanguageSelector ? languageLabel : '', lang: language }]
  }
  return [language, {
    label: showLanguageSelector ? languageLabel : '',
    lang: language,
    link: `/${language}/`,
    themeConfig: localizedThemeConfig[language],
  }]
}))


  return {
    navigation, sidebars, localizedThemeConfig, vitepressLocales, routeBase, assetMime,
    assetDataUri, primaryGuide, primaryGuideConfig, primaryConfig, defaultSeoLocale,
  }
}
