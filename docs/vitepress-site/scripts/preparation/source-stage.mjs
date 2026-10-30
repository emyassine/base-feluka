import { access, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { createHash } from 'node:crypto'


/** SOURCE DISCOVERY PHASE
 * Validate source configuration, discover guide files, stage unchanged inputs,
 * and collect route/sidebar/frontmatter records for later compilation phases.
 */
export async function prepareSources(siteDirectory) {
const configDirectory = resolve(siteDirectory, '../guides')
const config = JSON.parse(await readFile(join(configDirectory, 'vitepress.site.config.json'), 'utf8'))
const configuredStyles = config.styles ?? []
if (!Array.isArray(configuredStyles)) throw new Error('styles must be an array of CSS paths in vitepress.site.config.json')
const styleFiles = configuredStyles.map((stylePath) => {
  if (typeof stylePath !== 'string' || !stylePath.trim() || stylePath.startsWith('/') || stylePath.startsWith('\\')) {
    throw new Error('Each styles entry must be a relative CSS path inside guides')
  }
  const resolvedPath = resolve(configDirectory, stylePath)
  const localPath = relative(configDirectory, resolvedPath)
  if (localPath === '..' || localPath.startsWith(`..${sep}`) || extname(resolvedPath).toLowerCase() !== '.css') {
    throw new Error(`Invalid CSS path in styles: ${stylePath}`)
  }
  if (!existsSync(resolvedPath)) throw new Error(`Configured CSS file does not exist: ${stylePath}`)
  return resolvedPath
})
if (new Set(styleFiles).size !== styleFiles.length) throw new Error('styles contains duplicate CSS paths')
const configuredCollections = config.collections ?? []
if (!Array.isArray(configuredCollections)) throw new Error('collections must be an array in vitepress.site.config.json')
const collectionIds = new Set()
const collectionPaths = new Set()
const collections = configuredCollections.map((collection) => {
  if (!collection || typeof collection !== 'object' || Array.isArray(collection)) {
    throw new Error('Each collections entry must be an object with id and path')
  }
  const { id, path, title, description, layout, indexLayout = 'list', categoryFile = 'category.json' } = collection
  if (typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || collectionIds.has(id)) {
    throw new Error(`Collection id must be a unique lowercase slug: ${String(id)}`)
  }
  if (typeof path !== 'string' || !path.trim() || path.startsWith('/') || path.startsWith('\\')) {
    throw new Error(`Collection ${id} path must be a non-hidden relative path inside guides`)
  }
  const normalizedPath = path.split(/[\\/]/).filter(Boolean).join('/')
  const externalCollection = normalizedPath.startsWith('../collections/')
  const safePath = normalizedPath.replace(/^\.\.\//, '')
  if (!normalizedPath || !/^[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*$/.test(safePath)
    || normalizedPath.split('/').some((part, index) => part.startsWith('.') && !(externalCollection && index === 0 && part === '..'))) {
    throw new Error(`Collection ${id} path must be relative to guides or ../collections`)
  }
  if (collectionPaths.has(normalizedPath)) throw new Error(`Duplicate collection path: ${normalizedPath}`)
  if (typeof categoryFile !== 'string' || !/^[A-Za-z0-9_-]+\.json$/.test(categoryFile)) {
    throw new Error(`Collection ${id} categoryFile must be a root-level JSON filename`)
  }
  for (const existing of collectionPaths) {
    if (normalizedPath.startsWith(`${existing}/`) || existing.startsWith(`${normalizedPath}/`)) {
      throw new Error(`Collection paths may not overlap: ${existing} and ${normalizedPath}`)
    }
  }
  if (title !== undefined && typeof title !== 'string' && (typeof title !== 'object' || Array.isArray(title) || title === null)) {
    throw new Error(`Collection ${id} title must be a string or localized object`)
  }
  if (description !== undefined && typeof description !== 'string' && (typeof description !== 'object' || Array.isArray(description) || description === null)) {
    throw new Error(`Collection ${id} description must be a string or localized object`)
  }
  if (layout !== undefined && !['article', 'doc'].includes(layout)) {
    throw new Error(`Collection ${id} layout must be article or doc`)
  }
  if (!['list', 'spotlight'].includes(indexLayout)) {
    throw new Error(`Collection ${id} indexLayout must be list or spotlight`)
  }
  collectionIds.add(id)
  collectionPaths.add(normalizedPath)
  return { id, path: normalizedPath, title, description, layout, indexLayout, categoryFile, sourceDirectory: resolve(configDirectory, normalizedPath) }
})
function themeSlots(value, context) {
  if (value == null) return {}
  if (typeof value !== 'object' || Array.isArray(value)) throw new Error(`theme.slots must be an object in ${context}`)
  for (const [slot, component] of Object.entries(value)) {
    if (!/^[a-z][a-z0-9-]*$/.test(slot)) throw new Error(`Invalid VitePress theme slot "${slot}" in ${context}`)
    if (component !== null && (typeof component !== 'string' || !/^[A-Za-z][A-Za-z0-9]*$/.test(component))) {
      throw new Error(`theme.slots.${slot} must be a component name or null in ${context}`)
    }
  }
  return value
}
if (config.theme != null && (typeof config.theme !== 'object' || Array.isArray(config.theme))) {
  throw new Error('theme must be an object in vitepress.site.config.json')
}
const siteThemeSlots = themeSlots(config.theme?.slots, 'vitepress.site.config.json')
if (!Array.isArray(config.languages) || !config.languages.length || config.languages.some((language) => typeof language !== 'string' || !/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(language)) || new Set(config.languages).size !== config.languages.length) {
  throw new Error('languages must be a non-empty array of unique locale codes')
}
const defaultLanguage = config.fallbackLanguage ?? config.languages[0]
if (!config.languages.includes(defaultLanguage)) throw new Error('fallbackLanguage must be listed in languages')
const topbar = config.topbar ?? {}
if (!topbar || typeof topbar !== 'object' || Array.isArray(topbar)) throw new Error('topbar must be an object in vitepress.site.config.json')
if (topbar.theme !== undefined && !['switch', 'system', 'light', 'dark'].includes(topbar.theme)) {
  throw new Error('topbar.theme must be switch, system, light, or dark')
}
if (topbar.language != null && (typeof topbar.language !== 'object' || Array.isArray(topbar.language))) {
  throw new Error('topbar.language must be an object')
}
for (const key of ['showSelector', 'prefixDefaultLanguage', 'showFlags']) {
  if (topbar.language?.[key] !== undefined && typeof topbar.language[key] !== 'boolean') {
    throw new Error(`topbar.language.${key} must be a boolean`)
  }
}
const prefixDefaultLanguage = topbar.language?.prefixDefaultLanguage ?? false
const topbarGuidePaths = new Set((config.subguides ?? []).map((guide) => guide.path))
const topbarCollectionIds = new Set(collections.map((collection) => collection.id))
const topbarIconPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/
function validateTopbarItems(items, location = 'topbar.items') {
  if (!Array.isArray(items)) throw new Error(`${location} must be an array`)
  for (const [index, item] of items.entries()) {
    const itemLocation = `${location}[${index}]`
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error(`${itemLocation} must be an object`)
    if (item.icon !== undefined && (typeof item.icon !== 'string' || (item.icon !== 'INHERIT' && !topbarIconPattern.test(item.icon)))) {
      throw new Error(`${itemLocation}.icon must be an icon name or INHERIT`)
    }
    if ('guide' in item) {
      if (Object.keys(item).some((key) => !['guide', 'icon'].includes(key)) || !topbarGuidePaths.has(item.guide)) throw new Error(`${itemLocation}.guide must reference a configured subguide path`)
      continue
    }
    if ('collection' in item) {
      if (Object.keys(item).some((key) => !['collection', 'icon'].includes(key)) || !topbarCollectionIds.has(item.collection)) throw new Error(`${itemLocation}.collection must reference a configured collection id`)
      continue
    }
    if (item.text !== undefined && typeof item.text !== 'string' && (!item.text || typeof item.text !== 'object' || Array.isArray(item.text))) {
      throw new Error(`${itemLocation}.text must be text or an object of translated text`)
    }
    if (item.items !== undefined) {
      if (item.link !== undefined) throw new Error(`${itemLocation} cannot have both link and items; a dropdown title is a button`)
      validateTopbarItems(item.items, `${itemLocation}.items`)
    } else if (typeof item.link !== 'string' || !item.link.trim()) {
      throw new Error(`${itemLocation} must reference a guide or collection, define a link, or contain dropdown items`)
    }
  }
}
if (topbar.items !== undefined) validateTopbarItems(topbar.items)
for (const language of config.languages) {
  if (typeof config.languageLabels?.[language] !== 'string' || !config.languageLabels[language].trim()) {
    throw new Error(`languageLabels.${language} must be a non-empty string`)
  }
  if (typeof config.fallbackNotices?.[language] !== 'string' || !config.fallbackNotices[language].includes('{requested}')) {
    throw new Error(`fallbackNotices.${language} must include {requested}`)
  }
}
for (const language of config.languages) {
  if (config.languageMenuLabels?.[language] !== undefined && (typeof config.languageMenuLabels[language] !== 'string' || !config.languageMenuLabels[language].trim())) {
    throw new Error(`languageMenuLabels.${language} must be a non-empty string`)
  }
}
if (config.socialLinks !== undefined && (!Array.isArray(config.socialLinks) || config.socialLinks.some((item) => !item || typeof item.link !== 'string' || !item.link.trim() || !(typeof item.icon === 'string' || typeof item.icon?.svg === 'string')))) {
  throw new Error('socialLinks entries must define an icon and link')
}
if (config.seo?.siteUrl != null && config.seo.siteUrl !== '' && (typeof config.seo.siteUrl !== 'string' || !/^https:\/\/[^\s/]+(?:\/[^\s]*)?$/.test(config.seo.siteUrl))) {
  throw new Error('seo.siteUrl must be an absolute HTTPS URL when configured')
}
if (config.seo?.path != null && (typeof config.seo.path !== 'string' || !/^[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*$/.test(config.seo.path))) {
  throw new Error('seo.path must be a relative URL path without leading or trailing slashes')
}
if (config.seo?.locales != null) {
  if (typeof config.seo.locales !== 'object' || Array.isArray(config.seo.locales)) throw new Error('seo.locales must be an object keyed by language')
  for (const [language, locale] of Object.entries(config.seo.locales)) {
    if (!locale || typeof locale !== 'object' || Array.isArray(locale)) throw new Error(`seo.locales.${language} must be an object`)
    for (const key of ['quickLinks', 'faq']) {
      if (locale[key] != null && !Array.isArray(locale[key])) throw new Error(`seo.locales.${language}.${key} must be an array`)
    }
    for (const link of locale.quickLinks ?? []) {
      if (typeof link.label !== 'string' || typeof link.description !== 'string' || typeof link.url !== 'string' || !link.url.startsWith('/') || link.url.startsWith('//')) {
        throw new Error(`seo.locales.${language}.quickLinks entries need label, description, and a root-relative url`)
      }
    }
    for (const item of locale.faq ?? []) {
      if (typeof item.question !== 'string' || typeof item.answer !== 'string') throw new Error(`seo.locales.${language}.faq entries need question and answer text`)
    }
  }
}
const projectConfig = config.project ?? {}
if (typeof projectConfig !== 'object' || Array.isArray(projectConfig)) {
  throw new Error('project must be an object when configured')
}
const projectDirectories = {}
for (const key of ['components', 'hooks', 'iconLibrary']) {
  const value = projectConfig[key]
  if (value == null) {
    projectDirectories[key] = null
    continue
  }
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`project.${key} must be a non-empty directory path relative to the guides directory`)
  }
  const target = resolve(configDirectory, value)
  const local = relative(configDirectory, target)
  if (key !== 'iconLibrary' && (!local || local.startsWith(`..${sep}`) || local === '..' || local.split(sep).includes('..'))) {
    throw new Error(`project.${key} must stay inside the guides directory`)
  }
  let metadata
  try {
    metadata = await stat(target)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  if (!metadata?.isDirectory()) {
    throw new Error(`project.${key} must point to an existing directory: ${value}`)
  }
  projectDirectories[key] = target
}
const mermaidConfigPath = resolve(configDirectory, projectConfig.mermaidConfig ?? '.config/vitepress/mermaid.json')
const mermaidRelativePath = relative(configDirectory, mermaidConfigPath)
if (!mermaidRelativePath || mermaidRelativePath === '..' || mermaidRelativePath.startsWith(`..${sep}`)) {
  throw new Error('project.mermaidConfig must resolve to a file inside the guides directory')
}
if (!existsSync(mermaidConfigPath) || !(await stat(mermaidConfigPath)).isFile()) {
  throw new Error(`Configured Mermaid JSON file does not exist: ${mermaidConfigPath}`)
}
const iconFamilies = ['lucide', 'custom', 'heroicons', 'simple-icons']
const iconNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/
const reportedFallbacks = new Set()
function findIcon(name) {
  if (!projectDirectories.iconLibrary || !iconNamePattern.test(name)) return null
  const candidates = name.includes('/')
    ? [resolve(projectDirectories.iconLibrary, `${name}.svg`)]
    : iconFamilies.map((family) => resolve(projectDirectories.iconLibrary, family, `${name}.svg`))
  for (const candidate of candidates) {
    const relativePath = relative(projectDirectories.iconLibrary, candidate)
    if (!relativePath.startsWith(`..${sep}`) && relativePath !== '..' && existsSync(candidate)) return candidate
  }
  return null
}
const iconFallbackName = projectConfig.iconFallback ?? 'circle-help'
const iconFallbackPath = findIcon(iconFallbackName)
if (!iconFallbackPath) throw new Error(`project.iconFallback "${iconFallbackName}" was not found in project.iconLibrary`)
function resolveIcon(name, context) {
  const icon = findIcon(name)
  if (icon) return icon
  if (!reportedFallbacks.has(name)) {
    process.stderr.write(`[icons] ${context}: "${name}" not found; using "${iconFallbackName}".\n`)
    reportedFallbacks.add(name)
  }
  return iconFallbackPath
}
function resolveSidebarIcon(directory, iconPath, context) {
  const candidate = resolve(directory, iconPath)
  const relativePath = relative(sourceRoot, candidate)
  if (relativePath !== '..' && !relativePath.startsWith(`..${sep}`) && existsSync(candidate)) return candidate
  if (!reportedFallbacks.has(iconPath)) {
    process.stderr.write(`[icons] ${context}: "${iconPath}" not found; using "${iconFallbackName}".\n`)
    reportedFallbacks.add(iconPath)
  }
  return iconFallbackPath
}
if (projectConfig.viteConfig != null && (typeof projectConfig.viteConfig !== 'string' || !/\.(?:[cm]?[jt]s)$/.test(projectConfig.viteConfig) || projectConfig.viteConfig.startsWith('/') || projectConfig.viteConfig.split('/').includes('..'))) {
  throw new Error('project.viteConfig must be a relative .js, .mjs, .cjs, .ts, .mts, or .cts path')
}

const outputDirectory = join(siteDirectory, '.generated-guides')
const generatedDirectory = join(siteDirectory, '.vitepress/generated')
const mermaidCache = join(siteDirectory, '.vitepress/mermaid-cache')
const mermaidConfig = await readFile(mermaidConfigPath, 'utf8')
const darkMessageTextColor = config.mermaid?.darkMessageTextColor ?? '#f1f3fc'
if (typeof darkMessageTextColor !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(darkMessageTextColor)) {
  throw new Error('mermaid.darkMessageTextColor must be a six-digit hex color')
}
const flowchartPalette = config.mermaid?.flowchartPalette
if (!Array.isArray(flowchartPalette) || !flowchartPalette.length || flowchartPalette.some((entry) =>
  !entry || typeof entry !== 'object' || ['fill', 'text', 'stroke'].some((key) =>
    typeof entry[key] !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(entry[key])))) {
  throw new Error('mermaid.flowchartPalette must be a non-empty array of fill/text/stroke hex colors')
}
const nodeBorderWidth = config.mermaid?.nodeBorderWidth ?? '1.5px'
if (typeof nodeBorderWidth !== 'string' || !/^\d+(?:\.\d+)?px$/.test(nodeBorderWidth)) {
  throw new Error('mermaid.nodeBorderWidth must be a pixel width such as 1.5px')
}
const incremental = process.env.DOCS_PREPARE_INCREMENTAL === '1'
const records = []
const routeMap = new Map()
const generatedFiles = new Set()
const navigationOrder = {}
const sidebarConfigurations = new Map()
const sidebarIconSources = new Set()
const sidebarPageIcons = {}
const directories = []
const guideUris = new Map()
let diagramsCached = 0
let diagramsRendered = 0
const cleanDir = (s) => s.replace(/^\d+[.-]/, '')
const cleanFile = (s) => s.replace(/^\d+[-.]/, '').replace(/\.[a-z]{2,3}\.md$/i, '.md')
const sourceLanguage = (path) => path.match(/\.([a-z]{2,3}(?:-[A-Z]{2})?)\.md$/i)?.[1]?.toLowerCase() ?? defaultLanguage.toLowerCase()
const sourceRoot = resolve(configDirectory, config.guidesPath)
const collectionMetadata = new Map()

function localizedValue(value, language, fallback = '') {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback
  return value[language] ?? value[defaultLanguage] ?? Object.values(value).find((item) => typeof item === 'string') ?? fallback
}

for (const collection of collections) {
  const relativeToSource = relative(sourceRoot, collection.sourceDirectory)
  const isInsideGuides = relativeToSource !== '..' && !relativeToSource.startsWith(`..${sep}`)
  const isDocsCollection = relativeToSource.startsWith(`..${sep}collections${sep}`)
  if ((!isInsideGuides && !isDocsCollection) || !existsSync(collection.sourceDirectory) || !(await stat(collection.sourceDirectory)).isDirectory()) {
    throw new Error(`Collection ${collection.id} path must point to an existing directory: ${collection.path}`)
  }
  const metadataPath = join(collection.sourceDirectory, collection.categoryFile)
  let metadata = {}
  try {
    metadata = JSON.parse(await readFile(metadataPath, 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw new Error(`Invalid collection metadata ${metadataPath}: ${error.message}`)
  }
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error(`Collection metadata must be a JSON object: ${metadataPath}`)
  }
  const categoryEntries = metadata.categories ?? []
  if (!Array.isArray(categoryEntries) || categoryEntries.some((category) => !category || typeof category !== 'object' || Array.isArray(category) || typeof category.id !== 'string')) {
    throw new Error(`Collection ${collection.id} metadata categories must be objects with string ids: ${metadataPath}`)
  }
  const categoryIds = new Set()
  for (const category of categoryEntries) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category.id) || categoryIds.has(category.id)) {
      throw new Error(`Collection ${collection.id} has an invalid or duplicate category id in ${metadataPath}`)
    }
    categoryIds.add(category.id)
  }
  collectionMetadata.set(collection.id, { ...collection, metadata, categoryEntries })
}

/** SOURCE VALIDATION — enforce frontmatter icon and configured library contracts. */
async function validateMarkdownIcons(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name)
    if (entry.isDirectory()) {
      await validateMarkdownIcons(file)
      continue
    }
    if (!entry.isFile() || extname(entry.name).toLowerCase() !== '.md') continue
    const source = await readFile(file, 'utf8')
    const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/)
    const icon = frontmatter?.[1].match(/^icon:\s*["']?([a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?)["']?\s*$/m)?.[1]
    if (!icon) throw new Error(`Every Markdown file must define a valid icon in frontmatter: ${file}`)
    if (!projectDirectories.iconLibrary) throw new Error(`project.iconLibrary is required to validate Markdown icons: ${file}`)
    resolveIcon(icon, file)
  }
}

/** ROUTE MAPPING — map source guide paths to normalized published routes. */
function stagedPath(sourcePath, language = null) {
  const sourceRelative = relative(sourceRoot, sourcePath).split(sep).join('/')
  const isMarkdown = sourcePath.toLowerCase().endsWith('.md')
  const locale = (language ?? (isMarkdown ? sourceLanguage(sourcePath) : defaultLanguage)).toLowerCase()
  const localePrefix = locale === defaultLanguage.toLowerCase() && !prefixDefaultLanguage ? [] : [locale]
  const guide = config.subguides.find(({ path }) => sourceRelative === path || sourceRelative.startsWith(`${path}/`))
  const collection = collections.find(({ path }) => sourceRelative === path || sourceRelative.startsWith(`${path}/`))
  if (collection) {
    const local = sourceRelative === collection.path ? '' : sourceRelative.slice(collection.path.length + 1)
    const parts = local ? local.split('/').map((part, index, all) => index === all.length - 1 && part.endsWith('.md') ? cleanFile(part) : cleanDir(part)) : []
    return join(outputDirectory, ...localePrefix, collection.id, ...parts)
  }
  if (!guide) {
    const parts = sourceRelative.split('/')
    return join(outputDirectory, ...localePrefix, ...parts.map((part, index) => index === parts.length - 1 && part.endsWith('.md') ? cleanFile(part) : cleanDir(part)))
  }
  const uri = guideUris.get(guide.path)
  const local = sourceRelative === guide.path ? '' : sourceRelative.slice(guide.path.length + 1)
  const parts = local ? local.split('/').map((part, index, all) => index === all.length - 1 && part.endsWith('.md') ? cleanFile(part) : cleanDir(part)) : []
  if (parts.length === 1 && parts[0] === 'index.md' && uri.index) parts.splice(0, 1, ...uri.index.replace(/\/$/, '').split('/'), 'index.md')
  const base = uri.base.replace(/^\/+|\/+$/g, '')
  return join(outputDirectory, ...localePrefix, ...[base, ...parts].filter(Boolean).flatMap((part) => part.split('/')))
}

async function copyIfChanged(source, target) {
  const content = await readFile(source)
  let current
  try { current = await readFile(target) }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  if (current?.equals(content)) return false
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
  return true
}

async function writeIfChanged(target, content) {
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content)
  let current
  try { current = await readFile(target) }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  if (current?.equals(buffer)) return false
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, buffer)
  return true
}

