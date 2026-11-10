import fs from 'node:fs';
import path from 'node:path';
import { listDirs } from '../../../utils/fs';
import { parseFrontmatter, extractTitle } from '../../../utils/frontmatter';
import { titleCase, createHash } from '../../../utils/string';
import { parseGroup, parseFileName, buildDocUrl } from '../../../utils/parse';
import { isValidLocale } from '../../static/i18n';
type RawCmsItem = {
  id: string;
  locale: string;
  collection: string;
  group: string;
  orderGroup: number;
  orderPage: number;
  slug: string;
  title: string;
  description?: string;
  tags?: string[];
  url: string;
  sourcePath: string;
  date?: string;
  frontmatter: {
    shared: Record<string, any>;
    byLocale: Record<string, Record<string, any>>;
  };
  taxonomy: {
    type?: string;
    tags?: string[];
    audience?: string[];
  };
  assets: {
    thumbnail?: string;
  };
};

type FrontmatterRecord = Record<string, any>;
type NormalizedFrontmatter = {
  shared: {
    order: number;
    orderGroup?: number;
    draft: boolean;
    type?: string;
    tags: string[];
    audience: string[];
    thumbnail: string | null;
    icon: string | null;
    layout: string | null;
  };
  byLocale: {
    title: string;
    description: string | null;
    sidebarTitle: string | null;
    image: string | null;
    head: any;
    _raw: FrontmatterRecord;
  };
};

const toArray = (value: unknown): string[] => {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : ([value].filter(Boolean) as string[]);
};

const normalizeFrontmatter = (
  data: FrontmatterRecord,
  locale: string,
  headingTitle: string,
  fallbackTitle: string,
  orderPage: number,
  orderGroup?: number
): NormalizedFrontmatter => {
  const rawBase = typeof data === 'object' && data ? data : {};
  const title = typeof rawBase.title === 'string' ? rawBase.title : headingTitle || fallbackTitle;
  const description =
    typeof rawBase.description === 'string'
      ? rawBase.description
      : typeof rawBase.summary === 'string'
        ? rawBase.summary
        : null;

  const coerceBool = (value: unknown, fallback: boolean): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const v = value.trim().toLowerCase();
      if (v === 'true') return true;
      if (v === 'false') return false;
    }
    return fallback;
  };

  const ensureHeadMeta = (headValue: unknown, metaDesc: string): any[] => {
    const candidate = Array.isArray(headValue) ? headValue : [];
    const hasMeta = candidate.some(entry => {
      if (!Array.isArray(entry) || entry.length < 2) return false;
      const [tag, attrs] = entry;
      return (
        tag === 'meta' &&
        attrs &&
        typeof attrs === 'object' &&
        typeof attrs.name === 'string' &&
        typeof attrs.content === 'string'
      );
    });
    if (hasMeta) return candidate;
    return [...candidate, ['meta', { name: 'description', content: metaDesc }]];
  };

  const descValue = description && description.trim().length > 0 ? description : title;

  const raw: FrontmatterRecord = {
    ...rawBase,
    title,
    description: descValue,
    titleTemplate:
      typeof rawBase.titleTemplate === 'string' || typeof rawBase.titleTemplate === 'boolean'
        ? rawBase.titleTemplate
        : true,
    layout: typeof rawBase.layout === 'string' ? rawBase.layout : 'doc',
    navbar: coerceBool(rawBase.navbar, true),
    sidebar: coerceBool(rawBase.sidebar, true),
    aside: rawBase.aside === 'left' || typeof rawBase.aside === 'boolean' ? rawBase.aside : true,
    outline:
      typeof rawBase.outline === 'number' ||
      rawBase.outline === 'deep' ||
      rawBase.outline === false ||
      (Array.isArray(rawBase.outline) &&
        rawBase.outline.length === 2 &&
        rawBase.outline.every(n => typeof n === 'number'))
        ? rawBase.outline
        : 2,
    lastUpdated:
      typeof rawBase.lastUpdated === 'boolean' ||
      typeof rawBase.lastUpdated === 'string' ||
      typeof rawBase.lastUpdated === 'number'
        ? rawBase.lastUpdated
        : true,
    editLink: coerceBool(rawBase.editLink, true),
    footer: coerceBool(rawBase.footer, true),
    pageClass:
      typeof rawBase.pageClass === 'string' && rawBase.pageClass.trim().length > 0 ? rawBase.pageClass : 'page',
    isHome: coerceBool(rawBase.isHome, false),
  };

  raw.head = ensureHeadMeta(rawBase.head, descValue);

  return {
    shared: {
      order: typeof data.order === 'number' ? data.order : orderPage,
      orderGroup: typeof data.orderGroup === 'number' ? data.orderGroup : orderGroup,
      draft: typeof data.draft === 'boolean' ? data.draft : false,
      type: typeof data.type === 'string' ? data.type : undefined,
      tags: toArray(data.tags),
      audience: toArray(data.audience),
      thumbnail: typeof data.thumbnail === 'string' ? data.thumbnail : null,
      icon: typeof data.icon === 'string' ? data.icon : null,
      layout: typeof data.layout === 'string' ? data.layout : null,
    },
    byLocale: {
      title,
      description: descValue,
      sidebarTitle: typeof data.sidebarTitle === 'string' ? data.sidebarTitle : null,
      image: typeof data.image === 'string' ? data.image : null,
      head: raw.head,
      _raw: raw,
    },
  };
};

