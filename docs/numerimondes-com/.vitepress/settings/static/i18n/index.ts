export const I18N_CONFIG = {
  locales: ['en', 'fr'] as const,
  defaultLocale: 'en' as const,
  meta: {
    en: { label: 'English', lang: 'en-US' },
    fr: { label: 'Français', lang: 'fr-FR' },
  },
};

export type Locale = (typeof I18N_CONFIG.locales)[number];

export function getActiveLanguages(): Locale[] {
  return [...I18N_CONFIG.locales];
}

export function getDefaultLanguage(): Locale {
  return I18N_CONFIG.defaultLocale;
}

// Aliases for consistency in builders.
export function getLocales(): Locale[] {
  return getActiveLanguages();
}

export function getDefaultLocale(): Locale {
  return getDefaultLanguage();
}

export function getLocaleMeta(locale: Locale) {
  return I18N_CONFIG.meta[locale];
}

export function getLocaleLink(locale: Locale) {
  return `/${locale}/`;
}

export function isValidLocale(candidate: string): candidate is Locale {
  return I18N_CONFIG.locales.includes(candidate as Locale);
}
