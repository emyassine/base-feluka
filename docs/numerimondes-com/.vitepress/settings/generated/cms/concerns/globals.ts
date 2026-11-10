import type { App } from 'vue';
import type { CmsCache, CmsQuery } from '../types';
import { createCmsQuery } from './query-builder';

export function installCmsGlobals(app: App, cache: CmsCache): void {
  const defaultLocale = cache.meta.defaultLocale;

  const useCms = (locale?: string): CmsQuery => createCmsQuery(cache, locale || defaultLocale);
  const cmsQuery = (locale?: string): CmsQuery => createCmsQuery(cache, locale || defaultLocale);
  const getLocales = (): string[] => [...(cache?.meta?.locales || [])];
  const getDefaultLocale = (): string => cache?.meta?.defaultLocale || defaultLocale;

  app.config.globalProperties.$cms = cache;
  app.config.globalProperties.useCms = useCms;
  app.config.globalProperties.$cmsQuery = cmsQuery;
  app.config.globalProperties.getLocales = getLocales;
  app.config.globalProperties.getDefaultLocale = getDefaultLocale;
  (globalThis as any).$cms = cache;
  (globalThis as any).useCms = useCms;
  (globalThis as any).$cmsQuery = cmsQuery;
  (globalThis as any).getLocales = getLocales;
  (globalThis as any).getDefaultLocale = getDefaultLocale;
}
