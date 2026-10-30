import { access, cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { existsSync } from 'node:fs'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile as execFileCallback } from 'node:child_process'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { promisify } from 'node:util'
import { sortNavigationEntries } from '../shared/navigation-order.mjs'

/**
 * PREPARATION ENTRYPOINT
 * Serializes concurrent runs, loads source configuration, stages documentation,
 * builds navigation/theme metadata, renders diagrams, and writes only generated artifacts.
 */
const siteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
if (process.env.DOCS_PREPARE_LOCK_HELD !== '1') {
  const result = spawnSync('flock', ['--exclusive', join(siteDirectory, '.build.lock'), process.execPath, fileURLToPath(import.meta.url)], {
    cwd: siteDirectory,
    env: { ...process.env, DOCS_PREPARE_LOCK_HELD: '1' },
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  process.exit(result.status ?? 1)
}
const sourceState = await (await import('./source-stage.mjs')).prepareSources(siteDirectory)
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
  iconNamePattern,
  flowchartPalette,
  nodeBorderWidth,
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
  prefixDefaultLanguage,
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
} = sourceState
const execFile = promisify(execFileCallback)
let diagramsCached = sourceState.diagramsCached
let diagramsRendered = sourceState.diagramsRendered

const contentState = await (await import('./content-stage.mjs')).prepareContent(sourceState)
const {
  frontmatterScalar,
  humanize,
  readingMetrics,
  generatedFonts,
  generatedGuideColors,
  generatedOgImages,
  generatedCollectionNavigation,
  generatedCollectionPages,
  generatedMarkdown,
  generatedGuideThemeSlotsByRoute
} = contentState

const configuredIndex = resolve(configDirectory, config.indexPath)
const configuredIndexOutput = join(outputDirectory, ...(prefixDefaultLanguage ? [defaultLanguage.toLowerCase()] : []), 'index.md')
if (!routeMap.has(configuredIndex) || routeMap.get(configuredIndex) !== configuredIndexOutput) {
  throw new Error(`indexPath must point to the guides root index, which is compiled to index.md: ${config.indexPath}`)
}
let activeRenderers = 0
const rendererQueue = []

/** DIAGRAM RENDERING — Mermaid CLI output is cached by source and renderer config. */
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

function colorizeFlowchart(source) {
  if (!/^\s*(?:flowchart|graph)\s/m.test(source) || /\bclassDef\b/.test(source)) return source
  const nodeIds = [...new Set([...source.matchAll(/(?:^|[\s,])([A-Za-z_][A-Za-z0-9_]*)\s*(?=\[\[|\[\(|\(\(|\(\[|\{\{|\{\[|\[|\(|\{)/gm)].map((match) => match[1]))]
  if (!nodeIds.length) return source
  const definitions = flowchartPalette.map(({ fill, text, stroke }, index) => `classDef docsPalette${index} fill:${fill},stroke:${stroke},color:${text},stroke-width:${nodeBorderWidth};`)
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
  const owningCollection = collections.find((collection) => record.from.startsWith(`${collection.sourceDirectory}${sep}`))
  if (owningCollection) {
    const metadata = markdown.match(/^---\s*\n([\s\S]*?)\n---/)
    if (metadata) {
      const frontmatter = metadata[1].split('\n').filter((line) => !/^(?:sidebar|aside):\s*/.test(line))
      if (owningCollection.layout === 'article') {
        const { wordCount, readingTime } = readingMetrics(markdown)
        if (!/^collection:\s*/m.test(metadata[1])) frontmatter.push(`collection: ${JSON.stringify(owningCollection.id)}`)
        if (!/^wordCount:\s*/m.test(metadata[1])) frontmatter.push(`wordCount: ${wordCount}`)
        if (!/^readingTime:\s*/m.test(metadata[1])) frontmatter.push(`readingTime: ${readingTime}`)
      }
      frontmatter.push('sidebar: false', 'aside: false')
      markdown = markdown.replace(metadata[0], `---\n${frontmatter.join('\n')}\n---`)
    }
  }
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
    sidebarPageIcons[publicMarkdownLink(localizedTarget)] = record.iconAsset
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
        generatedFiles.add(localizedAsset)
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
  const icon = locale.icon
  if (typeof icon !== 'string' || !iconNamePattern.test(icon)) {
    throw new Error(`seo.locales.${language}.icon must name an SVG in project.iconLibrary`)
  }
  const iconPath = resolveIcon(icon, `seo.locales.${language}`)
  const iconAsset = await copyAsset(iconPath)
  const content = `---\ntitle: ${JSON.stringify(title)}\nsidebarTitle: ${JSON.stringify(locale.pageNavTitle ?? 'FAQ')}\nicon: ${JSON.stringify(icon)}\ndescription: ${JSON.stringify(description)}\nlang: ${JSON.stringify(language)}\n---\n\n# ${title}\n\n${locale.quickLinks?.length ? `## ${locale.quickLinksTitle ?? 'Popular guides'}\n\n${quickLinks}\n\n` : ''}${locale.faq?.length ? `## ${locale.faqTitle ?? 'Quick answers'}\n\n${answers}\n` : ''}`
  sidebarPageIcons[publicMarkdownLink(indexPath)] = iconAsset
  sidebarPageIcons[publicMarkdownLink(noSlashAlias)] = iconAsset
  generatedMarkdown.add(indexPath)
  generatedFiles.add(indexPath)
  await writeIfChanged(indexPath, content)
  generatedMarkdown.add(noSlashAlias)
  generatedFiles.add(noSlashAlias)
  await writeIfChanged(noSlashAlias, content.replace(/\n---\n/, '\nsearch: false\n---\n'))
  generatedSeoPages += 1
}

await writeIfChanged(join(generatedDirectory, 'sidebar-page-icons.json'), JSON.stringify(sidebarPageIcons, null, 2))

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

// VitePress infers the footer pager from the sidebar. Generated directory entry
// pages and their no-slash aliases are copies of the first real page below them
// and are not part of the sidebar, so VitePress fell back to the first sidebar
// link for them (a link to a copy of the same page). Compute the reading order
// once here and write explicit prev/next frontmatter instead.
function hasSourceIndex(directory) {
  const key = relative(outputDirectory, join(directory, 'index.md')).split(sep).join('/')
  if (Object.hasOwn(navigationOrder, key)) return true
  const [first, ...rest] = key.split('/')
  return rest.length > 0
    && config.languages.some((language) => language.toLowerCase() === first)
    && Object.hasOwn(navigationOrder, rest.join('/'))
}

function routeRoot(guide) {
  return String(guide.uri.base ?? '/').replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
}

const foreignRootKeys = new Set([
  ...config.subguides.map((guide) => routeRoot(guide)[0]).filter(Boolean),
  ...collections.map((collection) => collection.id),
  ...Object.keys(config.seo?.locales ?? {}).map((language) => {
    const seoPath = config.seo.path ?? 'faq'
    return (language.toLowerCase() === defaultLanguage.toLowerCase().split('-')[0] && !prefixDefaultLanguage ? seoPath : `${language}/${seoPath}`).split('/')[0]
  }),
])

async function orderedPageEntries(directory) {
  const entries = (await readdir(directory, { withFileTypes: true })).filter((entry) => !entry.name.startsWith('.'))
  const sourceNames = {}
  for (const entry of entries) {
    const key = relative(outputDirectory, join(directory, entry.name)).split(sep).join('/')
    sourceNames[entry.name] = navigationOrder[key] ?? entry.name
  }
  return sortNavigationEntries(entries, sourceNames)
}

async function readingOrder(guide, language) {
  const prefix = language.toLowerCase() === defaultLanguage.toLowerCase() && !prefixDefaultLanguage ? [] : [language.toLowerCase()]
  const root = join(outputDirectory, ...prefix, ...routeRoot(guide))
  const order = []
  const add = (file) => { if (generatedMarkdown.has(file)) order.push(file) }
  async function walk(directory, isRoot) {
    for (const entry of await orderedPageEntries(directory)) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) {
        if (isRoot && foreignRootKeys.has(entry.name)) continue
        const childEntries = (await readdir(path, { withFileTypes: true })).filter((child) => !child.name.startsWith('.'))
        const pageEntries = childEntries.filter((child) => child.isDirectory()
          || (child.name.endsWith('.md') && (child.name !== 'index.md' || hasSourceIndex(path))))
        const onlyPage = pageEntries.length === 1 && !pageEntries[0].isDirectory() && pageEntries[0].name.endsWith('.md')
        if (onlyPage) {
          add(join(path, pageEntries[0].name))
          continue
        }
        const start = order.length
        await walk(path, false)
        if (order.length > start && hasSourceIndex(path)) order.splice(start, 0, join(path, 'index.md'))
        continue
      }
      if (!entry.name.endsWith('.md') || entry.name === 'index.md') continue
      if (existsSync(join(directory, entry.name.slice(0, -'.md'.length)))) continue
      add(path)
    }
  }
  await walk(root, true)
  return order
}

function pagerTarget(file) {
  const markdown = readFileSync(file, 'utf8')
  const title = frontmatterScalar(markdown, 'sidebarTitle') || frontmatterScalar(markdown, 'title') || humanize(file)
  return { text: title, link: publicUrl(file) }
}

const pagedFiles = new Set()
for (const language of config.languages) {
  const prefix = language.toLowerCase() === defaultLanguage.toLowerCase() && !prefixDefaultLanguage ? [] : [language.toLowerCase()]
  for (const guide of config.subguides) {
    const order = await readingOrder(guide, language)
    if (!order.length) continue
    const pager = new Map(order.map((file, index) => [file, [order[index - 1], order[index + 1]]]))

    // Generated directory entry pages and no-slash aliases mirror the first
    // real page below them, so reuse that page's neighbours instead of linking
    // a page to a copy of itself.
    const root = join(outputDirectory, ...prefix, ...routeRoot(guide))
    async function mapAliases(directory, isRoot) {
      const indexFile = join(directory, 'index.md')
      const aliasFile = `${directory}.md`
      if (!pager.has(indexFile) && generatedMarkdown.has(indexFile) && !hasSourceIndex(directory)) {
        const mirrored = order.find((file) => file.startsWith(`${directory}${sep}`))
        if (mirrored) pager.set(indexFile, pager.get(mirrored))
      }
      // The no-slash `.html` alias mirrors the directory index page.
      if (generatedMarkdown.has(aliasFile) && pager.has(indexFile)) pager.set(aliasFile, pager.get(indexFile))
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith('.') || (isRoot && foreignRootKeys.has(entry.name))) continue
        await mapAliases(join(directory, entry.name), false)
      }
    }
    await mapAliases(root, true)

    for (const [file, [previous, next]] of pager) {
      const markdown = await readFile(file, 'utf8')
      const frontmatter = markdown.match(/^---\s*\n([\s\S]*?)\n---/)
      if (!frontmatter) continue
      const kept = []
      const lines = frontmatter[1].split('\n')
      for (let index = 0; index < lines.length; index += 1) {
        if (/^(?:prev|next):(?:\s|$)/.test(lines[index])) {
          while (index + 1 < lines.length && /^\s+/.test(lines[index + 1])) index += 1
          continue
        }
        kept.push(lines[index])
      }
      const pagerLine = (name, target) => `${name}: ${target ? `{ text: ${JSON.stringify(target.text)}, link: ${JSON.stringify(target.link)} }` : 'false'}`
      kept.push(pagerLine('prev', previous && pagerTarget(previous)), pagerLine('next', next && pagerTarget(next)))
      const updated = `${markdown.slice(0, frontmatter.index)}---\n${kept.join('\n')}\n---${markdown.slice(frontmatter.index + frontmatter[0].length)}`
      generatedFiles.add(file)
      pagedFiles.add(file)
      await writeIfChanged(file, updated)
    }
  }
}

// Pages outside any guide reading order (FAQ, collections, home) must not
// inherit a pager from the surrounding sidebar.
for (const file of generatedMarkdown) {
  if (pagedFiles.has(file)) continue
  let markdown
  try { markdown = await readFile(file, 'utf8') }
  catch (error) { if (error.code === 'ENOENT') continue; throw error }
  const frontmatter = markdown.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!frontmatter) continue
  const kept = frontmatter[1].split('\n').filter((line) => !/^(?:prev|next):(?:\s|$)/.test(line))
  kept.push('prev: false', 'next: false')
  const updated = `${markdown.slice(0, frontmatter.index)}---\n${kept.join('\n')}\n---${markdown.slice(frontmatter.index + frontmatter[0].length)}`
  generatedFiles.add(file)
  await writeIfChanged(file, updated)
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

