import { access, cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile as execFileCallback } from 'node:child_process'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { promisify } from 'node:util'
import { sortNavigationEntries } from './navigation-order.mjs'

const siteDirectory = dirname(fileURLToPath(import.meta.url))
if (process.env.DOCS_PREPARE_LOCK_HELD !== '1') {
  const result = spawnSync('flock', ['--exclusive', join(siteDirectory, '.build.lock'), process.execPath, fileURLToPath(import.meta.url)], {
    cwd: siteDirectory,
    env: { ...process.env, DOCS_PREPARE_LOCK_HELD: '1' },
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  process.exit(result.status ?? 1)
}
const configDirectory = resolve(siteDirectory, '../guides')
const config = JSON.parse(await readFile(join(configDirectory, 'vitepress.site.config.json'), 'utf8'))
if (!Array.isArray(config.languages) || !config.languages.length || config.languages.some((language) => typeof language !== 'string' || !/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(language)) || new Set(config.languages).size !== config.languages.length) {
  throw new Error('languages must be a non-empty array of unique locale codes')
}
const defaultLanguage = config.fallbackLanguage ?? config.languages[0]
if (!config.languages.includes(defaultLanguage)) throw new Error('fallbackLanguage must be listed in languages')
for (const language of config.languages) {
  if (typeof config.languageLabels?.[language] !== 'string' || !config.languageLabels[language].trim()) {
    throw new Error(`languageLabels.${language} must be a non-empty string`)
  }
  if (typeof config.fallbackNotices?.[language] !== 'string' || !config.fallbackNotices[language].includes('{requested}') || !config.fallbackNotices[language].includes('{fallback}')) {
    throw new Error(`fallbackNotices.${language} must include {requested} and {fallback}`)
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
for (const key of ['components', 'hooks']) {
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
  if (!local || local.startsWith(`..${sep}`) || local === '..' || local.split(sep).includes('..')) {
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
if (projectConfig.viteConfig != null && (typeof projectConfig.viteConfig !== 'string' || !/\.(?:[cm]?[jt]s)$/.test(projectConfig.viteConfig) || projectConfig.viteConfig.startsWith('/') || projectConfig.viteConfig.split('/').includes('..'))) {
  throw new Error('project.viteConfig must be a relative .js, .mjs, .cjs, .ts, .mts, or .cts path')
}

const outputDirectory = join(siteDirectory, '.generated-guides')
const generatedDirectory = join(siteDirectory, '.vitepress/generated')
const mermaidCache = join(siteDirectory, '.vitepress/mermaid-cache')
const mermaidConfigPath = join(siteDirectory, '.vitepress/mermaid-config.json')
const mermaidConfig = await readFile(mermaidConfigPath, 'utf8')
const darkMessageTextColor = '#f1f3fc'
const incremental = process.env.DOCS_PREPARE_INCREMENTAL === '1'
const records = []
const routeMap = new Map()
const generatedFiles = new Set()
const navigationOrder = {}
const sidebarConfigurations = new Map()
const sidebarIconSources = new Set()
const directories = []
const guideUris = new Map()
let diagramsCached = 0
let diagramsRendered = 0
const cleanDir = (s) => s.replace(/^\d+[.-]/, '')
const cleanFile = (s) => s.replace(/^\d+[-.]/, '').replace(/\.[a-z]{2,3}\.md$/i, '.md')
const sourceLanguage = (path) => path.match(/\.([a-z]{2,3}(?:-[A-Z]{2})?)\.md$/i)?.[1]?.toLowerCase() ?? defaultLanguage.toLowerCase()
const execFile = promisify(execFileCallback)
const sourceRoot = resolve(configDirectory, config.guidesPath)

function stagedPath(sourcePath, language = null) {
  const sourceRelative = relative(sourceRoot, sourcePath).split(sep).join('/')
  const isMarkdown = sourcePath.toLowerCase().endsWith('.md')
  const locale = (language ?? (isMarkdown ? sourceLanguage(sourcePath) : defaultLanguage)).toLowerCase()
  const localePrefix = locale === defaultLanguage.toLowerCase() ? [] : [locale]
  const guide = config.subguides.find(({ path }) => sourceRelative === path || sourceRelative.startsWith(`${path}/`))
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

async function scan(sourceRoot, outputRoot, sourcePath = sourceRoot, outputPath = outputRoot) {
  const entries = (await readdir(sourcePath, { withFileTypes: true }))
    .filter((entry) => !entry.name.startsWith('.') && entry.name !== 'README.md' && entry.name !== 'vitepress.config.json' && entry.name !== 'sidebar.json')
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
    sidebarConfigurations.set(outputRelativePath, {
      labels: sidebarConfig.labels,
      icon: resolve(sourcePath, sidebarConfig.icon),
    })
    sidebarIconSources.add(resolve(sourcePath, sidebarConfig.icon))
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
        if (language.toLowerCase() === defaultLanguage.toLowerCase()) continue
        navigationOrder[`${language}/${orderPath}`] = entry.name
      }
    }
    if (entry.isDirectory()) await scan(sourceRoot, outputRoot, from, to)
    else {
      if (sidebarIconSources.has(resolve(from))) continue
      await mkdir(dirname(to), { recursive: true })
      routeMap.set(resolve(from), to)
      if (extname(entry.name).toLowerCase() === '.md') records.push({ from, to, sourceRoot })
      else {
        generatedFiles.add(to)
        await copyIfChanged(from, to)
      }
    }
  }
}

for (const guide of config.subguides) {
  if (!guide.uri || typeof guide.uri !== 'object' || Array.isArray(guide.uri) || typeof guide.uri.base !== 'string' || !/^\/(?:[A-Za-z0-9._~-]+\/)*$/.test(guide.uri.base)) {
    throw new Error(`Each subguides entry must define uri.base as an absolute path ending in /: ${guide.path}`)
  }
  guideUris.set(guide.path, guide.uri)
}
if (!incremental) await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })
await scan(sourceRoot, outputDirectory)
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

async function copyAsset(sourceFile) {
  const sourceRelativePath = relative(sourceRoot, sourceFile)
  if (sourceRelativePath === '..' || sourceRelativePath.startsWith(`..${sep}`)) {
    throw new Error(`Asset path escapes docs/guides: ${sourceFile}`)
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
  for (const role of ['body', 'code']) {
    const font = fonts[role]
    if (font == null) continue
    if (typeof font !== 'object' || Array.isArray(font)) {
      throw new Error(`fonts.${role} must be an object in ${configPath}`)
    }
    const { family, src, weight = '400 700', style = 'normal', fallback } = font
    if (typeof family !== 'string' || !/^[\p{L}\p{N} _-]+$/u.test(family.trim())) {
      throw new Error(`fonts.${role}.family must be a plain font family name in ${configPath}`)
    }
    if (src != null && (typeof src !== 'string' || extname(src).toLowerCase() !== '.woff2')) {
      throw new Error(`fonts.${role}.src must be a relative WOFF2 path in ${configPath}`)
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
      weight: String(weight),
      style,
      fallback: fallback ?? (role === 'body' ? 'ui-sans-serif, system-ui, sans-serif' : 'ui-monospace, monospace'),
    }
  }
  for (const role of Object.keys(fonts)) {
    if (!['body', 'code'].includes(role)) throw new Error(`Unknown font role fonts.${role} in ${configPath}; use body or code`)
  }
  return prepared
}

const generatedFonts = {
  site: await prepareFonts(config.fonts, join(configDirectory, 'vitepress.site.config.json')),
  guides: {},
}
const generatedGuideColors = {}
const generatedOgImages = {}
const generatedGuideKeys = new Map()
const siteLogo = config.logo ?? {}
const siteOgImages = await prepareOgImages(config.ogImages ?? [], join(configDirectory, 'vitepress.site.config.json'))
generatedOgImages.root = siteOgImages
for (const guide of config.subguides) {
  const guideConfigPath = resolve(sourceRoot, guide.path, 'vitepress.config.json')
  const guideConfig = JSON.parse(await readFile(guideConfigPath, 'utf8'))
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

const generatedMarkdown = new Set(records.map(({ to }) => to))
await rm(join(generatedDirectory, 'rewrites.json'), { force: true })
await writeIfChanged(join(generatedDirectory, 'fonts.json'), JSON.stringify(generatedFonts, null, 2))
await writeIfChanged(join(generatedDirectory, 'guide-colors.json'), JSON.stringify(generatedGuideColors, null, 2))
await writeIfChanged(join(generatedDirectory, 'og-images.json'), JSON.stringify(generatedOgImages, null, 2))
await writeIfChanged(join(generatedDirectory, 'site-content.json'), JSON.stringify({
  guidePaths: [...Object.keys(generatedGuideColors)],
  footer: config.footer ?? {},
  seo: config.seo ?? {},
  documentationNotices: config.documentationNotices ?? {},
}, null, 2))

const moduleSpecifier = (target, keepExtension = false) => {
  let value = relative(generatedDirectory, target).split(sep).join('/')
  if (!value.startsWith('.')) value = `./${value}`
  return keepExtension ? value : value.replace(/\.(?:[cm]?[jt]s)$/, '')
}

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
  ? `// Generated by prepare.mjs from project.components. Do not edit.\nimport type { App } from 'vue'\n${componentImports.join('\n')}\n\nexport const projectComponents = {\n${componentRegistrations.join('\n')}\n} as const\n\nexport function registerProjectComponents(app: App): void {\n  for (const [name, component] of Object.entries(projectComponents)) {\n    app.component(name, component)\n  }\n}\n`
  : `// Generated by prepare.mjs. No project.components directory is configured.\nimport type { App } from 'vue'\n\nexport const projectComponents = {} as const\n\nexport function registerProjectComponents(_app: App): void {}\n`
await writeIfChanged(join(generatedDirectory, 'components.ts'), componentsSource)

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
  '// Generated by prepare.mjs from project.hooks. Do not edit.',
  hookStyles && existsSync(hookStyles) ? `import '${moduleSpecifier(hookStyles)}'` : '',
  hookFile
    ? `export { DocumentationNotice, DocumentationLastModified } from '${moduleSpecifier(hookFile)}'`
    : `import { defineComponent } from 'vue'\n\nexport const DocumentationNotice = defineComponent({\n  name: 'DocumentationNotice',\n  setup: () => () => null,\n})\n\nexport const DocumentationLastModified = defineComponent({\n  name: 'DocumentationLastModified',\n  setup: () => () => null,\n})`,
].filter(Boolean).join('\n\n')
await writeIfChanged(join(generatedDirectory, 'theme.ts'), `${themeSource}\n`)

const hooksSource = [
  '// Generated by prepare.mjs from project.hooks. Do not edit.',
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

const configuredIndex = resolve(configDirectory, config.indexPath)
if (!routeMap.has(configuredIndex) || routeMap.get(configuredIndex) !== join(outputDirectory, 'index.md')) {
  throw new Error(`indexPath must point to the guides root index, which is compiled to index.md: ${config.indexPath}`)
}
let activeRenderers = 0
const rendererQueue = []
async function renderDiagram(source, svg) {
  if (activeRenderers >= 3) await new Promise((resume) => rendererQueue.push(resume))
  activeRenderers += 1
  try {
    await execFile(join(siteDirectory, 'node_modules/.bin/mmdc'), ['-i', source, '-o', svg, '-b', 'transparent', '-c', mermaidConfigPath, '-q'])
  } finally {
    activeRenderers -= 1
    rendererQueue.shift()?.()
  }
}

const flowchartPalette = [
  ['#a8b9ff', '#1c2447', '#667fd3'],
  ['#a9e8d0', '#163b31', '#4e9d80'],
  ['#ffc2d4', '#492435', '#cb6688'],
  ['#ffe09b', '#493713', '#c58b2a'],
  ['#cbbaff', '#332658', '#8c6fd0'],
]
function colorizeFlowchart(source) {
  if (!/^\s*(?:flowchart|graph)\s/m.test(source) || /\bclassDef\b/.test(source)) return source
  const nodeIds = [...new Set([...source.matchAll(/(?:^|[\s,])([A-Za-z_][A-Za-z0-9_]*)\s*(?=\[\[|\[\(|\(\(|\(\[|\{\{|\{\[|\[|\(|\{)/gm)].map((match) => match[1]))]
  if (!nodeIds.length) return source
  const definitions = flowchartPalette.map(([fill, text, stroke], index) => `classDef docsPalette${index} fill:${fill},stroke:${stroke},color:${text},stroke-width:1.5px;`)
  const assignments = nodeIds.map((node, index) => `class ${node} docsPalette${index % flowchartPalette.length};`)
  return `${source}\n${definitions.join('\n')}\n${assignments.join('\n')}`
}
async function createDarkVariant(lightPath, darkPath) {
  const source = await readFile(lightPath, 'utf8')
  if (!source.includes('</svg>')) throw new Error(`Mermaid output is not a valid SVG: ${lightPath}`)
  const style = `<style>.messageText{fill:${darkMessageTextColor}!important;}</style>`
  await writeFile(darkPath, source.replace('</svg>', `${style}</svg>`))
}

await mkdir(mermaidCache, { recursive: true })
await Promise.all(records.map(async (record) => {
  let markdown = await readFile(record.from, 'utf8')
  const frontmatter = markdown.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!frontmatter || !/^sidebarTitle:\s*.+$/m.test(frontmatter[1])) {
    throw new Error(`Every published Markdown page must define sidebarTitle: ${record.from}`)
  }
  const mermaidBlocks = [...markdown.matchAll(/^```mermaid\s*\n([\s\S]*?)\n```\s*$/gm)]
  const rendered = await Promise.all(mermaidBlocks.map(async (block) => {
    const diagram = colorizeFlowchart(block[1])
    const id = createHash('sha256').update(mermaidConfig).update('\0').update(diagram).digest('hex').slice(0, 16)
    const source = join(outputDirectory, `.mermaid-${id}.mmd`)
    const svg = join(outputDirectory, 'public', 'mermaid', `${id}.svg`)
    const darkSvg = join(outputDirectory, 'public', 'mermaid', `${id}.dark.svg`)
    const cachedSvg = join(mermaidCache, `${id}.svg`)
    const cachedDarkSvg = join(mermaidCache, `${id}.dark-${darkMessageTextColor.slice(1)}.svg`)
    await mkdir(dirname(svg), { recursive: true })
    try { await access(cachedSvg); await copyIfChanged(cachedSvg, svg); diagramsCached += 1 }
    catch {
      await writeIfChanged(source, diagram)
      await renderDiagram(source, svg)
      await cp(svg, cachedSvg)
      diagramsRendered += 1
    }
    await rm(source, { force: true })
    generatedFiles.add(svg)
    generatedFiles.add(darkSvg)
    const importableSvg = join(outputDirectory, 'mermaid', `${id}.svg`)
    generatedFiles.add(importableSvg)
    await copyIfChanged(svg, importableSvg)
    try { await access(cachedDarkSvg); await copyIfChanged(cachedDarkSvg, darkSvg) }
    catch {
      await createDarkVariant(svg, darkSvg)
      await cp(darkSvg, cachedDarkSvg)
    }
    return { block, id }
  }))
  for (const { block, id } of rendered.reverse()) markdown = `${markdown.slice(0, block.index)}![Mermaid diagram](/mermaid/${id}.svg)${markdown.slice(block.index + block[0].length)}`
  const markdownAssetTargets = new Map()
  const stageReference = async (reference, baseDirectory) => {
    if (/^(?:[a-z]+:|\/|#)/i.test(reference)) return null
    const [path, ...suffix] = reference.split(/(?=[?#])/)
    const sourceFile = resolve(baseDirectory, path)
    const sourceRelativePath = await copyAsset(sourceFile).catch((error) => {
      if (error.code === 'ENOENT') return null
      throw error
    })
    if (!sourceRelativePath) return null
    return `/${sourceRelativePath}${suffix.join('')}`
  }

  const frontmatterRange = markdown.match(/^---\s*\n([\s\S]*?)\n---/)
  if (frontmatterRange) {
    const frontmatterStart = frontmatterRange.index + frontmatterRange[0].indexOf(frontmatterRange[1])
    const frontmatter = frontmatterRange[1]
    const sources = [...frontmatter.matchAll(/^(\s*src:\s*)(["']?)([^"'\s]+)\2(\s*)$/gm)]
    for (const match of sources.reverse()) {
      const target = await stageReference(match[3], dirname(record.from))
      if (!target) continue
      const replacement = `${match[1]}${match[2]}${target}${match[2]}${match[4]}`
      const start = frontmatterStart + match.index
      markdown = `${markdown.slice(0, start)}${replacement}${markdown.slice(start + match[0].length)}`
    }
  }

  for (const [, href] of markdown.matchAll(/!?\[[^\]]*\]\(([^\s)]+)\)/g)) {
    if (/^(?:[a-z]+:|\/|#)/i.test(href)) continue
    const [path] = href.split(/(?=[?#])/)
    const sourceFile = resolve(dirname(record.from), path)
    if (routeMap.has(sourceFile) || routeMap.has(`${sourceFile}.md`)) continue
    markdownAssetTargets.set(href, await stageReference(href, dirname(record.from)))
  }
  markdown = markdown.replace(/(!?\[[^\]]*\]\()([^\s)]+)(\))/g, (all, before, href, after) => {
    if (/^(?:[a-z]+:|\/|#)/i.test(href)) return all
    const [path, ...suffix] = href.split(/(?=[?#])/)
    const sourceFile = resolve(dirname(record.from), path)
    let outputTarget = routeMap.get(sourceFile) ?? routeMap.get(`${sourceFile}.md`)
    if (!outputTarget) {
      const cleanPath = path.replace(/\.html?$/i, '').replace(/\.md$/i, '')
      const candidates = [
        resolve(dirname(record.to), path),
        resolve(dirname(record.to), `${cleanPath}.md`),
        resolve(dirname(record.to), cleanPath, 'index.md'),
      ]
      outputTarget = candidates.find((candidate) => generatedMarkdown.has(candidate))
    }
    if (!outputTarget) {
      const assetTarget = markdownAssetTargets.get(href)
      return assetTarget ? `${before}${assetTarget}${after}` : all
    }
    const target = publicMarkdownLink(outputTarget)
    return `${before}${target}${suffix.join('')}${after}`
  })
  generatedFiles.add(record.to)
  await writeIfChanged(record.to, markdown)
}))

const defaultPageRecords = records.filter(({ from }) => sourceLanguage(from).toLowerCase() === defaultLanguage.toLowerCase())
const defaultRouteUrls = new Set(defaultPageRecords.map(({ to }) => publicMarkdownLink(to).replace(/\/$/, '') || '/'))
for (const directory of directories) {
  const indexPath = join(stagedPath(directory.sourcePath, defaultLanguage), 'index.md')
  defaultRouteUrls.add(publicMarkdownLink(indexPath).replace(/\/$/, '') || '/')
}
for (const language of config.languages) {
  if (language.toLowerCase() === defaultLanguage.toLowerCase()) continue
  const requestedLabel = config.languageLabels[language]
  const fallbackLabel = config.languageLabels[defaultLanguage]
  const notice = config.fallbackNotices[language]
    .replaceAll('{requested}', requestedLabel)
    .replaceAll('{fallback}', fallbackLabel)
  for (const record of defaultPageRecords) {
    const localizedTarget = stagedPath(record.from, language)
    if (generatedMarkdown.has(localizedTarget)) continue
    let markdown = await readFile(record.to, 'utf8')
    if (/^---\s*\n/.test(markdown)) {
      const end = markdown.indexOf('\n---', 4)
      if (end < 0) throw new Error(`Malformed frontmatter in ${record.to}`)
      const metadata = `requestedLanguage: ${JSON.stringify(language)}\ncontentLanguage: ${JSON.stringify(defaultLanguage)}\nlanguageFallbackNotice: ${JSON.stringify(notice)}\n`
      const frontmatter = markdown.slice(4, end).replace(/^lang:\s*.*$/m, `lang: ${JSON.stringify(language)}`)
      markdown = `---\n${metadata}${frontmatter}\n---${markdown.slice(end + 4)}`
    } else {
      markdown = `---\nrequestedLanguage: ${JSON.stringify(language)}\ncontentLanguage: ${JSON.stringify(defaultLanguage)}\nlanguageFallbackNotice: ${JSON.stringify(notice)}\n---\n\n${markdown}`
    }
    markdown = markdown.replace(/(!?\[[^\]]*\]\()([^)]+)(\))/g, (all, before, href, after) => {
      if (before.startsWith('!') || !href.startsWith('/') || href.startsWith('//')) return all
      const path = href.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/'
      if (!defaultRouteUrls.has(path)) return all
      return `${before}/${language}${href}${after}`
    })
    // Markdown SFC imports resolve from the localized file's directory. Keep
    // relative assets available at that exact path for generated fallback pages.
    for (const [, , specifier] of markdown.matchAll(/\bfrom\s+(['"])(\.{1,2}\/[^'"]+)\1/g)) {
      const sourceAsset = resolve(dirname(record.to), specifier)
      const localizedAsset = resolve(dirname(localizedTarget), specifier)
      try {
        await access(sourceAsset)
        await mkdir(dirname(localizedAsset), { recursive: true })
        await copyIfChanged(sourceAsset, localizedAsset)
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
    generatedMarkdown.add(localizedTarget)
    generatedFiles.add(localizedTarget)
    await writeIfChanged(localizedTarget, markdown)
  }
}

let generatedSeoPages = 0
const seoPath = config.seo?.path ?? 'faq'
const seoLocales = config.seo?.locales ?? {}
const defaultSeoLocale = config.languages[0].toLowerCase().split('-')[0]
for (const [language, locale] of Object.entries(seoLocales)) {
  if (!locale || (!locale.quickLinks?.length && !locale.faq?.length)) continue
  const localizedPath = language.toLowerCase() === defaultSeoLocale ? seoPath : `${language}/${seoPath}`
  const pathParts = localizedPath.split('/')
  const indexPath = join(outputDirectory, ...pathParts, 'index.md')
  const noSlashAlias = join(outputDirectory, ...pathParts.slice(0, -1), `${pathParts.at(-1)}.md`)
  if (generatedMarkdown.has(indexPath) || generatedMarkdown.has(noSlashAlias)) {
    throw new Error(`SEO page path conflicts with a documentation page: ${localizedPath}`)
  }
  const title = locale.pageTitle ?? locale.faqTitle ?? 'Frequently asked questions'
  const description = locale.description ?? locale.faqTitle ?? title
  const quickLinks = (locale.quickLinks ?? []).map((link) => `- [${link.label}](${link.url}) — ${link.description}`).join('\n')
  const answers = (locale.faq ?? []).map((item) => `### ${item.question}\n\n${item.answer}`).join('\n\n')
  const content = `---\ntitle: ${JSON.stringify(title)}\nsidebarTitle: ${JSON.stringify(locale.pageNavTitle ?? 'FAQ')}\ndescription: ${JSON.stringify(description)}\nlang: ${JSON.stringify(language)}\n---\n\n# ${title}\n\n${locale.quickLinks?.length ? `## ${locale.quickLinksTitle ?? 'Popular guides'}\n\n${quickLinks}\n\n` : ''}${locale.faq?.length ? `## ${locale.faqTitle ?? 'Quick answers'}\n\n${answers}\n` : ''}`
  generatedMarkdown.add(indexPath)
  generatedFiles.add(indexPath)
  await writeIfChanged(indexPath, content)
  generatedMarkdown.add(noSlashAlias)
  generatedFiles.add(noSlashAlias)
  await writeIfChanged(noSlashAlias, content.replace(/\n---\n/, '\nsearch: false\n---\n'))
  generatedSeoPages += 1
}

for (const directory of [...directories].reverse()) {
  const sourceRelative = relative(sourceRoot, directory.sourcePath).split(sep).join('/')
  const guide = config.subguides.find(({ path }) => sourceRelative === path || sourceRelative.startsWith(`${path}/`))
  if (!guide) continue
  const sourceNames = Object.fromEntries(directory.entries.map((entry) => [entry.name, entry.name]))
  const sortedEntries = sortNavigationEntries(directory.entries.filter((entry) => entry.isDirectory() || /\.md$/i.test(entry.name)), sourceNames)
  for (const language of config.languages) {
    const directoryTarget = stagedPath(directory.sourcePath, language)
    const indexPath = join(directoryTarget, 'index.md')
    if (!generatedMarkdown.has(indexPath)) {
      let childPage
      const seen = new Set()
      for (const entry of sortedEntries) {
        if (entry.isDirectory()) {
          const candidates = [join(stagedPath(join(directory.sourcePath, entry.name), language), 'index.md'), join(stagedPath(join(directory.sourcePath, entry.name), defaultLanguage), 'index.md')]
          childPage = candidates.find((candidate) => generatedMarkdown.has(candidate))
        } else {
          const slug = cleanFile(entry.name)
          if (seen.has(slug)) continue
          seen.add(slug)
          const family = sortedEntries.filter((candidate) => !candidate.isDirectory() && cleanFile(candidate.name) === slug)
          const selected = family.find((candidate) => sourceLanguage(candidate.name).toLowerCase() === language.toLowerCase())
            ?? family.find((candidate) => sourceLanguage(candidate.name).toLowerCase() === defaultLanguage.toLowerCase())
          if (selected) {
            const localizedCandidate = stagedPath(join(directory.sourcePath, selected.name), language)
            const defaultCandidate = stagedPath(join(directory.sourcePath, selected.name), defaultLanguage)
            childPage = generatedMarkdown.has(localizedCandidate) ? localizedCandidate : defaultCandidate
          }
        }
        if (childPage && generatedMarkdown.has(childPage)) break
      }
      if (!childPage || !generatedMarkdown.has(childPage)) continue
      let markdown = await readFile(childPage, 'utf8')
      if (/^---\s*\n/.test(markdown)) {
        const end = markdown.indexOf('\n---', 4)
        if (end < 0) throw new Error(`Malformed frontmatter in ${childPage}`)
        const frontmatter = markdown.slice(4, end)
        if (!/^search\s*:/m.test(frontmatter)) markdown = `---\n${frontmatter}\nsearch: false${markdown.slice(end)}`
        else markdown = markdown.replace(/^search\s*:\s*.*$/m, 'search: false')
      } else {
        markdown = `---\nsearch: false\n---\n\n${markdown}`
      }
      generatedMarkdown.add(indexPath)
      generatedFiles.add(indexPath)
      await writeIfChanged(indexPath, markdown)
    }
    const languageRoot = relative(outputDirectory, directoryTarget).replace(/\\/g, '/') === language.toLowerCase()
    const noSlashAlias = `${directoryTarget}.md`
    if (!languageRoot && !generatedMarkdown.has(noSlashAlias)) {
      let markdown = await readFile(indexPath, 'utf8')
      if (/^---\s*\n/.test(markdown)) {
        const end = markdown.indexOf('\n---', 4)
        if (end < 0) throw new Error(`Malformed frontmatter in ${indexPath}`)
        const frontmatter = markdown.slice(4, end)
        if (!/^search\s*:/m.test(frontmatter)) markdown = `---\n${frontmatter}\nsearch: false${markdown.slice(end)}`
        else markdown = markdown.replace(/^search\s*:\s*.*$/m, 'search: false')
      } else {
        markdown = `---\nsearch: false\n---\n\n${markdown}`
      }
      generatedMarkdown.add(noSlashAlias)
      generatedFiles.add(noSlashAlias)
      await writeIfChanged(noSlashAlias, markdown)
    }
  }
}

if (incremental) {
  async function removeStale(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) {
        await removeStale(path)
        if ((await readdir(path)).length === 0) await rm(path, { recursive: true, force: true })
      } else if (!generatedFiles.has(path)) {
        await rm(path, { force: true })
      }
    }
  }
  await removeStale(outputDirectory)
}
process.stdout.write(`Prepared ${records.length + generatedSeoPages} Markdown pages; Mermaid diagrams: ${diagramsCached} cached, ${diagramsRendered} rendered.\n`)

