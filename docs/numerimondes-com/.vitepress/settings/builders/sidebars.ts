import type { DefaultTheme } from 'vitepress';
import type { CmsCache, CmsQuery } from '../generated/cms';
import { createCmsQuery } from '../generated/cms/concerns/query-builder';
import { MENU, type MenuItem, type MenuLocaleMap } from '../../menu';

type Locale = string;

type SidebarByLocale = Record<Locale, DefaultTheme.Sidebar>;
type SidebarPrefixMap = DefaultTheme.Sidebar;

const pickLocaleValue = (map: MenuLocaleMap | undefined, locale: string): string => {
  if (!map) return '';
  const defaultLocale =
    typeof (globalThis as any).getDefaultLocale === 'function' ? (globalThis as any).getDefaultLocale() : 'en';
  return map[locale] || map[defaultLocale] || map.en || map.fr || Object.values(map)[0] || '';
};

const normalizePath = (value: string): string => value.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/g, '');

const resolveLinkFromRef = (cache: CmsCache, locale: string, ref?: { fromPath: string }): string => {
  if (!ref?.fromPath) return '';
  const fromPath = normalizePath(ref.fromPath);
  if (!fromPath) return '';

  if (fromPath.endsWith('.md')) {
    const id = cache?.indexes?.bySourcePath?.[fromPath];
    const page = id ? cache?.pages?.[id] : null;
    return page?.i18n?.[locale]?.url || page?.i18n?.[locale]?.href || '';
  }

  const pages = cache?.pages || {};
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

const normalizePrefix = (p: string): string => {
  if (!p) return p;
  return p.endsWith('/') ? p : `${p}/`;
};

const walkMenu = (items: MenuItem[], fn: (item: MenuItem) => void): void => {
  for (const it of items) {
    fn(it);
    if (it.items?.length) walkMenu(it.items, fn);
  }
};

type BookRef = {
  group: string;
  prefix: string;
  locale: string;
  include: string[];
  exclude: string[];
};

const collectBooksFromMenu = (cache: CmsCache, menu: MenuItem[], locale: string): BookRef[] => {
  const out: BookRef[] = [];
  walkMenu(menu, it => {
    if (!it.group) return;
    const prefix = it.link ? pickLocaleValue(it.link, locale) : it.ref ? resolveLinkFromRef(cache, locale, it.ref) : '';
    const groupMeta = cache?.groups?.[it.group];
    const fallbackPrefix =
      groupMeta?.collection === 'guides' && groupMeta?.slug ? `/${locale}/guides/${groupMeta.slug}/` : '';
    const finalPrefix = prefix || fallbackPrefix;
    if (!finalPrefix) return;
    out.push({
      group: it.group,
      prefix: normalizePrefix(finalPrefix),
      locale,
      include: Array.isArray(it.sidebar?.include) ? it.sidebar!.include! : [],
      exclude: Array.isArray(it.sidebar?.exclude) ? it.sidebar!.exclude! : [],
    });
  });
  return out;
};

const toRegex = (pattern: string): RegExp => {
  const cleaned = pattern.trim();
  if (!cleaned) return /^$/;
  if (cleaned === '*') return /^[^/]*$/;
  if (cleaned === '**') return /^.*$/;

  // Convert glob to regex safely.
  let out = '';
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    const next = cleaned[i + 1];
    if (ch === '*' && next === '*') {
      out += '.*';
      i += 1;
      continue;
    }
    if (ch === '*') {
      out += '[^/]*';
      continue;
    }
    if ('\\.^$+?()[]{}|'.includes(ch)) {
      out += `\\${ch}`;
      continue;
    }
    out += ch;
  }
  return new RegExp(`^${out}$`);
};

const normalizeRel = (value: string): string => normalizePath(value);

const isExcluded = (paths: string[], patterns: string[]): boolean => {
  if (!patterns.length) return false;
  const regs = patterns.map(p => toRegex(normalizeRel(p)));
  return paths.some(p => regs.some(r => r.test(normalizeRel(p))));
};

const isIncluded = (paths: string[], patterns: string[]): boolean => {
  if (!patterns.length) return true;
  const regs = patterns.map(p => toRegex(normalizeRel(p)));
  return paths.some(p => regs.some(r => r.test(normalizeRel(p))));
};

const stripNumericPrefix = (s: string): string => s.replace(/^\d+-/, '');

