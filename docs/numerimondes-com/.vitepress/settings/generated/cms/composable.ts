import { useData } from 'vitepress';
import type { CmsCache, CmsQuery } from './types';
import { createCmsQuery } from './concerns/query-builder';

const cacheModules = import.meta.glob('../../cache/gen/cms-cache.json', { eager: true });
const cacheData = (Object.values(cacheModules)[0] as { default?: CmsCache } | undefined)?.default as CmsCache;

export function useCms(locale?: string): CmsQuery {
  const { lang } = useData();
  const resolved = locale || (lang.value || cacheData.meta.defaultLocale).split('-')[0];
  return createCmsQuery(cacheData, resolved);
}