export function buildContentIndex(docsDir: string): RawCmsItem[] {
  // Index non-guides content under docs/ (e.g., pages like api-examples-en.md)
  const excludedDirs = new Set(['guides', 'public']);
  const excludedPrefixes = ['.', '_'];

  function listFilesRecursive(dir: string, base: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const results: string[] = [];

    for (const entry of entries) {
      if (excludedPrefixes.some(prefix => entry.name.startsWith(prefix))) continue;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (excludedDirs.has(entry.name)) continue;
        results.push(...listFilesRecursive(abs, base));
        continue;
      }
      if (entry.isFile()) {
        results.push(path.relative(base, abs));
      }
    }

    return results;
  }

  const guidesDir = path.join(docsDir, 'guides');
  const items: RawCmsItem[] = [];
  const groups = listDirs(guidesDir);

  for (const groupDir of groups) {
    const { group, orderGroup } = parseGroup(groupDir);
    const absGroupDir = path.join(guidesDir, groupDir);
    const files = listFilesRecursive(absGroupDir, absGroupDir).filter(f => f.endsWith('.md'));

    for (const relFile of files) {
      const fileName = path.basename(relFile);
      const { locale, orderPage, slug } = parseFileName(fileName);
      const absPath = path.join(absGroupDir, relFile);
      const raw = fs.readFileSync(absPath, 'utf8');
      const { data, body } = parseFrontmatter(raw);

      const headingTitle = extractTitle(body);
      const fallbackTitle = slug ? titleCase(slug) : titleCase(group);
      const normalizedFrontmatter = normalizeFrontmatter(
        data as FrontmatterRecord,
        locale,
        headingTitle,
        fallbackTitle,
        orderPage,
        orderGroup
      );

      const orderOverride = normalizedFrontmatter.shared.order;
      const finalOrderPage = orderOverride ?? orderPage;
      const groupOverride = typeof data.group === 'string' ? data.group : undefined;

      const sourcePath = path.posix.join('guides', groupDir, relFile).replace(/\\/g, '/');

      const relDir = path.posix
        .dirname(sourcePath)
        .replace(/^guides\//, '')
        .split('/')
        .map(segment => segment.replace(/^\d+-/, ''))
        .filter(Boolean);

      const urlPath = ['guides', group, ...relDir.slice(1)].filter(Boolean).join('/');
      const url = buildDocUrl(locale, urlPath, slug);

      items.push({
        id: createHash(sourcePath),
        locale,
        collection: 'guides',
        group: groupOverride || group,
        orderGroup,
        orderPage: finalOrderPage,
        slug,
        title: normalizedFrontmatter.byLocale.title,
        description: normalizedFrontmatter.byLocale.description ?? undefined,
        tags: normalizedFrontmatter.shared.tags.length ? normalizedFrontmatter.shared.tags : undefined,
        url,
        sourcePath,
        frontmatter: {
          shared: normalizedFrontmatter.shared,
          byLocale: {
            [locale]: normalizedFrontmatter.byLocale,
          },
        } as any,
        taxonomy: {
          type: normalizedFrontmatter.shared.type,
          tags: normalizedFrontmatter.shared.tags.length ? normalizedFrontmatter.shared.tags : undefined,
          audience: normalizedFrontmatter.shared.audience.length ? normalizedFrontmatter.shared.audience : undefined,
        },
        assets: {
          thumbnail: normalizedFrontmatter.shared.thumbnail ?? undefined,
        },
      });
    }
  }

  const stripNumericPrefix = (segment: string): string => segment.replace(/^\d+-/, '');

  const contentFiles = listFilesRecursive(docsDir, docsDir).filter(f => f.endsWith('.md'));

  for (const relPath of contentFiles) {
    const fileName = path.basename(relPath);
    const localeMatch = fileName.match(/-([a-z]{2})\.md$/);
    if (!localeMatch || !isValidLocale(localeMatch[1])) continue;

    const { locale, orderPage, slug } = parseFileName(fileName);
    const absPath = path.join(docsDir, relPath);
    const raw = fs.readFileSync(absPath, 'utf8');
    const { data, body } = parseFrontmatter(raw);

    const headingTitle = extractTitle(body);
    const fallbackTitle = slug ? titleCase(slug) : 'Home';
    const normalizedFrontmatter = normalizeFrontmatter(
      data as FrontmatterRecord,
      locale,
      headingTitle,
      fallbackTitle,
      orderPage
    );

    const orderOverride = normalizedFrontmatter.shared.order;
    const finalOrderPage = orderOverride ?? orderPage;
    const groupOverride = typeof data.group === 'string' ? data.group : undefined;

    const relDir = path.dirname(relPath);
    const segments = (relDir === '.' ? [] : relDir.split(path.sep))
      .map(segment => stripNumericPrefix(segment))
      .filter(Boolean);
    const group = groupOverride || segments[0] || 'root';

    const cleanRelDir = segments.join('/');
    const url = buildDocUrl(locale, cleanRelDir, slug);

    items.push({
      id: createHash(`docs:${relPath}`),
      locale,
      collection: 'docs',
      group,
      orderGroup: 9999,
      orderPage: finalOrderPage,
      slug,
      title: normalizedFrontmatter.byLocale.title,
      description: normalizedFrontmatter.byLocale.description ?? undefined,
      tags: normalizedFrontmatter.shared.tags.length ? normalizedFrontmatter.shared.tags : undefined,
      url,
      sourcePath: relPath.replace(/\\/g, '/'),
      frontmatter: {
        shared: normalizedFrontmatter.shared,
        byLocale: {
          [locale]: normalizedFrontmatter.byLocale,
        },
      } as any,
      taxonomy: {
        type: normalizedFrontmatter.shared.type,
        tags: normalizedFrontmatter.shared.tags.length ? normalizedFrontmatter.shared.tags : undefined,
        audience: normalizedFrontmatter.shared.audience.length ? normalizedFrontmatter.shared.audience : undefined,
      },
      assets: {
        thumbnail: normalizedFrontmatter.shared.thumbnail ?? undefined,
      },
    });
  }

  return items.sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
}
