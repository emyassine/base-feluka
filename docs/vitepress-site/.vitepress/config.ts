import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const siteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const siteConfig = JSON.parse(readFileSync(join(siteDirectory, 'config-vitepress-site.json'), 'utf8'))
const generatedDirectory = join(siteDirectory, '.generated-guides')

function titleOf(file: string): string {
  const source = readFileSync(file, 'utf8')
  return source.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1]
    ?? source.match(/^#\s+(.+)$/m)?.[1]
    ?? relative(generatedDirectory, file).split(sep).pop()!.replace(/^\d+[-.]/, '').replace(/\.md$/, '').replace(/[-_]/g, ' ')
}

function sidebar(directory: string, root = directory): any[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      const items = sidebar(path, root)
      return items.length ? [{ text: entry.name.replace(/^\d+-/, '').replace(/[-_]/g, ' '), items }] : []
    }
    if (!entry.name.endsWith('.md')) return []
    const clean = relative(generatedDirectory, path).replace(/\\/g, '/').replace(/\.md$/, '').replace(/\/index$/, '')
    return [{ text: titleOf(path), link: `/${clean}` }]
  })
}

const nav = siteConfig.subguides.map((guide: { path: string; label: string }) => ({ text: guide.label, link: `/${guide.path}` }))
const items = siteConfig.subguides.flatMap((guide: { path: string; label: string }) => {
  const directory = join(generatedDirectory, guide.path)
  return [{ text: guide.label, items: sidebar(directory) }]
})

export default defineConfig({
  title: siteConfig.siteName,
  srcDir: '.generated-guides',
  outDir: resolve(siteDirectory, siteConfig.outputDir),
  cleanUrls: true,
  themeConfig: { nav, sidebar: items },
})
