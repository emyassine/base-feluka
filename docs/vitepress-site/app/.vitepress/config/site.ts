import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import markdownItContainer from 'markdown-it-container'
import jiti from 'jiti'
import { createNavigation } from './navigation'
import { createTransformHead } from './head'
import { loadSiteRuntimeContext, type SiteConfigSource } from './context'
import { nodeConfigSource } from './node-config-source'
import { resolveSitePaths } from '../../scripts/paths.mjs'
import type { DocumentationSeoOptions } from '../types/site-config'

/** Dependencies selected by the VitePress composition root. */
export interface SiteConfigCompositionDependencies {
  siteDirectory: string
  configSource: SiteConfigSource
  navigationFactory: typeof createNavigation
  headFactory: typeof createTransformHead
  seoHeadTransform: (options: DocumentationSeoOptions) => unknown[][]
}

const sitePaths = resolveSitePaths(resolve(dirname(fileURLToPath(import.meta.url)), '../..'))
const loadSiteModule = jiti(import.meta.url, { moduleCache: false })
const { transformDocumentationHead } = loadSiteModule(join(sitePaths.generatedMetadata, 'hooks.ts')) as {
  transformDocumentationHead: (options: DocumentationSeoOptions) => unknown[][]
}

const siteThemeInitScript = String.raw`(() => {
  const root = document.documentElement;
  const choices = ['system', 'light', 'dark'];
  const appearanceKey = 'vitepress-theme-appearance';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = 'system';
  let scrollReadyFrame;

  const consentAllows = (category) => {
    if (category === 'necessary') return true;
    try {
      const entry = document.cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith('spmpst-consent='));
      if (!entry) return false;
      const saved = JSON.parse(decodeURIComponent(entry.slice('spmpst-consent='.length)));
      return saved && saved.version === 1 && saved[category] === true;
    } catch (_) { return false; }
  };
  const categoryForStorageKey = (key) => ({
    'vitepress-theme-appearance': 'necessary',
    'spmpst-currency': 'necessary',
    'nm-marketplace-currency': 'necessary',
    'nm-brief': 'necessary',
    'nm-reviews': 'necessary',
  })[key] || 'other';
  const isSiteStorage = (storage) => {
    try { return storage === window.localStorage || storage === window.sessionStorage; }
    catch (_) { return false; }
  };
  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.getItem = function (key) {
    if (isSiteStorage(this) && !consentAllows(categoryForStorageKey(String(key)))) return null;
    return originalGetItem.call(this, key);
  };
  Storage.prototype.setItem = function (key, value) {
    if (isSiteStorage(this) && !consentAllows(categoryForStorageKey(String(key)))) return;
    return originalSetItem.call(this, key, value);
  };
  const cookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
  if (cookieDescriptor && cookieDescriptor.configurable && cookieDescriptor.get && cookieDescriptor.set) {
    Object.defineProperty(Document.prototype, 'cookie', {
      configurable: true,
      enumerable: cookieDescriptor.enumerable,
      get() { return cookieDescriptor.get.call(this); },
      set(value) {
        const assignment = String(value);
        const name = assignment.split('=', 1)[0].trim();
        const deleting = /(?:^|;)\s*max-age\s*=\s*0(?:;|$)/i.test(assignment);
        if (name !== 'spmpst-consent' && !deleting && !consentAllows('other')) return;
        return cookieDescriptor.set.call(this, assignment);
      },
    });
  }

  const readPreference = () => {
    if (!consentAllows('necessary')) return;
    try {
      const saved = localStorage.getItem(appearanceKey);
      preference = choices.includes(saved) ? saved : 'system';
    } catch (_) {
      preference = 'system';
    }
  };

  const apply = () => {
    const theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.themePreference = preference;
    root.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0d1117' : '#fcfdfd';
    document.dispatchEvent(new CustomEvent('numerimondes:theme', { detail: { preference, theme } }));
  };

  const syncFromVitePress = () => {
    readPreference();
    apply();
  };

  root.classList.add('has-mobile-sidebar');
  window.addEventListener('pageshow', () => {
    scrollReadyFrame = requestAnimationFrame(() => root.classList.add('scroll-ready'));
    syncFromVitePress();
  });
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(scrollReadyFrame);
    root.classList.remove('scroll-ready');
  });
  window.NumerimondesTheme = {
    get: () => preference,
    set: (next) => {
      if (!choices.includes(next)) return;
      preference = next;
      try {
        if (next === 'system') localStorage.removeItem(appearanceKey);
        else localStorage.setItem(appearanceKey, next);
      } catch (_) {}
      apply();
    },
  };

  new MutationObserver(syncFromVitePress).observe(root, { attributes: true, attributeFilter: ['class'] });
  media.addEventListener('change', () => { if (preference === 'system') apply(); });
  window.addEventListener('spmpst-storage-consent-change', syncFromVitePress);
  document.addEventListener('DOMContentLoaded', syncFromVitePress, { once: true });
  syncFromVitePress();
})();`

