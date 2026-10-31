import { existsSync, readFileSync } from 'node:fs'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'
import { sortNavigationEntries } from '../../shared/navigation-order.mjs'
import { localePrefix } from '../../spmpst/routing.mjs'

export async function runPager(ctx) {
  const { siteDirectory, configDirectory, copyAsset, publicPagePath, publicUrl, publicMarkdownLink, config, styleFiles, collections, siteThemeSlots, themeSlots, iconNamePattern, flowchartPalette, nodeBorderWidth, defaultLanguage, projectConfig, projectDirectories, findIcon, resolveIcon, resolveSidebarIcon, outputDirectory, generatedDirectory, mermaidCache, mermaidConfigPath, mermaidConfig, darkMessageTextColor, incremental, records, routeMap, generatedFiles, navigationOrder, sidebarConfigurations, sidebarIconSources, sidebarPageIcons, directories, guideUris, cleanDir, cleanFile, sourceLanguage, sourceRoot, collectionMetadata, localizedValue, stagedPath, copyIfChanged, writeIfChanged, scan, frontmatterScalar, humanize, readingMetrics, generatedFonts, generatedGuideColors, generatedOgImages, generatedCollectionNavigation, generatedCollectionPages, generatedMarkdown, generatedGuideThemeSlotsByRoute, prefixDefaultLanguage } = ctx
  const pendingWrites = []
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
    return [...localePrefix(language, defaultLanguage, prefixDefaultLanguage), seoPath].filter(Boolean).join('/').split('/')[0]
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
  const prefix = localePrefix(language, defaultLanguage, prefixDefaultLanguage, { lowercase: true })
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

const pagerTitles = new Map()
function pagerTarget(file) {
  let target = pagerTitles.get(file)
  if (!target) {
    const markdown = readFileSync(file, 'utf8')
    const title = frontmatterScalar(markdown, 'sidebarTitle') || frontmatterScalar(markdown, 'title') || humanize(file)
    target = { text: title, link: publicUrl(file) }
    pagerTitles.set(file, target)
  }
  return target
}

const pagedFiles = new Set()
for (const language of config.languages) {
  const prefix = localePrefix(language, defaultLanguage, prefixDefaultLanguage, { lowercase: true })
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

    const contents = new Map(await Promise.all([...pager.keys()].map(async (file) => [file, await readFile(file, 'utf8')])))
    for (const [file, [previous, next]] of pager) {
      const markdown = contents.get(file)
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
      if (updated !== markdown) pendingWrites.push(writeFile(file, updated))
    }
  }
}

// Pages outside any guide reading order (FAQ, collections, home) must not
// inherit a pager from the surrounding sidebar.
const remaining = [...generatedMarkdown].filter((file) => !pagedFiles.has(file))
const remainingContents = await Promise.all(remaining.map(async (file) => {
  try { return [file, await readFile(file, 'utf8')] }
  catch (error) { if (error.code === 'ENOENT') return null; throw error }
}))
for (const entry of remainingContents) {
  if (!entry) continue
  const [file, markdown] = entry
  const frontmatter = markdown.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!frontmatter) continue
  const kept = frontmatter[1].split('\n').filter((line) => !/^(?:prev|next):(?:\s|$)/.test(line))
  kept.push('prev: false', 'next: false')
  const updated = `${markdown.slice(0, frontmatter.index)}---\n${kept.join('\n')}\n---${markdown.slice(frontmatter.index + frontmatter[0].length)}`
  generatedFiles.add(file)
  if (updated !== markdown) pendingWrites.push(writeFile(file, updated))
}
await Promise.all(pendingWrites)
  return ctx
}