/** INPUT DISCOVERY — copy assets and collect Markdown, sidebar, and route records. */
/** ASSET STAGING — content-address assets and publish them to generated public roots. */
async function copyAsset(sourceFile) {
  const sourceRelativePath = relative(sourceRoot, sourceFile)
  const iconRelativePath = projectDirectories.iconLibrary ? relative(projectDirectories.iconLibrary, sourceFile) : '..'
  const inGuides = sourceRelativePath !== '..' && !sourceRelativePath.startsWith(`..${sep}`)
  const inIconLibrary = iconRelativePath !== '..' && !iconRelativePath.startsWith(`..${sep}`)
  if (!inGuides && !inIconLibrary) {
    throw new Error(`Asset path is outside the guides and configured icon library: ${sourceFile}`)
  }
  const bytes = await readFile(sourceFile)
  const assetName = `${createHash('sha256').update(bytes).digest('hex')}${extname(sourceFile).toLowerCase()}`
  const publishedPath = join('__docs-assets', assetName)
  for (const target of [join(outputDirectory, publishedPath), join(outputDirectory, 'public', publishedPath)]) {
    generatedFiles.add(target)
    await writeIfChanged(target, bytes)
  }
  return publishedPath.split(sep).join('/')
}

function publicPagePath(outputPath) {
  const page = relative(outputDirectory, outputPath).split(sep).join('/')
  return page
}

