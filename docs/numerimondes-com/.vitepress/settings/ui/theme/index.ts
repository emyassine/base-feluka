import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import DocLayout from './DocLayout.vue';
import { installCmsGlobals } from '../../generated/cms';
import { getActiveLanguages, getDefaultLanguage, isValidLocale } from '../../static/i18n';
import { loadAllAssets } from '../assets';
import { registerGlobalComponents } from '../components';
import type { CmsCache } from '../../generated/cms';

const cacheModules = import.meta.glob('../../../cache/gen/cms-cache.json', { eager: true });
const cacheData = (Object.values(cacheModules)[0] as { default?: CmsCache } | undefined)?.default as CmsCache;

function getCurrentLocale(): string {
  if (typeof window === 'undefined') return getDefaultLanguage();

  const parts = window.location.pathname.split('/').filter(Boolean);
  const candidate = parts[0];

  return isValidLocale(candidate) ? candidate : getDefaultLanguage();
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DocLayout, null, {});
  },
  setup() {
    useData();

    // Automatic locale redirect disabled.
  },
  enhanceApp({ app }) {
    void loadAllAssets();
    registerGlobalComponents(app);
    installCmsGlobals(app, cacheData);
  },
} satisfies Theme;
