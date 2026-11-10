import fs from 'node:fs';
import path from 'node:path';
import { getActiveLanguages, type Locale } from '../../static/i18n';
import type { CmsCache } from '../cms';

type SidebarMap = Record<Locale, unknown>;

type SidebarItem = { text: string; link?: string; items: { text: string; link: string }[] };

export function buildSidebars(): SidebarMap {
  const cachePath = path.join(process.cwd(), '.vitepress', 'cache', 'gen', 'cms-cache.json');
  const cache = (fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {}) as CmsCache;
  const locales: string[] = cache?.meta?.locales ?? getActiveLanguages();
  const groups: Record<string, any> = cache?.groups ?? {};
  const pages: Record<string, any> = cache?.pages ?? {};
  const nav = cache?.navigation?.sidebar?.guides;

  const result = {} as SidebarMap;

  for (const locale of locales) {
    const sidebar: SidebarItem[] = [];
    if (nav?.sectionOrder?.length) {
      for (const sectionKey of nav.sectionOrder) {
        const section = nav.sections?.[sectionKey];
        if (!section) continue;
        const group = groups[sectionKey];
        const title = group?.label?.[locale] ?? section?.title?.[locale] ?? sectionKey;
        const indexPage = section.indexPage ? pages[section.indexPage]?.i18n?.[locale] : null;
        const items = (section.pages || [])
          .map((id: string) => pages[id]?.i18n?.[locale])
          .filter(Boolean)
          .map((entry: any) => ({ text: entry.title, link: entry.url }));

        const groupItem: SidebarItem = { text: title, items };
        if (indexPage?.url) groupItem.link = indexPage.url;
        sidebar.push(groupItem);
      }
    }
    result[locale as Locale] = sidebar;
  }

  return result;
}
