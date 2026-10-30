import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { transformDocumentationHead } from '../generated/hooks'
import { createNavigation } from './navigation'
import { createTransformHead } from './head'
import { loadSiteRuntimeContext, type SiteConfigSource } from './context'
import { nodeConfigSource } from './node-config-source'
import type { DocumentationSeoOptions } from '../types/site-config'

/** Dependencies selected by the VitePress composition root. */
export interface SiteConfigCompositionDependencies {
  siteDirectory: string
  configSource: SiteConfigSource
  navigationFactory: typeof createNavigation
  headFactory: typeof createTransformHead
  seoHeadTransform: (options: DocumentationSeoOptions) => unknown[][]
}

/** Assemble VitePress from independently constructed data, navigation, and head providers. */
export function composeVitePressConfig(dependencies: SiteConfigCompositionDependencies) {
  const { siteDirectory, configSource, navigationFactory, headFactory, seoHeadTransform } = dependencies
  const context = loadSiteRuntimeContext(siteDirectory, configSource)
  const {
    siteConfig, site, generatedDirectory, sidebarMetadata, sidebarPageIcons,
    navigationOrder, generatedCollections, generatedFonts, generatedGuideColors,
    generatedOgImages, defaultLanguage, outputDirectory, guideConfigs,
  } = context
  const navigationModel = navigationFactory({
    site, siteConfig, siteDirectory, defaultLanguage, generatedDirectory, sidebarMetadata,
    sidebarPageIcons, navigationOrder, generatedCollections, guideConfigs,
  })
  const {
    navigation, sidebars, localizedThemeConfig, vitepressLocales, routeBase,
    assetMime, assetDataUri, primaryGuide, primaryGuideConfig, primaryConfig,
    defaultSeoLocale,
  } = navigationModel
  const transformHead = headFactory({
    site, siteConfig, guideConfigs, defaultLanguage, defaultSeoLocale, primaryGuide,
    primaryGuideConfig, primaryConfig, generatedOgImages, generatedGuideColors,
    generatedFonts, routeBase, assetMime, assetDataUri,
    transformDocumentationHead: seoHeadTransform,
  })
  return defineConfig({
  title: siteConfig.site.name,
  lang: defaultLanguage,
  locales: vitepressLocales,
  appearance: ({ switch: true, system: 'force-auto', light: false, dark: 'force-dark' } as const)[siteConfig.topbar?.theme ?? 'switch'],
  head: [['link', { rel: 'icon', type: assetMime(primaryConfig.favicon), href: assetDataUri(primaryGuideConfig.path, primaryConfig.favicon) }]],
  srcDir: '.generated-guides',
  outDir: outputDirectory,
  cleanUrls: true,
  mpa: false,
  vite: { configFile: join(siteDirectory, 'config/vite.config.ts') },
  markdown: siteConfig.markdown,
  transformHead,

  themeConfig: {
    nav: navigation(),
    locales: localizedThemeConfig,
    langMenuLabel: siteConfig.languageMenuLabels?.[defaultLanguage] ?? 'Change language',
    socialLinks: site.socialLinks ?? [],
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
    outline: { label: siteConfig.outline.labels[siteConfig.languages[0]] ?? siteConfig.outline.labels.root, level: siteConfig.outline.level },
    aside: true,
    footer: siteConfig.footer?.[siteConfig.languages[0]] ?? siteConfig.footer?.root,
    logo: {
      light: generatedGuideColors.root?.logoLight,
      dark: generatedGuideColors.root?.logoDark,
      alt: generatedGuideColors.root?.logoAlt ?? siteConfig.logo?.alt ?? siteConfig.site?.name ?? 'Documentation',
    },
    siteTitle: primaryConfig.showSiteTitle ? primaryConfig.title : false,
  },
  })
}

// This module is the sole composition root: production chooses Node-backed
// configuration and the generated SEO adapter, while feature modules receive ports.
const siteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
export default composeVitePressConfig({
  siteDirectory,
  configSource: nodeConfigSource,
  navigationFactory: createNavigation,
  headFactory: createTransformHead,
  seoHeadTransform: transformDocumentationHead,
})
