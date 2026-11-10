import { /**getActiveLanguages, **/ getDefaultLanguage, isValidLocale, type Locale } from '../settings/static/i18n';

export function parseGroup(dirName: string): {
  group: string;
  orderGroup: number;
} {
  const match = dirName.match(/^(\d+)-(.*)$/);

  if (!match) {
    return { group: dirName, orderGroup: 9999 };
  }

  return {
    group: match[2],
    orderGroup: Number(match[1]),
  };
}

export function parseFileName(fileName: string): {
  locale: Locale;
  orderPage: number;
  slug: string;
} {
  const localeMatch = fileName.match(/-([a-z]{2})\.md$/);
  const candidate = localeMatch ? localeMatch[1] : null;
  const locale: Locale = candidate && isValidLocale(candidate) ? candidate : getDefaultLanguage();

  const base = fileName.replace(/\.md$/, '');
  const withoutLocale = base.replace(/-[a-z]{2}$/, '');

  if (withoutLocale === 'index') {
    return { locale, orderPage: 0, slug: '' };
  }

  const match = withoutLocale.match(/^(\d+)-(.*)$/);

  if (!match) {
    return { locale, orderPage: 9999, slug: withoutLocale };
  }

  return {
    locale,
    orderPage: Number(match[1]),
    slug: match[2],
  };
}

export function buildUrl(locale: string, group: string, slug: string): string {
  const base = `/${locale}/guides/${group}`;
  // The index URL in the sidebar may be
  // missing a trailing slash (`/en/guides/foundations`)
  // while the current page is `/en/guides/foundations/`
  // VitePress does not consider them identical.
  // We generate URLs for indexes to add the trailing slash.
  return slug ? `${base}/${slug}` : `${base}/`;
}

export function buildDocUrl(locale: string, relDir: string, slug: string): string {
  const base = relDir ? `/${locale}/${relDir}` : `/${locale}`;
  return slug ? `${base}/${slug}` : `${base}/`;
}
