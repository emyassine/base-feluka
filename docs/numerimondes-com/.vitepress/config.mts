import { defineConfig } from 'vitepress';
import { getDefaultLanguage, getLocaleMeta, type Locale } from './settings/static/i18n';
import { buildLocales } from './settings/static/locales';
import { buildMenu } from './settings/builders/menu';
import { buildSidebar } from './settings/builders/sidebar';
import { redirectRoot } from './plugins/http/middleware';
import fs from 'node:fs';
import path from 'node:path';
import { metaBuildGenerate, runGenerators } from './plugins/build/meta-build';
import { htmlHooksPlugin } from './plugins/hooks/html-hooks';
import { buildFooterLinks } from './settings/builders/footer-links';
import { I18N_MESSAGES } from './translations';
import { normalizeMessages } from './utils/i18n';
import { canWrap } from './utils/branding';

function loadDotEnv(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadDotEnv(path.resolve('.env'));

runGenerators();
const deadLinksFlag = path.resolve('.vitepress/cache/gen/dead-links-ignore.json');
const ignoreDeadLinks = fs.existsSync(deadLinksFlag);

const navigation = buildMenu() as Record<Locale, any>;
const sidebars = buildSidebar() as Record<Locale, any>;
const defaultLocale = getDefaultLanguage();
const defaultNav = navigation[defaultLocale];
const defaultSidebar = sidebars[defaultLocale];
const footerLinks = buildFooterLinks();
const i18nMessages = normalizeMessages(I18N_MESSAGES);

const baseLocales = buildLocales() as Record<Locale, any>;
const localesWithThemeConfig = Object.fromEntries(
  Object.entries(baseLocales).map(([locale, meta]) => [
    locale,
    {
      ...meta,
      themeConfig: {
        nav: navigation[locale as Locale],
        sidebar: sidebars[locale as Locale],
        footer: false,
        footerLinks,
        i18nMessages,
        siteTitleParts: canWrap('Numerimondes', ['Numeri', 'mondes']),
      },
    },
  ])
);

const baseEnv = process.env.BASE ?? '/';
const base = baseEnv.endsWith('/') ? baseEnv : `${baseEnv}/`;

export default defineConfig({
  srcDir: '.vitepress/cache/gen/i18n',
  base,
  lang: getLocaleMeta(getDefaultLanguage()).lang,
  vite: {
    plugins: [redirectRoot(getDefaultLanguage()), metaBuildGenerate(), htmlHooksPlugin()],
    resolve: {
      alias: {
        'mark.js/src/vanilla.js': 'mark.js/dist/mark.es6.js',
        'mark.js/src/lib/mark': 'mark.js/src/lib/mark.js',
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
  },
  cleanUrls: true,
  ignoreDeadLinks,
  locales: localesWithThemeConfig,
  title: 'Numerimondes',
  description: 'A lightweight, extensible documentation platform for products and knowledge bases',
  themeConfig: {
    logo: '/numerimondes.png',
    nav: defaultNav,
    sidebar: defaultSidebar,
    footer: false,
    search: {
      provider: 'local',
    },
    defaultLocale: getDefaultLanguage(),
    footerLinks,
    i18nMessages,
    siteTitleParts: canWrap('Numerimondes', ['Numeri', 'mondes']),
    socialLinks: [{ icon: 'github', link: 'https://github.com/numerimondes' }],
  } as any,
});
