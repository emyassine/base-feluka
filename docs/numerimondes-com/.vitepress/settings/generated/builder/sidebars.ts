import { titleCase } from '../../../utils/string';

type MinimalItem = {
  locale: string;
  group: string;
  orderGroup: number;
  orderPage: number;
  slug: string;
  title: string;
  url: string;
};

type SidebarGroup = {
  text: string;
  link?: string;
  items: { text: string; link: string }[];
};

export function buildSidebarsFromItems(items: MinimalItem[]): Map<string, SidebarGroup[]> {
  const byLocale = new Map<string, MinimalItem[]>();

  for (const item of items) {
    if (!byLocale.has(item.locale)) {
      byLocale.set(item.locale, []);
    }
    byLocale.get(item.locale)!.push(item);
  }

  const result = new Map<string, SidebarGroup[]>();

  for (const [locale, localeItems] of byLocale.entries()) {
    const groups = new Map<string, MinimalItem[]>();

    for (const item of localeItems) {
      if (!groups.has(item.group)) {
        groups.set(item.group, []);
      }
      groups.get(item.group)!.push(item);
    }

    const sidebar: Array<SidebarGroup & { orderGroup: number }> = [];

    for (const [group, groupItems] of groups.entries()) {
      const sorted = [...groupItems].sort((a, b) => {
        if (a.orderGroup !== b.orderGroup) return a.orderGroup - b.orderGroup;
        if (a.orderPage !== b.orderPage) return a.orderPage - b.orderPage;
        return a.title.localeCompare(b.title);
      });

      const indexItem = sorted.find(item => item.slug === '');
      const itemsList = sorted.filter(item => item.slug !== '');

      const sidebarGroup: SidebarGroup & { orderGroup: number } = {
        orderGroup: sorted[0]?.orderGroup ?? 9999,
        text: indexItem ? indexItem.title : titleCase(group),
        ...(indexItem ? { link: indexItem.url } : {}),
        items: itemsList.map(item => ({
          text: item.title,
          link: item.url,
        })),
      };

      sidebar.push(sidebarGroup);
    }

    sidebar.sort((a, b) => {
      if (a.orderGroup !== b.orderGroup) return a.orderGroup - b.orderGroup;
      return a.text.localeCompare(b.text);
    });

    result.set(
      locale,
      sidebar.map(({ orderGroup, ...group }) => group)
    );
  }

  return result;
}
