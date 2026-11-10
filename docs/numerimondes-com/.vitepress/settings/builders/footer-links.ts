import fs from 'node:fs';
import path from 'node:path';
import { getActiveLanguages, getDefaultLanguage } from '../static/i18n';
import type { CmsCache } from '../generated/cms';
import { FOOTER_LINKS, type FooterLink, type FooterLinksByLocale, type FooterLinkDef } from '../../footer-links';

type LocaleMap = Record<string, string>;

const normalizePath = (value: string): string => value.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/g, '');

const resolveLinkFromRef = (cache: CmsCache, locale: string, ref?: { fromPath: string }): string => {
  if (!ref?.fromPath) return '';
  const fromPath = normalizePath(ref.fromPath).replace(/^docs\//, '');
  if (!fromPath) return '';

  const mdPath = fromPath.endsWith('.md') ? fromPath : `${fromPath}.md`;
  if (mdPath.endsWith('.md')) {
    const id = cache?.indexes?.bySourcePath?.[mdPath];
    const page = id ? cache?.pages?.[id] : null;
    return page?.i18n?.[locale]?.url || page?.i18n?.[locale]?.href || '';
  }

  const pages = cache?.pages || {};
  const exactCandidates = [`${fromPath}-${locale}.md`, `${fromPath}.md`];
  for (const page of Object.values(pages)) {
    const src = (page as any)?.source;
    const byLocale = src?.sourcePathByLocale || {};
    const candidate = byLocale?.[locale];
    if (candidate && exactCandidates.includes(candidate)) {
      const entry = (page as any)?.i18n?.[locale];
      return entry?.url || entry?.href || '';
    }
  }

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

const pickLocaleValue = (map: LocaleMap | undefined, locale: string, fallback: string): string => {
  if (!map) return '';
  return map[locale] || map[fallback] || map.en || map.fr || Object.values(map)[0] || '';
};

const fileExists = (relativePath: string): boolean => {
  const normalized = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
  const full = path.join(process.cwd(), 'docs', normalized);
  return fs.existsSync(full);
};

const buildLocalePath = (locale: string, fromPath: string, isIndex: boolean): string => {
  const trimmed = fromPath.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!trimmed) return `/${locale}/`;
  return isIndex ? `/${locale}/${trimmed}/` : `/${locale}/${trimmed}`;
};

function resolveFooterLink(cache: CmsCache, locale: string, fallback: string, item: FooterLinkDef): FooterLink | null {
  if (item.items?.length) {
    const children = item.items
      .map(child => resolveFooterLink(cache, locale, fallback, child))
      .filter(Boolean)
      .map(child => child as FooterLink);
    if (!children.length) return null;
    return {
      key: item.key,
      link: '',
      external: item.external,
      group: item.group,
      items: children,
    };
  }

  const fromPath = item.ref?.fromPath ? item.ref.fromPath.replace(/^docs\//, '').replace(/\/+$/, '') : '';
  let refLink = item.ref ? resolveLinkFromRef(cache, locale, item.ref) : '';
  if (!refLink && fromPath) {
    const hasLocaleFile = fileExists(`${fromPath}-${locale}.md`) || fileExists(`${fromPath}.md`);
    const hasIndexFile = fileExists(`${fromPath}/index-${locale}.md`) || fileExists(`${fromPath}/index.md`);
    if (hasLocaleFile || hasIndexFile) {
      refLink = buildLocalePath(locale, fromPath, hasIndexFile);
    }
  }
  const link = refLink || pickLocaleValue(item.link, locale, fallback);
  return link
    ? {
        key: item.key,
        link,
        external: item.external,
        group: item.group,
      }
    : null;
}

export function buildFooterLinks(): FooterLinksByLocale {
  const cachePath = path.join(process.cwd(), '.vitepress', 'cache', 'gen', 'cms-cache.json');
  const cache = (fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {}) as CmsCache;
  const locales = (cache?.meta?.locales ?? getActiveLanguages()) as string[];
  const fallback = getDefaultLanguage();
  const out: FooterLinksByLocale = {};

  for (const locale of locales) {
    out[locale] = FOOTER_LINKS.map(item => resolveFooterLink(cache, locale, fallback, item))
      .filter(Boolean)
      .map(item => item as FooterLink);
  }

  if (!out[fallback]) {
    out[fallback] = FOOTER_LINKS.map(item => resolveFooterLink(cache, fallback, fallback, item))
      .filter(Boolean)
      .map(item => item as FooterLink);
  }

  return out;
}