const titleize = (value: string): string => {
  if (!value) return value;
  const cleaned = stripNumericPrefix(value).replace(/[-_]+/g, ' ').trim();
  if (!cleaned) return value;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const toSidebarText = (page: any, locale: string): string => {
  const sidebarTitle = page?.frontmatter?.byLocale?.[locale]?.sidebarTitle;
  if (sidebarTitle && String(sidebarTitle).trim()) {
    return String(sidebarTitle).trim();
  }
  const raw = page?.frontmatter?.byLocale?.[locale]?.title || page?.i18n?.[locale]?.title || page?.slug || 'Untitled';
  return titleize(String(raw));
};

const toSidebarLink = (page: any, locale: string): string | undefined => {
  return page?.i18n?.[locale]?.url || page?.i18n?.[locale]?.href;
};

const groupPageIds = (cache: CmsCache, group: string): string[] => {
  const pages = cache?.navigation?.sidebar?.guides?.sections?.[group]?.pages;
  if (Array.isArray(pages) && pages.length) return pages;
  const byGroup = cache?.indexes?.byGroup?.[group];
  if (Array.isArray(byGroup) && byGroup.length) return byGroup;
  return [];
};

const groupIndexId = (cache: CmsCache, group: string): string | null => {
  const idx = cache?.navigation?.sidebar?.guides?.sections?.[group]?.indexPage;
  if (typeof idx === 'string' && idx) return idx;

  const ids = groupPageIds(cache, group);
  for (const id of ids) {
    const p = cache?.pages?.[id];
    if (p?.source?.isIndex) return id;
  }

  const byGroup = cache?.indexes?.byGroup?.[group] || [];
  for (const id of byGroup) {
    const p = cache?.pages?.[id];
    if (p?.slug === '' || p?.source?.isIndex) return id;
  }

  return null;
};

const buildSidebarTreeForGroup = (
  cache: CmsCache,
  group: string,
  locale: string,
  include: string[],
  exclude: string[]
): { rootItems: DefaultTheme.SidebarItem[]; sectionItems: DefaultTheme.SidebarItem[] } => {
  const q: CmsQuery = createCmsQuery(cache, locale);

  const rows = q.inGroup(group).depth('*').sortByOrder().get();

  const groupDir = cache?.groups?.[group]?.dir || '';

  type Node = { key: string; title: string; link?: string; children: Map<string, Node>; pages: any[] };
  const root: Node = { key: '', title: '', children: new Map(), pages: [] };

  const ensureDirNode = (relDir: string): Node => {
    const parts = relDir.split('/').filter(Boolean);
    let cur = root;
    for (const p of parts) {
      if (!cur.children.has(p)) cur.children.set(p, { key: p, title: p, children: new Map(), pages: [] });
      cur = cur.children.get(p)!;
    }
    return cur;
  };

  for (const row of rows) {
    const pageId = row?.id;
    const page = pageId ? cache?.pages?.[pageId] : null;
    if (!page) continue;

    const pathDir: string = page?.source?.pathDir || page?.source?.dir || '';
    const sourcePath: string = page?.source?.sourcePathByLocale?.[locale] || '';
    const relPathDir =
      groupDir && pathDir.startsWith(groupDir)
        ? pathDir.slice(groupDir.length).replace(/^\//, '')
        : normalizeRel(pathDir);
    if (!isIncluded([relPathDir, sourcePath], include)) continue;
    if (isExcluded([relPathDir, sourcePath], exclude)) continue;
    const rel = groupDir && pathDir.startsWith(groupDir) ? pathDir.slice(groupDir.length) : pathDir;
    const relDir = rel.replace(/^\//, '');

    const node = ensureDirNode(relDir);
    node.pages.push(page);
  }

  const toItems = (node: Node, parentPath: string): DefaultTheme.SidebarItem[] => {
    const items: DefaultTheme.SidebarItem[] = [];

    const childDirs = Array.from(node.children.values()).sort((a, b) => a.key.localeCompare(b.key));
    for (const dirNode of childDirs) {
      const dirPath = parentPath ? `${parentPath}/${dirNode.key}` : dirNode.key;

      const dirIndex = dirNode.pages.find(p => p?.source?.isIndex);
      const dirLink = dirIndex ? toSidebarLink(dirIndex, locale) : undefined;
      const dirTitle = dirIndex ? toSidebarText(dirIndex, locale) : titleize(dirNode.key);

      const childItems = [
        ...dirNode.pages
          .filter(p => !p?.source?.isIndex)
          .sort((a, b) => (a?.order?.page ?? 9999) - (b?.order?.page ?? 9999))
          .map(p => ({ text: toSidebarText(p, locale), link: toSidebarLink(p, locale) }))
          .filter(x => !!x.link),
        ...toItems(dirNode, dirPath),
      ];

      if (childItems.length) {
        items.push({
          text: dirTitle,
          link: dirLink,
          collapsed: true,
          items: childItems,
        });
      } else if (dirLink) {
        // Directory with only an index page should still appear.
        items.push({
          text: dirTitle,
          link: dirLink,
        });
      }
    }

    const herePages = node.pages
      .filter(p => !p?.source?.isIndex)
      .sort((a, b) => (a?.order?.page ?? 9999) - (b?.order?.page ?? 9999))
      .map(p => ({ text: toSidebarText(p, locale), link: toSidebarLink(p, locale) }))
      .filter(x => !!x.link);

    if (parentPath === '') {
      return [...items];
    }

    return items;
  };

  const sectionItems = toItems(root, '');
  const rootItems = root.pages
    .filter(p => !p?.source?.isIndex)
    .sort((a, b) => (a?.order?.page ?? 9999) - (b?.order?.page ?? 9999))
    .map(p => ({ text: toSidebarText(p, locale), link: toSidebarLink(p, locale) }))
    .filter(x => !!x.link);

  return { rootItems, sectionItems };
};

const buildBookSidebarForPrefix = (
  cache: CmsCache,
  group: string,
  locale: string,
  include: string[],
  exclude: string[]
): DefaultTheme.SidebarItem[] => {
  const groupMeta = cache?.groups?.[group];
  const sectionTitle =
    groupMeta?.label?.[locale] || cache?.navigation?.sidebar?.guides?.sections?.[group]?.title?.[locale] || group;

  const indexId = groupIndexId(cache, group);
  const indexPage = indexId ? cache?.pages?.[indexId] : null;
  const indexLink = indexPage ? toSidebarLink(indexPage, locale) : undefined;
  const indexItemTextRaw = indexPage?.frontmatter?.byLocale?.[locale]?.sidebarIndexTitle;
  const indexItemText =
    indexItemTextRaw && String(indexItemTextRaw).trim() ? String(indexItemTextRaw).trim() : undefined;
  const indexItem =
    indexPage && indexLink ? { text: indexItemText ?? toSidebarText(indexPage, locale), link: indexLink } : null;

  const { rootItems, sectionItems } = buildSidebarTreeForGroup(cache, group, locale, include, exclude);
  if (!rootItems.length && !sectionItems.length && !indexItem) return [];

  const groups: DefaultTheme.SidebarItem[] = [];

  const groupItems = [...(indexItem ? [indexItem] : []), ...rootItems];
  if (groupItems.length) {
    groups.push({
      text: sectionTitle,
      link: indexItem ? undefined : indexLink,
      collapsed: false,
      items: groupItems,
    });
  }

  for (const section of sectionItems) {
    groups.push(section);
  }

  return groups;
};

const collectDirPrefixes = (cache: CmsCache, group: string, locale: string): string[] => {
  const groupDir = cache?.groups?.[group]?.dir;
  if (!groupDir) return [];
  const dirs = Object.keys(cache?.indexes?.byDir || {}).filter(d => d.startsWith(groupDir));
  const prefixes: string[] = [];
  for (const dir of dirs) {
    const ids = cache.indexes.byDir[dir] || [];
    const indexId = ids.find(id => cache.pages?.[id]?.source?.isIndex);
    if (!indexId) continue;
    const page = cache.pages[indexId];
    const url = page?.i18n?.[locale]?.url || page?.i18n?.[locale]?.href;
    if (url) prefixes.push(normalizePrefix(url));
  }
  return prefixes;
};

export function buildSidebarsFromMenu(cache: CmsCache): SidebarByLocale {
  const locales = cache?.meta?.locales || [];
  const defaultLocale = cache?.meta?.defaultLocale || 'en';

  const out: SidebarByLocale = {};

  for (const locale of locales) {
    const prefixMap: SidebarPrefixMap = {};

    const books = collectBooksFromMenu(cache, MENU, locale);

    for (const b of books) {
      const items = buildBookSidebarForPrefix(cache, b.group, locale, b.include || [], b.exclude || []);
      prefixMap[b.prefix] = items;
      // Also register locale-relative prefix (without /{locale}) for VitePress locale sidebar matching.
      const localePrefix = `/${locale}/`;
      if (b.prefix.startsWith(localePrefix)) {
        const withoutLocale = `/${b.prefix.slice(localePrefix.length)}`;
        prefixMap[withoutLocale] = items;
      }

      // Add prefixes for all subdirectories (keeps sidebar in nested routes)
      const dirPrefixes = collectDirPrefixes(cache, b.group, locale);
      for (const p of dirPrefixes) {
        prefixMap[p] = items;
        if (p.startsWith(localePrefix)) {
          const withoutLocale = `/${p.slice(localePrefix.length)}`;
          prefixMap[withoutLocale] = items;
        }
      }
    }

    // Fallback sidebar to avoid undefined when no prefix matches.
    prefixMap[`/${locale}/`] = [];

    out[locale] = prefixMap;
  }

  if (!Object.keys(out).length && defaultLocale) out[defaultLocale] = {};

  return out;
}
