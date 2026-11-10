import { getActiveLanguages, getDefaultLanguage } from '../settings/static/i18n';
import type { I18nMessages } from '../translations';

function listKeys(messages: I18nMessages): Set<string> {
  const keys = new Set<string>();
  for (const locale of Object.keys(messages)) {
    for (const key of Object.keys(messages[locale] || {})) {
      keys.add(key);
    }
  }
  return keys;
}

export function normalizeMessages(
  messages: I18nMessages,
  locales: string[] = getActiveLanguages() as string[],
  fallback: string = getDefaultLanguage()
): I18nMessages {
  const out: I18nMessages = {};
  const keys = listKeys(messages);

  for (const locale of locales) {
    out[locale] = { ...(messages[locale] || {}) };
    for (const key of keys) {
      if (out[locale][key]) continue;
      const fromFallback = messages[fallback]?.[key];
      if (fromFallback) {
        out[locale][key] = fromFallback;
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[i18n] Missing "${key}" for locale "${locale}", using "${fallback}".`);
        }
      }
    }
  }

  if (!out[fallback]) {
    out[fallback] = { ...(messages[fallback] || {}) };
  }

  return out;
}

export function translateKey(
  messages: I18nMessages,
  locale: string,
  fallback: string,
  key: string,
  fallbackText?: string
): string {
  return messages?.[locale]?.[key] || messages?.[fallback]?.[key] || fallbackText || key;
}
