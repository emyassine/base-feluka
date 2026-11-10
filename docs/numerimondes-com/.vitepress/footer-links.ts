export type LocaleMap = Record<string, string>;
export type FooterLinksByLocale = Record<string, FooterLink[]>;

export type FooterLinkDef = {
  key: string;
  ref?: { fromPath: string };
  link?: LocaleMap;
  external?: boolean;
  group?: string;
  items?: FooterLinkDef[];
};

export type FooterLink = {
  key: string;
  link: string;
  external?: boolean;
  group?: string;
  items?: FooterLink[];
};

export const FOOTER_LINKS: FooterLinkDef[] = [
  {
    key: 'footer.links.privacy',
    ref: { fromPath: 'legal/confidentialite' },
    group: 'legal',
  },
  {
    key: 'footer.links.legal',
    ref: { fromPath: 'legal/legal-mentions' },
    group: 'legal',
  },
  {
    key: 'footer.links.cookies',
    ref: { fromPath: 'legal/cookies' },
    group: 'legal',
  },
  {
    key: 'footer.links.sitemap',
    link: { fr: '/sitemap.xml', en: '/sitemap.xml' },
    group: 'legal',
  },
  {
    group: 'legal',
    key: 'footer.links.more',
    items: [
      { key: 'footer.links.privacy', ref: { fromPath: 'legal/legal-mentions' } },
      { key: 'footer.links.cookies', ref: { fromPath: 'legal/legal-mentions' } },
    ],
  },
];
