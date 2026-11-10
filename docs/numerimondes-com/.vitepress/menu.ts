export type MenuLocaleMap = Record<string, string>;

export type MenuAction =
  | { type: 'navigate'; href: MenuLocaleMap }
  | { type: 'alert'; message: MenuLocaleMap }
  | { type: 'modal'; id: string; payload?: any };

export type MenuItem = {
  label: MenuLocaleMap;
  link?: MenuLocaleMap;
  ref?: { fromPath: string };
  items?: MenuItem[];
  group?: string;
  class?: string;
  action?: MenuAction;
  sidebar?: {
    include?: string[];
    exclude?: string[];
  };
};

export const MENU: MenuItem[] = [
  {
    label: { en: 'Home', fr: 'Accueil' },
    ref: { fromPath: 'docs' },
    group: 'home',
  },
  {
    label: { en: 'Resources', fr: 'Ressources' },
    ref: { fromPath: 'resources' },
    group: 'resources',
    sidebar: {
      include: ['**'],
    },
  },
  {
    label: { en: 'Products', fr: 'Produits' },
    ref: { fromPath: 'products' },
    group: 'products',
    sidebar: {
      include: ['**'],
    },
  },
  {
    label: { en: 'About', fr: 'À propos' },
    ref: { fromPath: 'about' },
    group: 'about',
    sidebar: {
      include: ['**'],
    },
  },
  {
    label: { en: 'Contact', fr: 'Contact' },
    ref: { fromPath: 'contact' },
    group: 'contact',
    class: 'nav-contact',
    action: { type: 'modal', id: 'contactModal' },
  },
];
