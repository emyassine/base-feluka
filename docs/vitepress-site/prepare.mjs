import { access, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile as execFileCallback } from 'node:child_process'
import { createHash } from 'node:crypto'
import { promisify } from 'node:util'
import { sortNavigationEntries } from './navigation-order.mjs'

const siteDirectory = dirname(fileURLToPath(import.meta.url))
const configDirectory = resolve(siteDirectory, '../guides')
const config = JSON.parse(await readFile(join(configDirectory, 'vitepress.site.config.json'), 'utf8'))
if (config.seo?.siteUrl != null && config.seo.siteUrl !== '' && (typeof config.seo.siteUrl !== 'string' || !/^https:\/\/[^\s/]+(?:\/[^\s]*)?$/.test(config.seo.siteUrl))) {
  throw new Error('seo.siteUrl must be an absolute HTTPS URL when configured')
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
const outputDirectory = join(siteDirectory, '.generated-guides')
const mermaidCache = join(siteDirectory, '.vitepress/mermaid-cache')
const mermaidConfigPath = join(siteDirectory, '.vitepress/mermaid-config.json')
const mermaidConfig = await readFile(mermaidConfigPath, 'utf8')
const darkMessageTextColor = '#f1f3fc'
const incremental = process.env.FELUQA_PREPARE_INCREMENTAL === '1'
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
const execFile = promisify(execFileCallback)
const sourceRoot = resolve(configDirectory, config.guidesPath)

function stagedPath(sourcePath) {
  const sourceRelative = relative(sourceRoot, sourcePath).split(sep).join('/')
  const guide = config.subguides.find(({ path }) => sourceRelative === path || sourceRelative.startsWith(`${path}/`))
  if (!guide) {
    const parts = sourceRelative.split('/')
    return join(outputDirectory, ...parts.map((part, index) => index === parts.length - 1 && part.endsWith('.md') ? cleanFile(part) : cleanDir(part)))
  }
  const uri = guideUris.get(guide.path)
  const local = sourceRelative === guide.path ? '' : sourceRelative.slice(guide.path.length + 1)
  const parts = local ? local.split('/').map((part, index, all) => index === all.length - 1 && part.endsWith('.md') ? cleanFile(part) : cleanDir(part)) : []
  if (parts.length === 1 && parts[0] === 'index.md' && uri.index) parts.splice(0, 1, ...uri.index.replace(/\/$/, '').split('/'), 'index.md')
  const base = uri.base.replace(/^\/+|\/+$/g, '')
  return join(outputDirectory, ...[base, ...parts].filter(Boolean).flatMap((part) => part.split('/')))
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
  if (!indexOnly) {
    try {
      sidebarConfig = JSON.parse(await readFile(join(sourcePath, 'sidebar.json'), 'utf8'))
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
  if (sidebarConfig) {
    const outputRelativePath = relative(outputRoot, stagedPath(sourcePath)).split(sep).join('/')
    const sourceRelativePath = relative(sourceRoot, sourcePath).split(sep).join('/')
    const matchingGuide = config.subguides.find((guide) => sourceRelativePath.startsWith(`${guide.path}/`))
    const guideRelativePath = matchingGuide ? sourceRelativePath.slice(matchingGuide.path.length + 1) : ''
    const isTopLevelGroup = Boolean(guideRelativePath && !guideRelativePath.includes('/'))
    if (!sidebarConfig.labels || typeof sidebarConfig.labels !== 'object' || Array.isArray(sidebarConfig.labels)) {
      throw new Error(`sidebar.json must define a labels object by language: ${join(sourcePath, 'sidebar.json')}`)
    }
    for (const language of config.languages) {
      if (typeof sidebarConfig.labels[language] !== 'string' || !sidebarConfig.labels[language].trim()) {
        throw new Error(`sidebar.json needs a non-empty labels.${language}: ${join(sourcePath, 'sidebar.json')}`)
      }
    }
    if (sidebarConfig.icon != null && typeof sidebarConfig.icon !== 'string') {
      throw new Error(`sidebar.json icon must be a path relative to that file: ${join(sourcePath, 'sidebar.json')}`)
    }
    if (sidebarConfig.icon && !isTopLevelGroup) {
      throw new Error(`sidebar.json icons are only allowed on top-level guide groups: ${join(sourcePath, 'sidebar.json')}`)
    }
    sidebarConfigurations.set(outputRelativePath, {
      labels: sidebarConfig.labels,
      icon: sidebarConfig.icon ? resolve(sourcePath, sidebarConfig.icon) : null,
    })
    if (sidebarConfig.icon) sidebarIconSources.add(resolve(sourcePath, sidebarConfig.icon))
  }
  if (sourcePath !== sourceRoot) directories.push({ sourcePath, outputPath, entries })
  for (const entry of entries) {
    const from = join(sourcePath, entry.name)
    const to = stagedPath(from)
    await mkdir(dirname(to), { recursive: true })
    navigationOrder[relative(outputRoot, to).split(sep).join('/')] = entry.name
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
await writeIfChanged(join(siteDirectory, '.vitepress/generated-navigation-order.json'), JSON.stringify(navigationOrder, null, 2))
await mkdir(join(outputDirectory, 'public'), { recursive: true })

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
const generatedGuideKeys = new Map()
const siteLogo = config.logo ?? {}
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
  const faviconPath = guideConfig.favicon
    ? `/${await copyAsset(resolve(dirname(guideConfigPath), guideConfig.favicon))}`
    : null
  const logo = { ...siteLogo, ...(guideConfig.logo ?? {}) }
  if (typeof logo.light !== 'string' || typeof logo.dark !== 'string') {
    throw new Error(`logo.light and logo.dark must be set globally or in ${guideConfigPath}`)
  }
  if (logo.width != null && (typeof logo.width !== 'string' || !/^(?:auto|(?:\d+(?:\.\d+)?)(?:px|rem|em|vw|vh|%)|100%)$/.test(logo.width.trim()))) {
    throw new Error(`logo.width must be auto or a CSS width such as 100%, 96px, or 6rem in ${guideConfigPath}`)
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
    logoAlt: logo.alt ?? 'Feluqa',
    ...(logo.width ? { logoWidth: logo.width.trim() } : {}),
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
await rm(join(siteDirectory, '.vitepress/generated-rewrites.json'), { force: true })
await writeIfChanged(join(siteDirectory, '.vitepress/generated-fonts.json'), JSON.stringify(generatedFonts, null, 2))
await writeIfChanged(join(siteDirectory, '.vitepress/generated-guide-colors.json'), JSON.stringify(generatedGuideColors, null, 2))
await writeIfChanged(join(siteDirectory, '.vitepress/generated-site-content.json'), JSON.stringify({
  guidePaths: [...Object.keys(generatedGuideColors)],
  footer: config.footer ?? {},
  seo: config.seo ?? {},
}, null, 2))

const generatedSidebar = {}
for (const [path, metadata] of sidebarConfigurations) {
  generatedSidebar[path] = {
    labels: metadata.labels,
    icon: metadata.icon ? await copyAsset(metadata.icon) : null,
  }
}
await writeIfChanged(join(siteDirectory, '.vitepress/generated-sidebar.json'), JSON.stringify(generatedSidebar, null, 2))

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
  const definitions = flowchartPalette.map(([fill, text, stroke], index) => `classDef feluqaPalette${index} fill:${fill},stroke:${stroke},color:${text},stroke-width:1.5px;`)
  const assignments = nodeIds.map((node, index) => `class ${node} feluqaPalette${index % flowchartPalette.length};`)
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

for (const directory of [...directories].reverse()) {
  const sourceRelative = relative(sourceRoot, directory.sourcePath).split(sep).join('/')
  const guide = config.subguides.find(({ path }) => sourceRelative === path || sourceRelative.startsWith(`${path}/`))
  if (!guide) continue
  const indexPath = join(stagedPath(directory.sourcePath), 'index.md')
  if (!generatedMarkdown.has(indexPath)) {
    const sourceNames = Object.fromEntries(directory.entries.map((entry) => [entry.name, entry.name]))
    const first = sortNavigationEntries(directory.entries.filter((entry) => entry.isDirectory() || /\.md$/i.test(entry.name)), sourceNames)[0]
    if (!first) continue
    let childPage = stagedPath(join(directory.sourcePath, first.name))
    if (first.isDirectory()) childPage = join(childPage, 'index.md')
    if (!generatedMarkdown.has(childPage)) continue
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
  const noSlashAlias = `${stagedPath(directory.sourcePath)}.md`
  if (!generatedMarkdown.has(noSlashAlias)) {
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
process.stdout.write(`Prepared ${records.length} Markdown pages; Mermaid diagrams: ${diagramsCached} cached, ${diagramsRendered} rendered.\n`)

