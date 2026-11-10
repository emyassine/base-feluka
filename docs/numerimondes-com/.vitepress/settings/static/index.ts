import { getActiveLanguages, getDefaultLanguage, type Locale } from './i18n';

type NavItem = {
  key: string;
  text: Record<string, string>;
  link: string;
};

type NavigationMap = Record<Locale, { text: string; link: string }[]>;

const NAV_ITEMS: NavItem[] = [
  { key: 'home', text: { en: 'Home', fr: 'Accueil' }, link: '/' },
  { key: 'guides', text: { en: 'Guides', fr: 'Guides' }, link: '/guides/foundations' },
  { key: 'governance', text: { en: 'Governance', fr: 'Gouvernance' }, link: '/governance/' },
  { key: 'about', text: { en: 'About', fr: 'A propos' }, link: '/about/' },
  { key: 'contact', text: { en: 'Contact', fr: 'Contact' }, link: '/contact/' },
];

function addLocalePrefix(locale: Locale, link: string): string {
  if (link === '/') return `/${locale}/`;
  return `/${locale}${link}`;
}

function buildNavForLocale(locale: Locale) {
  const defaultLocale = getDefaultLanguage();
  return NAV_ITEMS.map(item => ({
    text: item.text[locale] ?? item.text[defaultLocale],
    link: addLocalePrefix(locale, item.link),
  }));
}

export function buildNavigation(): NavigationMap {
  return Object.fromEntries(getActiveLanguages().map(locale => [locale, buildNavForLocale(locale)])) as NavigationMap;
}