/** Assemble VitePress from independently constructed data, navigation, and head providers. */
export function composeVitePressConfig(dependencies: SiteConfigCompositionDependencies) {
  const { siteDirectory, configSource, navigationFactory, headFactory, seoHeadTransform } = dependencies
  const context = loadSiteRuntimeContext(siteDirectory, configSource)
  const cacheDirectory = resolveSitePaths(siteDirectory).vitepressCache
  const {
    siteConfig, site, generatedDirectory, sidebarMetadata, sidebarPageIcons,
    navigationOrder, generatedCollections, generatedFonts, generatedGuideColors,
    generatedOgImages, defaultLanguage, outputDirectory, guideConfigs,
  } = context
  const menuTemplateManifest = configSource.readJsonOr<{ menuTemplateComponent?: string | null }>(
    join(context.generatedMetadata, 'menu-template.json'), {},
  )
  const menuTemplateComponent = menuTemplateManifest.menuTemplateComponent ?? undefined
  const navigationModel = navigationFactory({
    site, siteConfig, siteDirectory, defaultLanguage, generatedDirectory, sidebarMetadata,
    sidebarPageIcons, navigationOrder, generatedCollections, guideConfigs, menuTemplateComponent,
  })
  const {
    navigation, sidebars, localizedThemeConfig, vitepressLocales, routeBase,
    assetMime, assetDataUri, primaryGuide, primaryGuideConfig, primaryConfig,
    defaultSeoLocale,
  } = navigationModel
  const primaryGuideColorKey = primaryGuide.uri.base.replace(/^\/+|\/+$/g, '').split('/')[0] || 'root'
  const primaryGuideBrand = generatedGuideColors[primaryGuideColorKey] ?? generatedGuideColors[primaryGuide.path] ?? generatedGuideColors.root ?? {}
  const transformHead = headFactory({
    site, siteConfig, guideConfigs, defaultLanguage, defaultSeoLocale, primaryGuide,
    primaryGuideConfig, primaryConfig, generatedOgImages, generatedGuideColors,
    generatedFonts, routeBase, assetMime, assetDataUri,
    transformDocumentationHead: seoHeadTransform,
  })
  const generatedBuildTimestampPath = join(outputDirectory, '.spmpst', 'build-timestamp')
  const generatedBuildTimestamp = existsSync(generatedBuildTimestampPath) ? readFileSync(generatedBuildTimestampPath, 'utf8').trim() : new Date().toISOString()
  const pwaHead = siteConfig.pwa?.enabled ? [
    ['link', { rel: 'manifest', href: `${siteConfig.pwa.scope ?? '/'}manifest.webmanifest` }],
    ['link', { rel: 'apple-touch-icon', href: siteConfig.pwa.icons?.[0]?.src }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: siteConfig.pwa.shortName ?? siteConfig.pwa.name }],
    ['script', { id: 'spmpst-pwa-register' }, `if ('serviceWorker' in navigator && window.isSecureContext) { window.addEventListener('load', () => { navigator.serviceWorker.register(${JSON.stringify(`${siteConfig.pwa.scope ?? '/'}service-worker.js`)}, { scope: ${JSON.stringify(siteConfig.pwa.scope ?? '/')} }).catch(() => {}); }); }`],
  ] : []
  return defineConfig({
  title: siteConfig.site.name,
  lang: defaultLanguage,
  locales: vitepressLocales,
  appearance: ({ switch: true, system: 'force-auto', light: false, dark: 'force-dark' } as const)[siteConfig.topbar?.theme ?? 'switch'],
  head: [
    ['meta', { name: 'theme-color', content: siteConfig.pwa?.themeColor ?? '#fcfdfd' }],
    ['script', { id: 'site-theme-init' }, siteThemeInitScript],
    ['link', { rel: 'icon', type: assetMime(primaryConfig.favicon), href: assetDataUri(primaryGuideConfig.path, primaryConfig.favicon) }],
    ...pwaHead,
  ],
  srcDir: context.generatedDirectory,
  cacheDir: cacheDirectory,
  outDir: outputDirectory,
  cleanUrls: true,
  mpa: false,
  lastUpdated: true,
  ...(siteConfig.seo?.siteUrl
    ? { sitemap: { hostname: siteConfig.seo.siteUrl } }
    : {}),
  vite: { configFile: join(siteDirectory, 'config/vite.config.ts') },
  markdown: {
    ...siteConfig.markdown,
    config: (md) => {
      md.use(markdownItContainer, 'md-justify')
      md.use(markdownItContainer, 'md-lines')
    },
  },
  transformHtml: (html: string) => html.replace(
    /<html([^>]*)>/,
    `<html$1>\n<!------ @spmpst generated build at ${generatedBuildTimestamp} ------>`
  ),
  transformHead,

  themeConfig: {
    nav: navigation(),
    locales: localizedThemeConfig,
    langMenuLabel: siteConfig.languageMenuLabels?.[defaultLanguage],
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
    outline: { label: siteConfig.outline.labels[defaultLanguage], level: siteConfig.outline.level },
    aside: true,
    footer: siteConfig.footer?.[siteConfig.languages[0]] ?? siteConfig.footer?.root,
    logo: {
      light: primaryGuideBrand.logoLight ?? siteConfig.logo?.light,
      dark: primaryGuideBrand.logoDark ?? siteConfig.logo?.dark,
      alt: primaryGuideBrand.logoAlt ?? siteConfig.logo?.alt ?? siteConfig.site?.name ?? 'Documentation',
      ...(primaryGuideBrand.logoWidth ? { width: primaryGuideBrand.logoWidth } : {}),
      ...(primaryGuideBrand.logoHeight ? { height: primaryGuideBrand.logoHeight } : {}),
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
