import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const siteDirectory = dirname(fileURLToPath(import.meta.url))
const config = JSON.parse(await readFile(join(siteDirectory, 'config-vitepress-site.json'), 'utf8'))
const outputDirectory = join(siteDirectory, '.generated-guides')
const records = []
const routeMap = new Map()
const cleanDir = (s) => s.replace(/^\d+-/, '')
const cleanFile = (s) => s.replace(/^\d+[-.]/, '').replace(/\.[a-z]{2,3}\.md$/i, '.md')

async function scan(sourceRoot, outputRoot, sourcePath = sourceRoot, outputPath = outputRoot) {
  for (const entry of await readdir(sourcePath, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'README.md') continue
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
const configuredIndex = resolve(siteDirectory, config.indexPath)
if (!routeMap.has(configuredIndex) || routeMap.get(configuredIndex) !== join(outputDirectory, 'index.md')) {
  throw new Error(`indexPath must point to the guides root index, which is compiled to index.md: ${config.indexPath}`)
}
for (const record of records) {
  let markdown = await readFile(record.from, 'utf8')
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

