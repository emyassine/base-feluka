import { getActiveLanguages, getLocaleMeta, getLocaleLink } from '../i18n';

export function buildLocales() {
  return Object.fromEntries(
    getActiveLanguages().map(locale => [
      locale,
      { 
        ...getLocaleMeta(locale), 
        link: getLocaleLink(locale) 
      }
    ])
  );
}
