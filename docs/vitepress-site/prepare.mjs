import { access, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile as execFileCallback } from 'node:child_process'
import { createHash } from 'node:crypto'
import { promisify } from 'node:util'

const siteDirectory = dirname(fileURLToPath(import.meta.url))
const configDirectory = resolve(siteDirectory, '../guides')
const config = JSON.parse(await readFile(join(configDirectory, 'vitepress.site.config.json'), 'utf8'))
const outputDirectory = join(siteDirectory, '.generated-guides')
const mermaidCache = join(siteDirectory, '.vitepress/mermaid-cache')
const mermaidConfigPath = join(siteDirectory, '.vitepress/mermaid-config.json')
const mermaidConfig = await readFile(mermaidConfigPath, 'utf8')
const darkMessageTextColor = '#f1f3fc'
const incremental = process.env.FELUQA_PREPARE_INCREMENTAL === '1'
const records = []
const routeMap = new Map()
const generatedFiles = new Set()
const sidebarConfigurations = new Map()
const sidebarIconSources = new Set()
let diagramsCached = 0
let diagramsRendered = 0
const cleanDir = (s) => s.replace(/^\d+-/, '')
const cleanFile = (s) => s.replace(/^\d+[-.]/, '').replace(/\.[a-z]{2,3}\.md$/i, '.md')
const execFile = promisify(execFileCallback)

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
  let sidebarConfig
  try {
    sidebarConfig = JSON.parse(await readFile(join(sourcePath, 'sidebar.json'), 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  if (sidebarConfig) {
    const outputRelativePath = relative(outputRoot, outputPath).split(sep).join('/')
    const matchingGuide = config.subguides.find((guide) => outputRelativePath.startsWith(`${guide.path}/`))
    const guideRelativePath = matchingGuide ? outputRelativePath.slice(matchingGuide.path.length + 1) : ''
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
  for (const entry of await readdir(sourcePath, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'README.md' || entry.name === 'vitepress.config.json' || entry.name === 'sidebar.json') continue
    const from = join(sourcePath, entry.name)
    const to = join(outputPath, entry.isDirectory() ? cleanDir(entry.name) : cleanFile(entry.name))
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

if (!incremental) await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })
const sourceRoot = resolve(configDirectory, config.guidesPath)
await scan(sourceRoot, outputDirectory)
await mkdir(join(outputDirectory, 'public'), { recursive: true })

async function copyAsset(sourceFile) {
  const sourceRelativePath = relative(sourceRoot, sourceFile)
  if (sourceRelativePath === '..' || sourceRelativePath.startsWith(`..${sep}`)) {
    throw new Error(`Asset path escapes docs/guides: ${sourceFile}`)
  }
  const bytes = await readFile(sourceFile)
  const assetName = `${createHash('sha256').update(bytes).digest('hex')}${extname(sourceFile).toLowerCase()}`
  const publishedPath = join('__docs-assets', assetName)
  const target = join(outputDirectory, 'public', publishedPath)
  generatedFiles.add(target)
  await mkdir(dirname(target), { recursive: true })
  try { await access(target) }
  catch (error) {
    if (error.code !== 'ENOENT') throw error
    await writeFile(target, bytes)
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
for (const guide of config.subguides) {
  const guideConfigPath = resolve(sourceRoot, guide.path, 'vitepress.config.json')
  const guideConfig = JSON.parse(await readFile(guideConfigPath, 'utf8'))
  generatedFonts.guides[guide.path] = await prepareFonts(guideConfig.fonts, guideConfigPath)
}
await writeIfChanged(join(siteDirectory, '.vitepress/generated-fonts.json'), JSON.stringify(generatedFonts, null, 2))

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
    let target = relative(dirname(record.to), join(outputDirectory, sourceRelativePath)).split(sep).join('/')
    if (!target.startsWith('.')) target = `./${target}`
    return `${target}${suffix.join('')}`
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
    const outputTarget = routeMap.get(sourceFile) ?? routeMap.get(`${sourceFile}.md`)
    if (!outputTarget) {
      const assetTarget = markdownAssetTargets.get(href)
      return assetTarget ? `${before}${assetTarget}${after}` : all
    }
    let target = relative(dirname(record.to), outputTarget).split(sep).join('/')
    if (target.endsWith('.md')) target = target.slice(0, -3)
    if (!target.startsWith('.')) target = `./${target}`
    return `${before}${target}${suffix.join('')}${after}`
  })
  generatedFiles.add(record.to)
  await writeIfChanged(record.to, markdown)
}))

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

