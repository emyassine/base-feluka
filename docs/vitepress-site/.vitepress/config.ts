import { readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const siteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const configDirectory = resolve(siteDirectory, '../guides')
const siteConfig = JSON.parse(readFileSync(join(configDirectory, 'vitepress.site.config.json'), 'utf8'))
const site = siteConfig
const generatedDirectory = join(siteDirectory, '.generated-guides')
const sourceDirectory = resolve(configDirectory, site.guidesPath)
const outputDirectory = resolve(configDirectory, site.outputDir)
const guideConfigs = Object.fromEntries(site.subguides.map((guide: { path: string }) => {
  const configPath = resolve(sourceDirectory, guide.path, 'vitepress.config.json')
  return [guide.path, { path: configPath, config: JSON.parse(readFileSync(configPath, 'utf8')) }]
}))
const assetMime = (assetPath: string) => ({
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
}[extname(assetPath).toLowerCase()] ?? 'application/octet-stream')
function assetDataUri(configPath: string, assetPath: string): string {
  if (/^(?:https?:|data:)/i.test(assetPath)) return assetPath
  const resolvedAsset = resolve(dirname(configPath), assetPath)
  const data = readFileSync(resolvedAsset).toString('base64')
  return `data:${assetMime(resolvedAsset)};base64,${data}`
}
const primaryGuide = site.subguides[0]
const primaryGuideConfig = guideConfigs[primaryGuide.path]
const primaryConfig = primaryGuideConfig.config

function titleOf(file: string): string {
  const source = readFileSync(file, 'utf8')
  return source.match(/^sidebarTitle:\s*["']?(.+?)["']?\s*$/m)?.[1]
    ?? source.match(/^navTitle:\s*["']?(.+?)["']?\s*$/m)?.[1]
    ?? source.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1]
    ?? source.match(/^#\s+(.+)$/m)?.[1]
    ?? relative(generatedDirectory, file).split(sep).pop()!.replace(/^\d+[-.]/, '').replace(/\.md$/, '').replace(/[-_]/g, ' ')
}

function orderKey(name: string): [number, string] {
  const match = name.match(/^(\d+)[.-]/)
  return [match ? Number(match[1]) : Number.MAX_SAFE_INTEGER, name]
}

function ordered<T extends { name: string }>(entries: T[]): T[] {
  return entries.sort((a, b) => {
    const [an, as] = orderKey(a.name), [bn, bs] = orderKey(b.name)
    return an - bn || as.localeCompare(bs)
  })
}

function sidebar(directory: string, root = directory): any[] {
  return ordered(readdirSync(directory, { withFileTypes: true })).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      const items = sidebar(path, root)
      return items.length ? [{ text: entry.name.replace(/^\d+[.-]/, '').replace(/[-_]/g, ' '), collapsed: true, items }] : []
    }
    if (!entry.name.endsWith('.md')) return []
    if (directory === root && entry.name === 'index.md') return []
    const clean = relative(generatedDirectory, path).replace(/\\/g, '/').replace(/\.md$/, '').replace(/\/index$/, '')
    const target = entry.name === 'index.md' ? `${relative(generatedDirectory, dirname(path)).replace(/\\/g, '/')}/index.html` : `${clean}.html`
    return [{ text: titleOf(path), link: `/${target.replace(/^\.\//, '')}` }]
  })
}

const nav = site.subguides.map((guide: { path: string; label: string }) => ({ text: guide.label, link: `/${guide.path}/index.html` }))
const sidebars = Object.fromEntries(site.subguides.map((guide: { path: string; label: string }) => {
  const directory = join(generatedDirectory, guide.path)
  return [`/${guide.path}/`, sidebar(directory)]
}))

export default defineConfig({
  title: siteConfig.site.name,
  srcDir: '.generated-guides',
  outDir: outputDirectory,
  cleanUrls: false,
  mpa: false,
  transformHead({ page }) {
    const guide = site.subguides.find((entry: { path: string }) => page.startsWith(`${entry.path}/`))
    if (!guide) return []
    const guideEntry = guideConfigs[guide.path]
    return [['link', { rel: 'icon', type: assetMime(guideEntry.config.favicon), href: assetDataUri(guideEntry.path, guideEntry.config.favicon) }]]
  },
  themeConfig: {
    nav,
    sidebar: sidebars,
    search: { provider: siteConfig.search.provider, options: {
      miniSearch: { searchOptions: siteConfig.search.miniSearch },
      locales: Object.fromEntries(Object.entries(siteConfig.search.labels).map(([lang, labels]: [string, any]) => [lang, { translations: {
        button: { buttonText: labels.buttonText, buttonAriaLabel: labels.buttonAriaLabel },
        modal: { displayDetails: labels.displayDetails, resetButtonTitle: labels.resetButtonTitle, backButtonTitle: labels.backButtonTitle, noResultsText: labels.noResultsText,
          footer: { selectText: labels.selectText, selectKeyAriaLabel: labels.selectKeyAriaLabel, navigateText: labels.navigateText, navigateUpKeyAriaLabel: labels.navigateUpKeyAriaLabel, navigateDownKeyAriaLabel: labels.navigateDownKeyAriaLabel, closeText: labels.closeText, closeKeyAriaLabel: labels.closeKeyAriaLabel } }
      } }])),
      _render: (source: string, env: { relativePath: string; frontmatter?: { search?: boolean } }, markdown: { render: (source: string, env: unknown) => string }) => {
        const html = markdown.render(source, env)
        const excluded = (siteConfig.search.excludePaths ?? []).some((path: string) => env.relativePath.startsWith(path))
        return env.frontmatter?.search === false || excluded ? '' : html
      },
    } },
    outline: { label: siteConfig.outline.labels.en, level: siteConfig.outline.level },
    aside: true,
    footer: siteConfig.footer?.en,
    logo: {
      light: assetDataUri(primaryGuideConfig.path, primaryConfig.logo.light),
      dark: assetDataUri(primaryGuideConfig.path, primaryConfig.logo.dark),
      alt: primaryConfig.logo.alt,
    },
    siteTitle: primaryConfig.showSiteTitle ? primaryConfig.title : false,
  },
})
