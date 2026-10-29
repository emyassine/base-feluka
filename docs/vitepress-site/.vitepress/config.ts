import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const siteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const siteConfig = JSON.parse(readFileSync(join(siteDirectory, 'config-vitepress-site.json'), 'utf8'))
const generatedDirectory = join(siteDirectory, '.generated-guides')
const guideConfigs = Object.fromEntries(siteConfig.subguides.map((guide: { path: string }) => {
  const configPath = resolve(siteDirectory, siteConfig.guidesPath, guide.path, 'vitepress.config.json')
  return [guide.path, JSON.parse(readFileSync(configPath, 'utf8'))]
}))
const assetUrl = (guidePath: string, asset: string) => `/${guidePath}/.art/${asset.split('/').pop()}`
const primaryGuide = siteConfig.subguides[0]
const primaryConfig = guideConfigs[primaryGuide.path]

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
      return items.length ? [{ text: entry.name.replace(/^\d+-/, '').replace(/[-_]/g, ' '), collapsed: true, items }] : []
    }
    if (!entry.name.endsWith('.md')) return []
    if (directory === root && entry.name === 'index.md') return []
    const clean = relative(generatedDirectory, path).replace(/\\/g, '/').replace(/\.md$/, '').replace(/\/index$/, '')
    const target = entry.name === 'index.md' ? `${relative(generatedDirectory, dirname(path)).replace(/\\/g, '/')}/index.html` : `${clean}.html`
    return [{ text: titleOf(path), link: `/${target.replace(/^\.\//, '')}` }]
  })
}

const nav = siteConfig.subguides.map((guide: { path: string; label: string }) => ({ text: guide.label, link: `/${guide.path}/index.html` }))
const sidebars = Object.fromEntries(siteConfig.subguides.map((guide: { path: string; label: string }) => {
  const directory = join(generatedDirectory, guide.path)
  return [`/${guide.path}/`, sidebar(directory)]
}))

export default defineConfig({
  title: siteConfig.siteName,
  srcDir: '.generated-guides',
  outDir: resolve(siteDirectory, siteConfig.outputDir),
  cleanUrls: false,
  mpa: true,
  transformHead({ page }) {
    const guide = siteConfig.subguides.find((entry: { path: string }) => page.startsWith(`${entry.path}/`))
    if (!guide) return []
    const pageConfig = guideConfigs[guide.path]
    return [['link', { rel: 'icon', type: 'image/png', href: assetUrl(guide.path, pageConfig.favicon) }]]
  },
  themeConfig: {
    nav,
    sidebar: sidebars,
    outline: { label: 'On this page', level: 'deep' },
    aside: true,
    logo: {
      light: assetUrl(primaryGuide.path, primaryConfig.logo.light),
      dark: assetUrl(primaryGuide.path, primaryConfig.logo.dark),
      alt: primaryConfig.logo.alt,
    },
    siteTitle: primaryConfig.showSiteTitle ? primaryConfig.title : false,
  },
})
