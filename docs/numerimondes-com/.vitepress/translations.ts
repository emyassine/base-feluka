export type I18nMessages = Record<string, Record<string, string>>;

// Global UI translations for the theme (not footer-only).
export const I18N_MESSAGES: I18nMessages = {
  fr: {
    'footer.social': 'Réseaux sociaux',
    'footer.legal': 'Liens légaux',
    'footer.locale': 'Langue et région',
    'footer.links.privacy': 'Confidentialité',
    'footer.links.legal': 'Mentions légales',
    'footer.links.cookies': 'Cookies',
    'footer.links.sitemap': 'Plan du site',
    'footer.links.more': 'Plus',
  },
  en: {
    'footer.social': 'Social links',
    'footer.legal': 'Legal links',
    'footer.locale': 'Language and region',
    'footer.links.privacy': 'Privacy',
    'footer.links.legal': 'Legal notice',
    'footer.links.cookies': 'Cookies',
    'footer.links.sitemap': 'Sitemap',
    'footer.links.more': 'More',
  },
};