function publicUrl(outputPath) {
  const target = publicPagePath(outputPath)
  if (target.endsWith('/index.md')) return `/${target.slice(0, -'index.md'.length)}`
  if (target === 'index.md') return '/'
  return `/${target.replace(/\.md$/, '')}`
}

function publicMarkdownLink(outputPath) {
  const target = publicPagePath(outputPath)
  if (target === 'index.md') return '/'
  if (target.endsWith('/index.md')) return `/${target.slice(0, -'index.md'.length)}`
  return `/${target.replace(/\.md$/, '')}`
}

async function scan(sourceRoot, outputRoot, sourcePath = sourceRoot, outputPath = outputRoot) {
  const entries = (await readdir(sourcePath, { withFileTypes: true }))
    .filter((entry) => !entry.name.startsWith('.') && entry.name !== 'README.md' && entry.name !== 'vitepress.config.json' && entry.name !== 'sidebar.json'
      && !collections.some((collection) => collection.sourceDirectory === sourcePath && entry.name === collection.categoryFile))
  const navigationEntries = entries.filter((entry) => entry.isDirectory() || /\.md$/i.test(entry.name))
  const indexOnly = navigationEntries.length === 1 && !navigationEntries[0].isDirectory() && /^index(?:\.[a-z]{2,3})?\.md$/i.test(navigationEntries[0].name)
  let sidebarConfig
  try {
    sidebarConfig = JSON.parse(await readFile(join(sourcePath, 'sidebar.json'), 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  if (sidebarConfig) {
    const outputRelativePath = relative(outputRoot, stagedPath(sourcePath)).split(sep).join('/')
    const sourceRelativePath = relative(sourceRoot, sourcePath).split(sep).join('/')
    const matchingGuide = config.subguides.find((guide) => sourceRelativePath.startsWith(`${guide.path}/`))
    if (!sidebarConfig.labels || typeof sidebarConfig.labels !== 'object' || Array.isArray(sidebarConfig.labels)) {
      throw new Error(`sidebar.json must define a labels object by language: ${join(sourcePath, 'sidebar.json')}`)
    }
    for (const language of config.languages) {
      if (typeof sidebarConfig.labels[language] !== 'string' || !sidebarConfig.labels[language].trim()) {
        throw new Error(`sidebar.json needs a non-empty labels.${language}: ${join(sourcePath, 'sidebar.json')}`)
      }
    }
    if (typeof sidebarConfig.icon !== 'string' || !sidebarConfig.icon.trim()) {
      throw new Error(`sidebar.json must define an icon path relative to that file: ${join(sourcePath, 'sidebar.json')}`)
    }
    const iconPath = resolveSidebarIcon(sourcePath, sidebarConfig.icon, join(sourcePath, 'sidebar.json'))
    sidebarConfigurations.set(outputRelativePath, {
      labels: sidebarConfig.labels,
      icon: iconPath,
    })
    sidebarIconSources.add(iconPath)
  }
  if (sourcePath !== sourceRoot) directories.push({ sourcePath, outputPath, entries })
  for (const entry of entries) {
    const from = join(sourcePath, entry.name)
    const to = stagedPath(from)
    await mkdir(dirname(to), { recursive: true })
    const orderPath = relative(outputRoot, to).split(sep).join('/')
    navigationOrder[orderPath] = entry.name
    if (entry.isDirectory()) {
      for (const language of config.languages) {
        if (language.toLowerCase() === defaultLanguage.toLowerCase() && !prefixDefaultLanguage) continue
        navigationOrder[`${language}/${orderPath}`] = entry.name
      }
    }
    if (entry.isDirectory()) await scan(sourceRoot, outputRoot, from, to)
    else {
      if (sidebarIconSources.has(resolve(from))) continue
      await mkdir(dirname(to), { recursive: true })
      routeMap.set(resolve(from), to)
      if (extname(entry.name).toLowerCase() === '.md') {
        const markdown = await readFile(from, 'utf8')
        const frontmatter = markdown.match(/^---\s*\n([\s\S]*?)\n---/)
        const icon = frontmatter?.[1].match(/^icon:\s*["']?([a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?)["']?\s*$/m)?.[1]
        if (!icon) throw new Error(`Every published Markdown page must define a valid icon: ${from}`)
        if (!projectDirectories.iconLibrary) throw new Error(`project.iconLibrary is required to validate page icons: ${from}`)
        const iconPath = resolveIcon(icon, from)
        const iconAsset = await copyAsset(iconPath)
        sidebarPageIcons[publicMarkdownLink(to)] = iconAsset
        records.push({ from, to, sourceRoot, icon, iconAsset })
      }
      else {
        generatedFiles.add(to)
        await copyIfChanged(from, to)
      }
    }
  }
}

await validateMarkdownIcons(sourceRoot)

for (const guide of config.subguides) {
  if (!guide.uri || typeof guide.uri !== 'object' || Array.isArray(guide.uri) || typeof guide.uri.base !== 'string' || !/^\/(?:[A-Za-z0-9._~-]+\/)*$/.test(guide.uri.base)) {
    throw new Error(`Each subguides entry must define uri.base as an absolute path ending in /: ${guide.path}`)
  }
  guideUris.set(guide.path, guide.uri)
}
if (!incremental) await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })
await scan(sourceRoot, outputDirectory)
for (const collection of collections) await scan(sourceRoot, outputDirectory, collection.sourceDirectory, join(outputDirectory, collection.id))
if (prefixDefaultLanguage) {
  const localizedIndex = join(outputDirectory, defaultLanguage.toLowerCase(), 'index.md')
  const rootIndex = join(outputDirectory, 'index.md')
  try { await access(localizedIndex) }
  catch { throw new Error(`Default-language index was not generated at ${localizedIndex}`) }
  await copyIfChanged(localizedIndex, rootIndex)
  generatedFiles.add(rootIndex)
}
for (const directory of directories) {
  const sourceRelative = relative(sourceRoot, directory.sourcePath).split(sep).join('/')
  const guide = config.subguides.find(({ path }) => sourceRelative === path || sourceRelative.startsWith(`${path}/`))
  if (!guide || sourceRelative === guide.path) continue
  const hasPublishedMarkdown = records.some(({ from }) => from.startsWith(`${directory.sourcePath}${sep}`))
  const navigationEntries = directory.entries.filter((entry) => entry.isDirectory() || /\.md$/i.test(entry.name))
  const indexOnly = navigationEntries.length === 1 && !navigationEntries[0].isDirectory() && /^index(?:\.[a-z]{2,3})?\.md$/i.test(navigationEntries[0].name)
  const outputRelative = relative(outputDirectory, stagedPath(directory.sourcePath)).split(sep).join('/')
  if (hasPublishedMarkdown && !indexOnly && !sidebarConfigurations.has(outputRelative)) {
    throw new Error(`Every documentation subdirectory needs sidebar.json with localized labels: ${join(directory.sourcePath, 'sidebar.json')}`)
  }
}
await writeIfChanged(join(generatedDirectory, 'navigation-order.json'), JSON.stringify(navigationOrder, null, 2))
await mkdir(join(outputDirectory, 'public'), { recursive: true })
if (topbar.language?.showFlags) {
  for (const language of config.languages) {
    const source = join(siteDirectory, 'flags', 'language', `${language.toLowerCase()}.svg`)
    if (!existsSync(source)) throw new Error(`Missing language flag for ${language}: ${source}`)
    const target = join(outputDirectory, 'public', 'flags', 'language', `${language.toLowerCase()}.svg`)
    await mkdir(dirname(target), { recursive: true })
    generatedFiles.add(target)
    await writeIfChanged(target, await readFile(source))
  }
}
if (config.publicFiles !== undefined && (!config.publicFiles || typeof config.publicFiles !== 'object' || Array.isArray(config.publicFiles))) {
  throw new Error('publicFiles must be an object of root-level filenames and text contents')
}
for (const [name, content] of Object.entries(config.publicFiles ?? {})) {
  if (!/^[A-Za-z0-9._-]+\.txt$/.test(name) || typeof content !== 'string') {
    throw new Error(`publicFiles.${name} must be a .txt filename with string content`)
  }
  const target = join(outputDirectory, 'public', name)
  generatedFiles.add(target)
  await writeIfChanged(target, content.endsWith('\n') ? content : `${content}\n`)
}


  return {
    configDirectory, config, styleFiles, copyAsset, publicPagePath, publicUrl, publicMarkdownLink, collections, siteThemeSlots, themeSlots, iconNamePattern, flowchartPalette, nodeBorderWidth, defaultLanguage, prefixDefaultLanguage, projectConfig, projectDirectories, findIcon, resolveIcon, resolveSidebarIcon, outputDirectory, generatedDirectory, mermaidCache, mermaidConfigPath, mermaidConfig, darkMessageTextColor, incremental, records, routeMap, generatedFiles, navigationOrder, sidebarConfigurations, sidebarIconSources, sidebarPageIcons, directories, guideUris, cleanDir, cleanFile, sourceLanguage, sourceRoot, collectionMetadata, localizedValue, stagedPath, copyIfChanged, writeIfChanged, scan, diagramsCached, diagramsRendered
  }
}
