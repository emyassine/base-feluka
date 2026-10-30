import { mkdir, readFile, readdir, rm } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { existsSync } from 'node:fs'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'


/** CONFIGURATION AND CONTENT COMPILATION PHASE
 * Copy referenced assets and compile fonts, guide themes, collections, Vue
 * component registration, hooks, and sidebar metadata.
 */
export async function prepareContent(ctx) {
  const {
    configDirectory,
    copyAsset,
    publicPagePath,
    publicUrl,
    publicMarkdownLink,
    config,
    styleFiles,
    collections,
    siteThemeSlots,
    themeSlots,
    defaultLanguage,
    projectConfig,
    projectDirectories,
    findIcon,
    resolveIcon,
    resolveSidebarIcon,
    outputDirectory,
    generatedDirectory,
    mermaidCache,
    mermaidConfigPath,
    mermaidConfig,
    darkMessageTextColor,
    incremental,
    records,
    routeMap,
    generatedFiles,
    navigationOrder,
    sidebarConfigurations,
    sidebarIconSources,
    sidebarPageIcons,
    directories,
    guideUris,
    cleanDir,
    cleanFile,
    sourceLanguage,
    sourceRoot,
    collectionMetadata,
    localizedValue,
    stagedPath,
    copyIfChanged,
    writeIfChanged,
    scan
  } = ctx

async function prepareOgImages(value, configPath) {
  if (value === undefined) return undefined
  const images = typeof value === 'string' ? [value] : value
  if (!Array.isArray(images) || images.some((image) => typeof image !== 'string' || !image.trim())) {
    throw new Error(`ogImages must be a path or an array of paths in ${configPath}`)
  }
  return Promise.all(images.map(async (image) => {
    if (/^https:\/\//i.test(image)) return image
    if (/^(?:[a-z]+:|\/|\\)/i.test(image)) throw new Error(`ogImages paths must be relative to ${configPath} or HTTPS URLs`)
    return `/${await copyAsset(resolve(dirname(configPath), image))}`
  }))
}

async function prepareFonts(fonts, configPath) {
  if (fonts == null) return {}
  if (typeof fonts !== 'object' || Array.isArray(fonts)) {
    throw new Error(`fonts must be an object in ${configPath}`)
  }
  const prepared = {}
  for (const role of ['body', 'heading', 'code']) {
    const font = fonts[role]
    if (font == null) continue
    if (typeof font !== 'object' || Array.isArray(font)) {
      throw new Error(`fonts.${role} must be an object in ${configPath}`)
    }
    const { family, src, weight = '400 700', style = 'normal', fallback } = font
    if (typeof family !== 'string' || !/^[\p{L}\p{N} _-]+$/u.test(family.trim())) {
      throw new Error(`fonts.${role}.family must be a plain font family name in ${configPath}`)
    }
    if (src != null && (typeof src !== 'string' || !['.woff2', '.ttf', '.otf'].includes(extname(src).toLowerCase()))) {
      throw new Error(`fonts.${role}.src must be a relative WOFF2, TTF, or OTF path in ${configPath}`)
    }
    if (!(typeof weight === 'number' && weight >= 1 && weight <= 1000) && !(typeof weight === 'string' && /^\d{1,4}(?:\s+\d{1,4})?$/.test(weight))) {
      throw new Error(`fonts.${role}.weight must be a number or range such as "400 700" in ${configPath}`)
    }
    if (style !== 'normal' && style !== 'italic') {
      throw new Error(`fonts.${role}.style must be normal or italic in ${configPath}`)
    }
    if (fallback != null && (typeof fallback !== 'string' || !/^[\p{L}\p{N} _,-]+$/u.test(fallback))) {
      throw new Error(`fonts.${role}.fallback contains invalid CSS in ${configPath}`)
    }
    const source = src ? resolve(dirname(configPath), src) : null
    prepared[role] = {
      family: family.trim(),
      src: source ? `/${await copyAsset(source)}` : null,
      format: source ? ({ '.woff2': 'woff2', '.ttf': 'truetype', '.otf': 'opentype' }[extname(source).toLowerCase()]) : null,
      weight: String(weight),
      style,
      fallback: fallback ?? (role === 'code' ? 'ui-monospace, monospace' : 'ui-sans-serif, system-ui, sans-serif'),
    }
  }
  for (const role of Object.keys(fonts)) {
    if (!['body', 'heading', 'code'].includes(role)) throw new Error(`Unknown font role fonts.${role} in ${configPath}; use body, heading, or code`)
  }
  return prepared
}

/** CONFIG COMPILATION — resolve per-site/per-guide fonts, logos, styles and theme hooks. */
const generatedFonts = {
  site: await prepareFonts(config.fonts, join(configDirectory, 'vitepress.site.config.json')),
  guides: {},
}
const generatedGuideColors = {}
const generatedOgImages = {}
const generatedGuideKeys = new Map()
const generatedGuideThemeSlots = new Map()
const siteLogo = config.logo ?? {}
const siteOgImages = await prepareOgImages(config.ogImages ?? [], join(configDirectory, 'vitepress.site.config.json'))
generatedOgImages.root = siteOgImages
for (const guide of config.subguides) {
  const guideConfigPath = resolve(sourceRoot, guide.path, 'vitepress.config.json')
  const guideConfig = JSON.parse(await readFile(guideConfigPath, 'utf8'))
  if (guideConfig.theme != null && (typeof guideConfig.theme !== 'object' || Array.isArray(guideConfig.theme))) {
    throw new Error(`theme must be an object in ${guideConfigPath}`)
  }
  generatedGuideThemeSlots.set(guide.path, themeSlots(guideConfig.theme?.slots, guideConfigPath))
  const uri = guide.uri
  if (uri.index != null && (typeof uri.index !== 'string' || !/^([A-Za-z0-9._~-]+\/)*$/.test(uri.index))) {
    throw new Error(`uri.index must be a relative directory path ending in / in ${guideConfigPath}`)
  }
  guideUris.set(guide.path, uri)
  const routeKey = uri.base.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)[0] || 'root'
  generatedGuideKeys.set(guide.path, routeKey)
  generatedFonts.guides[guide.path] = await prepareFonts(guideConfig.fonts, guideConfigPath)
  generatedFonts.guides[routeKey] = generatedFonts.guides[guide.path]
  generatedOgImages[routeKey] = await prepareOgImages(guideConfig.ogImages, guideConfigPath) ?? siteOgImages
  const faviconPath = guideConfig.favicon
    ? `/${await copyAsset(resolve(dirname(guideConfigPath), guideConfig.favicon))}`
    : null
  const logo = { ...siteLogo, ...(guideConfig.logo ?? {}) }
  if (typeof logo.light !== 'string' || typeof logo.dark !== 'string') {
    throw new Error(`logo.light and logo.dark must be set globally or in ${guideConfigPath}`)
  }
  if (logo.width != null && (typeof logo.width !== 'string' || !/^(?:auto|(?:\d+(?:\.\d+)?)(?:px|rem|em|vw|vh|%)|100%)$/.test(logo.width.trim()))) {
    throw new Error(`logo.width must be auto or a maximum CSS width such as 100%, 96px, or 6rem in ${guideConfigPath}`)
  }
  if (logo.height != null && (typeof logo.height !== 'string' || !/^(?:\d+(?:\.\d+)?)(?:px|rem|em|vw|vh|%)$/.test(logo.height.trim()))) {
    throw new Error(`logo.height must be a CSS height such as 32px or 2.5rem in ${guideConfigPath}`)
  }
  if (logo.extraStyle != null && (typeof logo.extraStyle !== 'string' || /[{}<>]|url\s*\(|expression\s*\(|@import/i.test(logo.extraStyle))) {
    throw new Error(`logo.extraStyle must contain plain CSS declarations without URLs or rule syntax in ${guideConfigPath}`)
  }
  const logoAsset = async (key) => {
    const guideOverride = guideConfig.logo?.[key]
    const value = guideOverride ?? siteLogo[key]
    const origin = guideOverride != null ? dirname(guideConfigPath) : configDirectory
    if (/^(?:https?:|data:)/i.test(value)) return value
    return `/${await copyAsset(resolve(origin, value))}`
  }
  generatedGuideColors[routeKey] = {
    ...(guideConfig.colors ?? {}),
    logoLight: await logoAsset('light'),
    logoDark: await logoAsset('dark'),
    logoAlt: logo.alt ?? site.name,
    ...(logo.width ? { logoWidth: logo.width.trim() } : {}),
    ...(logo.height ? { logoHeight: logo.height.trim() } : {}),
    ...(logo.extraStyle ? { logoExtraStyle: logo.extraStyle.trim() } : {}),
    ...(faviconPath ? { favicon: faviconPath } : {}),
  }
}
const nonRootGuideKeys = new Set([...generatedGuideKeys.values()].filter((key) => key !== 'root'))
const rootGuide = config.subguides.find((guide) => generatedGuideKeys.get(guide.path) === 'root')
if (rootGuide) {
  const rootColors = generatedGuideColors.root
  for (const entry of await readdir(outputDirectory, { withFileTypes: true })) {
    if (!entry.isDirectory() || ['public', '__docs-assets', ...nonRootGuideKeys].includes(entry.name)) continue
    generatedGuideColors[entry.name] = rootColors
    generatedFonts.guides[entry.name] = generatedFonts.guides[rootGuide.path]
  }
}

function frontmatterScalar(markdown, key) {
  const frontmatter = markdown.match(/^---\s*\n([\s\S]*?)\n---/m)?.[1]
  const match = frontmatter?.match(new RegExp(`^${key}:\\s*(.*?)\\s*$`, 'm'))
  if (!match) return ''
  const value = match[1]
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) return value.slice(1, -1)
  return value
}

function humanize(value) {
  return value.split('/').at(-1).replace(/\.[a-z]{2,3}\.md$/i, '').replace(/\.[^.]+$/, '').replace(/^\d+[.-]/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function readingMetrics(markdown) {
  const body = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
  const wordCount = body.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length ?? 0
  return { wordCount, readingTime: Math.max(1, Math.ceil(wordCount / 200)) }
}

/** COLLECTION COMPILATION — derive localized indexes and article metadata. */
const generatedCollectionNavigation = []
const generatedCollectionPages = new Set()
for (const collection of collectionMetadata.values()) {
  const localizedTitles = Object.fromEntries(config.languages.map((language) => [language, localizedValue(collection.title ?? collection.metadata.title, language, humanize(collection.id))]))
  const localizedDescriptions = Object.fromEntries(config.languages.map((language) => [language, localizedValue(collection.description ?? collection.metadata.description, language)]))
  const links = Object.fromEntries(config.languages.map((language) => {
    const localePrefix = language.toLowerCase() === defaultLanguage.toLowerCase() ? '' : `${language}/`
    return [language, `/${localePrefix}${collection.id}/`]
  }))
  const categoriesByLanguage = Object.fromEntries(config.languages.map((language) => [language, collection.categoryEntries.map((category) => ({
    id: category.id,
    label: localizedValue(category.label ?? category.title, language, category.id),
  }))]))
  const collectionRecord = { id: collection.id, path: collection.path, sourcePath: collection.path, layout: collection.layout ?? 'doc', indexLayout: collection.indexLayout, titles: localizedTitles, descriptions: localizedDescriptions, links, categories: categoriesByLanguage, articles: {} }
  generatedCollectionNavigation.push(collectionRecord)
  const title = localizedTitles[defaultLanguage]
  for (const language of config.languages) {
    const localizedArticles = new Map()
    for (const record of records.filter((candidate) => candidate.from.startsWith(`${collection.sourceDirectory}${sep}`)
      && candidate.from.toLowerCase().endsWith('.md')
      && !/^index(?:\.[a-z]{2,3}(?:-[A-Z]{2})?)?\.md$/i.test(candidate.from.slice(collection.sourceDirectory.length + 1)))) {
      const recordLanguage = sourceLanguage(record.from)
      if (recordLanguage !== defaultLanguage.toLowerCase() && recordLanguage !== language.toLowerCase()) continue
      const relativeSource = relative(collection.sourceDirectory, record.from).split(sep).join('/')
      const canonical = relativeSource.replace(/\.[a-z]{2,3}(?:-[A-Z]{2})?\.md$/i, '.md')
      const current = localizedArticles.get(canonical)
      if (!current || recordLanguage === language.toLowerCase()) localizedArticles.set(canonical, record)
    }
    const articles = [...localizedArticles.values()]
      .map((record) => {
        const markdown = readFileSync(record.from, 'utf8')
        const articleTitle = frontmatterScalar(markdown, 'sidebarTitle') || frontmatterScalar(markdown, 'title') || humanize(record.from)
        const description = frontmatterScalar(markdown, 'description')
        const date = frontmatterScalar(markdown, 'date')
        const category = frontmatterScalar(markdown, 'category') || (collection.categoryEntries.length === 1 ? collection.categoryEntries[0].id : '')
        const recordLanguage = sourceLanguage(record.from)
        const target = recordLanguage === language.toLowerCase() ? record.to : stagedPath(record.from, language)
        const { wordCount, readingTime } = readingMetrics(markdown)
        return { title: articleTitle, description, date, category, wordCount, readingTime, url: publicMarkdownLink(target) }
      })
      .sort((left, right) => right.date.localeCompare(left.date) || left.title.localeCompare(right.title))
    collectionRecord.articles[language] = articles
    const localePrefix = language.toLowerCase() === defaultLanguage.toLowerCase() ? [] : [language]
    const targetDirectory = join(outputDirectory, ...localePrefix, collection.id)
    const target = join(targetDirectory, 'index.md')
    if (records.some((record) => resolve(record.to) === resolve(target))) {
      throw new Error(`Collection route /${collection.id}/ conflicts with a published Markdown page`)
    }
    const localizedTitle = localizedValue(collection.title ?? collection.metadata.title, language, humanize(collection.id))
    const localizedDescription = localizedValue(collection.description ?? collection.metadata.description, language)
    const categories = new Map(collection.categoryEntries.map((category) => [category.id, localizedValue(category.label ?? category.title, language, category.id)]))
    const lines = [`---`, `title: ${JSON.stringify(localizedTitle)}`, `sidebarTitle: ${JSON.stringify(localizedTitle)}`, `description: ${JSON.stringify(localizedDescription || title)}`, `layout: doc`, `collectionIndex: ${JSON.stringify(collection.id)}`, `sidebar: false`, `aside: false`, `---`, '', `# ${localizedTitle}`, '']
    if (localizedDescription) lines.push(localizedDescription, '')
    if (collection.indexLayout === 'spotlight') {
      lines.push(`<CollectionSpotlightCards collection-id="${collection.id}" />`, '')
    } else {
      const grouped = new Map()
      for (const article of articles) {
        const key = article.category || ''
        if (!grouped.has(key)) grouped.set(key, [])
        grouped.get(key).push(article)
      }
      for (const [category, items] of grouped) {
        if (category) lines.push(`## ${categories.get(category) ?? category}`, '')
        for (const article of items) {
          const suffix = [article.date, article.description].filter(Boolean).join(' — ')
          lines.push(`- [${article.title}](${article.url})${suffix ? ` — ${suffix}` : ''}`)
        }
        if (items.length) lines.push('')
      }
    }
    if (!articles.length) lines.push(language.toLowerCase().startsWith('fr') ? 'Aucun contenu publié pour le moment.' : 'No published content yet.', '')
    await mkdir(targetDirectory, { recursive: true })
    generatedFiles.add(target)
    generatedCollectionPages.add(target)
    await writeIfChanged(target, lines.join('\n'))
  }
}

await writeIfChanged(join(generatedDirectory, 'collections.json'), JSON.stringify(generatedCollectionNavigation, null, 2))

const generatedMarkdown = new Set([...records.map(({ to }) => to), ...generatedCollectionPages])
await rm(join(generatedDirectory, 'rewrites.json'), { force: true })
await writeIfChanged(join(generatedDirectory, 'fonts.json'), JSON.stringify(generatedFonts, null, 2))
await writeIfChanged(join(generatedDirectory, 'guide-colors.json'), JSON.stringify(generatedGuideColors, null, 2))
await writeIfChanged(join(generatedDirectory, 'og-images.json'), JSON.stringify(generatedOgImages, null, 2))
const moduleSpecifier = (target, keepExtension = false) => {
  let value = relative(generatedDirectory, target).split(sep).join('/')
  if (!value.startsWith('.')) value = `./${value}`
  return keepExtension ? value : value.replace(/\.(?:[cm]?[jt]s)$/, '')
}

const configuredStylesSource = [
  '// Generated by scripts/preparation/pipeline.mjs from styles in vitepress.site.config.json. Do not edit.',
  ...styleFiles.map((styleFile) => `import '${moduleSpecifier(styleFile, true)}'`),
].join('\n')
await writeIfChanged(join(generatedDirectory, 'configured-styles.ts'), `${configuredStylesSource}\n`)

async function collectVueFiles(directory, files = []) {
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await collectVueFiles(path, files)
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.vue')) files.push(path)
  }
  return files
}

function componentName(path) {
  const name = path.split(sep).at(-1).replace(/\.vue$/i, '')
  const pascal = name.split(/[^A-Za-z0-9]+/).filter(Boolean).map((part) => `${part[0].toUpperCase()}${part.slice(1)}`).join('')
  if (!pascal) throw new Error(`Cannot derive a component name from ${path}`)
  return pascal
}

const componentFiles = projectDirectories.components ? await collectVueFiles(projectDirectories.components) : []
const componentNames = new Map()
const componentImports = []
const componentRegistrations = []
componentFiles.forEach((file, index) => {
  const name = componentName(file)
  const existing = componentNames.get(name)
  if (existing) throw new Error(`Duplicate component name ${name}: ${existing} and ${file}`)
  componentNames.set(name, file)
  componentImports.push(`import ProjectComponent${index} from '${moduleSpecifier(file, true)}'`)
  componentRegistrations.push(`  ${JSON.stringify(name)}: ProjectComponent${index},`)
})
const componentsSource = componentFiles.length
  ? `// Generated by scripts/preparation/pipeline.mjs from project.components. Do not edit.\nimport type { App } from 'vue'\n${componentImports.join('\n')}\n\nexport const projectComponents = {\n${componentRegistrations.join('\n')}\n} as const\n\nexport function registerProjectComponents(app: App): void {\n  for (const [name, component] of Object.entries(projectComponents)) {\n    app.component(name, component)\n  }\n}\n`
  : `// Generated by scripts/preparation/pipeline.mjs. No project.components directory is configured.\nimport type { App } from 'vue'\n\nexport const projectComponents = {} as const\n\nexport function registerProjectComponents(_app: App): void {}\n`
await writeIfChanged(join(generatedDirectory, 'components.ts'), componentsSource)

function validateThemeSlotComponents(slots, context) {
  for (const [slot, component] of Object.entries(slots)) {
    if (component !== null && !componentNames.has(component)) {
      throw new Error(`theme.slots.${slot} references unknown project component "${component}" in ${context}`)
    }
  }
}
validateThemeSlotComponents(siteThemeSlots, 'vitepress.site.config.json')
for (const [guidePath, slots] of generatedGuideThemeSlots) {
  validateThemeSlotComponents(slots, join(sourceRoot, guidePath, 'vitepress.config.json'))
}

const generatedGuideThemeSlotsByRoute = {}
for (const record of records) {
  const sourceRelative = relative(sourceRoot, record.from).split(sep).join('/')
  const guide = config.subguides.find(({ path }) => sourceRelative === path || sourceRelative.startsWith(`${path}/`))
  if (!guide) continue
  const slots = generatedGuideThemeSlots.get(guide.path)
  if (!slots || !Object.keys(slots).length) continue
  const routeParts = publicMarkdownLink(record.to).split('/').filter(Boolean)
  const isLocalized = routeParts.length > 1 && config.languages.includes(routeParts[0]) && routeParts[0] !== defaultLanguage
  const key = isLocalized ? `${routeParts[0]}/${routeParts[1]}` : routeParts[0] ?? 'root'
  generatedGuideThemeSlotsByRoute[key] = slots
}

await writeIfChanged(join(generatedDirectory, 'site-content.json'), JSON.stringify({
  guidePaths: [...Object.keys(generatedGuideColors)],
  languages: config.languages,
  defaultLanguage,
  themeSlots: { site: siteThemeSlots, guides: generatedGuideThemeSlotsByRoute },
  footer: config.footer ?? {},
  seo: config.seo ?? {},
  documentationNotices: config.documentationNotices ?? {},
}, null, 2))

/** THEME EXTENSIONS — emit stable adapters for project components and hooks. */
const hookExtensions = ['.ts', '.mts', '.js', '.mjs', '.cjs', '.cts']
function findHookFile(name) {
  if (!projectDirectories.hooks) return null
  for (const extension of hookExtensions) {
    const candidate = join(projectDirectories.hooks, `${name}${extension}`)
    if (existsSync(candidate)) return candidate
  }
  return null
}
const hookFile = findHookFile('documentation-hooks')
const seoFile = findHookFile('documentation-seo')
const hookStyles = projectDirectories.hooks ? join(projectDirectories.hooks, 'documentation-hooks.css') : null
const themeSource = [
  '// Generated by scripts/preparation/pipeline.mjs from project.hooks. Do not edit.',
  hookStyles && existsSync(hookStyles) ? `import '${moduleSpecifier(hookStyles)}'` : '',
  hookFile
    ? `export { DocumentationNotice, DocumentationLastModified } from '${moduleSpecifier(hookFile)}'`
    : `import { defineComponent } from 'vue'\n\nexport const DocumentationNotice = defineComponent({\n  name: 'DocumentationNotice',\n  setup: () => () => null,\n})\n\nexport const DocumentationLastModified = defineComponent({\n  name: 'DocumentationLastModified',\n  setup: () => () => null,\n})`,
].filter(Boolean).join('\n\n')
await writeIfChanged(join(generatedDirectory, 'theme.ts'), `${themeSource}\n`)

const hooksSource = [
  '// Generated by scripts/preparation/pipeline.mjs from project.hooks. Do not edit.',
  seoFile
    ? `export { transformDocumentationHead } from '${moduleSpecifier(seoFile)}'\nexport type { SeoOptions } from '${moduleSpecifier(seoFile)}'`
    : `export type SeoOptions = Record<string, unknown>\n\nexport function transformDocumentationHead(_options: SeoOptions): unknown[] {\n  return []\n}`,
].filter(Boolean).join('\n\n')
await writeIfChanged(join(generatedDirectory, 'hooks.ts'), `${hooksSource}\n`)

const generatedSidebar = {}
for (const [path, metadata] of sidebarConfigurations) {
  generatedSidebar[path] = {
    labels: metadata.labels,
    icon: metadata.icon ? await copyAsset(metadata.icon) : null,
  }
}
await writeIfChanged(join(generatedDirectory, 'sidebar.json'), JSON.stringify(generatedSidebar, null, 2))

  return { copyAsset, publicPagePath, publicUrl, publicMarkdownLink, frontmatterScalar, humanize, readingMetrics, generatedFonts, generatedGuideColors, generatedOgImages, generatedCollectionNavigation, generatedCollectionPages, generatedMarkdown, generatedGuideThemeSlotsByRoute }
}
