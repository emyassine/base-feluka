import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile as execFileCallback } from 'node:child_process'
import { createHash } from 'node:crypto'
import { promisify } from 'node:util'

const siteDirectory = dirname(fileURLToPath(import.meta.url))
const config = JSON.parse(await readFile(join(siteDirectory, 'config-vitepress-site.json'), 'utf8'))
const outputDirectory = join(siteDirectory, '.generated-guides')
const records = []
const routeMap = new Map()
const cleanDir = (s) => s.replace(/^\d+-/, '')
const cleanFile = (s) => s.replace(/^\d+[-.]/, '').replace(/\.[a-z]{2,3}\.md$/i, '.md')
const execFile = promisify(execFileCallback)

async function scan(sourceRoot, outputRoot, sourcePath = sourceRoot, outputPath = outputRoot) {
  for (const entry of await readdir(sourcePath, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'README.md' || entry.name === 'vitepress.config.json') continue
    const from = join(sourcePath, entry.name)
    const to = join(outputPath, entry.isDirectory() ? cleanDir(entry.name) : cleanFile(entry.name))
    if (entry.isDirectory()) await scan(sourceRoot, outputRoot, from, to)
    else {
      await mkdir(dirname(to), { recursive: true })
      routeMap.set(resolve(from), to)
      if (extname(entry.name).toLowerCase() === '.md') records.push({ from, to, sourceRoot })
      else await cp(from, to)
    }
  }
}

await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })
const sourceRoot = resolve(siteDirectory, config.guidesPath)
await scan(sourceRoot, outputDirectory)
await mkdir(join(outputDirectory, 'public'), { recursive: true })
await cp(join(sourceRoot, 'feluqa-docs-hero.svg'), join(outputDirectory, 'public/feluqa-docs-hero.svg'))
for (const guide of config.subguides) {
  const guideRoot = resolve(sourceRoot, guide.path)
  const guideConfig = JSON.parse(await readFile(join(guideRoot, 'vitepress.config.json'), 'utf8'))
  for (const asset of [guideConfig.logo.light, guideConfig.logo.dark, guideConfig.favicon]) {
    const assetSource = resolve(guideRoot, asset)
    const assetName = asset.split('/').pop()
    const assetOutput = join(outputDirectory, 'public', guide.path, '.art', assetName)
    await mkdir(dirname(assetOutput), { recursive: true })
    await cp(assetSource, assetOutput)
  }
}
const configuredIndex = resolve(siteDirectory, config.indexPath)
if (!routeMap.has(configuredIndex) || routeMap.get(configuredIndex) !== join(outputDirectory, 'index.md')) {
  throw new Error(`indexPath must point to the guides root index, which is compiled to index.md: ${config.indexPath}`)
}
for (const record of records) {
  let markdown = await readFile(record.from, 'utf8')
  const mermaidBlocks = [...markdown.matchAll(/^```mermaid\s*\n([\s\S]*?)\n```\s*$/gm)]
  for (const block of mermaidBlocks.reverse()) {
    const diagram = block[1]
    const id = createHash('sha256').update(diagram).digest('hex').slice(0, 16)
    const source = join(outputDirectory, `.mermaid-${id}.mmd`)
    const svg = join(outputDirectory, 'public', 'mermaid', `${id}.svg`)
    await mkdir(dirname(svg), { recursive: true })
    await writeFile(source, diagram)
    await execFile(join(siteDirectory, 'node_modules/.bin/mmdc'), ['-i', source, '-o', svg, '-b', 'transparent', '-q'])
    markdown = `${markdown.slice(0, block.index)}![Mermaid diagram](/mermaid/${id}.svg)${markdown.slice(block.index + block[0].length)}`
  }
  markdown = markdown.replace(/(!?\[[^\]]*\]\()([^\s)]+)(\))/g, (all, before, href, after) => {
    if (/^(?:[a-z]+:|\/|#)/i.test(href)) return all
    const [path, ...suffix] = href.split(/(?=[?#])/)
    const sourceFile = resolve(dirname(record.from), path)
    const outputTarget = routeMap.get(sourceFile) ?? routeMap.get(`${sourceFile}.md`)
    if (!outputTarget) return all
    let target = relative(dirname(record.to), outputTarget).split(sep).join('/')
    if (target.endsWith('.md')) target = target.slice(0, -3)
    if (!target.startsWith('.')) target = `./${target}`
    return `${before}${target}${suffix.join('')}${after}`
  })
  await writeFile(record.to, markdown)
}

