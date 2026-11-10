export type LocaleDisplay = {
  locale: string;
  language: string;
  country?: string;
  label: string;
};

function parseLocaleParts(value: string): { language: string; region?: string } {
  const normalized = value.replace('_', '-');
  const [language, region] = normalized.split('-');
  return { language: language || '', region };
}

function getDisplayName(type: 'language' | 'region', code: string, uiLocale: string): string {
  if (!code) return '';
  if (typeof Intl === 'undefined' || typeof (Intl as any).DisplayNames === 'undefined') {
    return type === 'region' ? code.toUpperCase() : code.toLowerCase();
  }
  const display = new Intl.DisplayNames([uiLocale], { type });
  return display.of(code) || code;
}

export function getRuntimeRegionHint(): string | undefined {
  if (typeof globalThis === 'undefined') return undefined;
  const geo = (globalThis as any).__NDS_GEO__ || (globalThis as any).__GEO__ || null;
  if (!geo || typeof geo !== 'object') return undefined;
  const code = geo.region || geo.country || geo.countryCode;
  if (typeof code !== 'string') return undefined;
  const normalized = code.replace('_', '-').trim();
  if (!normalized) return undefined;
  return normalized;
}

export function formatLocaleDisplay(options: {
  locale: string;
  uiLocale?: string;
  regionHint?: string;
}): LocaleDisplay {
  const fallbackLocale = options.locale || 'en';
  const parts = parseLocaleParts(fallbackLocale);
  const uiLocale = options.uiLocale || parts.language || fallbackLocale;
  const languageLabel = getDisplayName('language', parts.language || fallbackLocale, uiLocale);
  const regionCode = options.regionHint || parts.region;
  const countryLabel = regionCode ? getDisplayName('region', regionCode, uiLocale) : '';
  const label = countryLabel ? `${countryLabel} · ${languageLabel}` : languageLabel;

  return {
    locale: fallbackLocale,
    language: languageLabel,
    country: countryLabel || undefined,
    label,
  };
}
