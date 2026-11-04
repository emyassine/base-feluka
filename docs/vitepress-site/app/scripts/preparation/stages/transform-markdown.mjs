import { access, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { execFile as execFileCallback } from 'node:child_process'
import { promisify } from 'node:util'
import { writeStagedMarkdownIfChanged } from '../../spmpst/fs-utils.mjs'
import { parseResourceReference } from '../../spmpst/resources.mjs'

export async function runTransformMarkdown(ctx) {
  const { siteDirectory, configDirectory, copyAsset, copyIcon, publicPagePath, publicUrl, publicMarkdownLink, config, styleFiles, collections, siteThemeSlots, themeSlots, iconNamePattern, flowchartPalette, nodeBorderWidth, defaultLanguage, projectConfig, projectDirectories, findIcon, resolveIcon, resolveSidebarIcon, outputDirectory, generatedDirectory, mermaidCache, mermaidConfigPath, mermaidConfig, darkMessageTextColor, incremental, records, routeMap, generatedFiles, navigationOrder, sidebarConfigurations, sidebarIconSources, sidebarPageIcons, directories, guideUris, cleanDir, cleanFile, sourceLanguage, sourceRoot, collectionMetadata, localizedValue, stagedPath, copyIfChanged, writeIfChanged, scan, readSourceText, frontmatterScalar, humanize, readingMetrics, generatedFonts, generatedGuideColors, generatedOgImages, generatedCollectionNavigation, generatedCollectionPages, generatedMarkdown, generatedGuideThemeSlotsByRoute, prefixDefaultLanguage } = ctx
  const execFile = promisify(execFileCallback)
  let diagramsCached = ctx.diagramsCached
  let diagramsRendered = ctx.diagramsRendered
let activeRenderers = 0
const rendererQueue = []

/** DIAGRAM RENDERING — Mermaid CLI output is cached by source and renderer config. */
async function renderDiagram(source, svg) {
  if (activeRenderers >= 3) await new Promise((resume) => rendererQueue.push(resume))
  activeRenderers += 1
  try {
    await execFile(join(siteDirectory, '../node_modules/.bin/mmdc'), ['-i', source, '-o', svg, '-b', 'transparent', '-c', mermaidConfigPath, '-q'])
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
  let markdown = await readSourceText(record.from)
  const sourceFrontmatter = markdown.match(/^---\s*\r?\n[\s\S]*?\r?\n---/)
  const frontmatterText = sourceFrontmatter?.[0] ?? ''
  let markdownBody = frontmatterText ? markdown.slice(frontmatterText.length) : markdown
  const iconReferences = [...new Set([...markdownBody.matchAll(/@spmpst::icon::[\p{L}\p{N}][\p{L}\p{N}._/-]*/gu)]
    .map(([reference]) => reference)
    .filter((reference) => parseResourceReference(reference)?.kind === 'icon'))]
  for (const reference of iconReferences) {
    const iconPath = resolveIcon(reference, record.from)
    const publicIconPath = await copyIcon(iconPath)
    markdownBody = markdownBody.replaceAll(reference, `/${publicIconPath}`)
  }
  markdown = `${frontmatterText}${markdownBody}`
  // VitePress recognizes `home` as its landing-page layout. Keep the richer
  // author-facing layout name in `pageLayout`, and lower it to `home` for the
  // renderer so the topbar subheader can be composed independently.
  markdown = markdown.replace(/^(layout:\s*)(["']?)home-subheader\2\s*$/m, '$1home\npageLayout: home-subheader')
  const owningCollection = collections.find((collection) => record.from.startsWith(`${collection.sourceDirectory}${sep}`))
  if (owningCollection) {
    const collectionSourcePath = relative(owningCollection.sourceDirectory, record.from).split(sep).join('/')
    const isCollectionIndex = /^index(?:\.[a-z]{2,3}(?:-[A-Z]{2})?)?\.md$/i.test(collectionSourcePath)
    const metadata = markdown.match(/^---\s*\n([\s\S]*?)\n---/)
    if (metadata) {
      const frontmatter = metadata[1].split('\n').filter((line) => !/^(?:sidebar|aside):\s*/.test(line))
      if (isCollectionIndex) {
        if (!/^collectionIndex:\s*/m.test(metadata[1])) frontmatter.push(`collectionIndex: ${JSON.stringify(owningCollection.id)}`)
      } else if (!/^collection:\s*/m.test(metadata[1])) {
        frontmatter.push(`collection: ${JSON.stringify(owningCollection.id)}`)
      }
      if (owningCollection.layout === 'article' && !isCollectionIndex) {
        const { wordCount, readingTime } = readingMetrics(markdown)
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
  await writeStagedMarkdownIfChanged(record.to, markdown)
}))
  return { diagramsCached, diagramsRendered }
}
