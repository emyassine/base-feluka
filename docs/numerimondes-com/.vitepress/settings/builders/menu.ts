import fs from 'node:fs';
import path from 'node:path';
import { getActiveLanguages, type Locale } from '../static/i18n';
import type { CmsCache } from '../generated/cms';
import { MENU, type MenuItem, type MenuLocaleMap } from '../../menu';

type MenuMap = Record<Locale, any[]>;

const pickLocaleValue = (map: MenuLocaleMap | undefined, locale: string): string => {
  if (!map) return '';
  return map[locale] || map.en || map.fr || Object.values(map)[0] || '';
};

const normalizePath = (value: string): string => value.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/g, '');

const resolveLinkFromRef = (cache: CmsCache, locale: string, ref?: { fromPath: string }): string => {
  if (!ref?.fromPath) return '';
  const fromPath = normalizePath(ref.fromPath);
  if (!fromPath) return '';

  if (fromPath.endsWith('.md')) {
    const id = cache?.indexes?.bySourcePath?.[fromPath];
    const page = id ? cache?.pages?.[id] : null;
    return page?.i18n?.[locale]?.url || page?.i18n?.[locale]?.href || '';
  }

  const pages = cache?.pages || {};
  for (const page of Object.values(pages)) {
    const src = (page as any)?.source;
    if (!src?.isIndex) continue;
    const dir = normalizePath(src?.dir || '');
    const pathDir = normalizePath(src?.pathDir || '');
    if (dir === fromPath || pathDir === fromPath) {
      const entry = (page as any)?.i18n?.[locale];
      if (entry?.url || entry?.href) return entry.url || entry.href;
    }
  }

  const byDir = cache?.indexes?.byDir?.[fromPath] || [];
  for (const id of byDir) {
    const page = cache?.pages?.[id];
    if (page?.source?.isIndex || page?.slug === '') {
      return page?.i18n?.[locale]?.url || page?.i18n?.[locale]?.href || '';
    }
  }

  return '';
};

const toNavItem = (item: MenuItem, locale: string, cache: CmsCache): any => {
  const text = pickLocaleValue(item.label, locale);
  const link = item.link
    ? pickLocaleValue(item.link, locale)
    : item.ref
      ? resolveLinkFromRef(cache, locale, item.ref)
      : undefined;

  const children = item.items?.map(child => toNavItem(child, locale, cache)).filter(Boolean);

  if (children && children.length) return { text, items: children };
  if (link) return { text, link };
  return null;
};

export function buildMenu(): MenuMap {
  const cachePath = path.join(process.cwd(), '.vitepress', 'cache', 'gen', 'cms-cache.json');
  const cache = (fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {}) as CmsCache;
  const locales = (cache?.meta?.locales ?? getActiveLanguages()) as string[];
  const out = {} as MenuMap;
  for (const locale of locales) {
    out[locale as Locale] = MENU.map(item => toNavItem(item, locale, cache)).filter(Boolean);
  }
  return out;
}
