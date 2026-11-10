import fs from 'node:fs';
import path from 'node:path';
import { ensureDir, writeJsonIfChanged } from '../../../utils/fs';
import { buildContentIndex } from './content-index';
import { buildRewrites } from './rewrites';
import { getActiveLanguages, getDefaultLanguage } from '../../static/i18n';
import { titleCase } from '../../../utils/string';
import { buildNavigation } from '../../static';

export function buildCmsCache(docsDir: string, outDir: string): number {
  ensureDir(outDir);

  const items = buildContentIndex(docsDir);

  const activeLocales = getActiveLanguages();
  const locales = activeLocales.length ? activeLocales : [getDefaultLanguage()];

  const collections: Record<string, { label: Record<string, string>; rootDir: string; defaultGroup?: string }> = {};
  const groups: Record<
    string,
    {
      collection: string;
      order: number;
      label: Record<string, string>;
      dir: string;
      slug: string;
      nav: { showInNavbar: boolean; navbarOrder: number };
    }
  > = {};
  const pages: Record<
    string,
    {
      id: string;
      collection: string;
      group: string;
      slug: string;
      order: { group: number; page: number };
      source: {
        dir: string;
        relativeDir: string;
        pathDir: string;
        segments: string[];
        depth: number;
        isIndex: boolean;
        basenameByLocale: Record<string, string>;
        sourcePathByLocale: Record<string, string>;
      };
      taxonomy: { type?: string; tags?: string[]; audience?: string[] };
      frontmatter: { shared: Record<string, any>; byLocale: Record<string, Record<string, any>> };
      assets: { thumbnailByLocale: Record<string, string | null> };
      legacy: Record<string, string>;
      i18n: Record<
        string,
        { title: string; description: string | null; url: string; href: string; sourcePath: string }
      >;
    }
  > = {};
  const indexes = {
    bySourcePath: {} as Record<string, string>,
    byUrl: {} as Record<string, string>,
    byLegacyId: {} as Record<string, string>,
  };

  const getPageId = (item: (typeof items)[number]) => {
    const base = item.slug || 'index';
    if (item.slug) return `${item.collection}:${item.group}:${base}`;

    const sourceDir = deriveSourceDir(item);
    const pathDir = derivePathDir(item);
    if (pathDir && sourceDir && pathDir !== sourceDir && pathDir.startsWith(`${sourceDir}/`)) {
      const rel = pathDir.slice(sourceDir.length + 1);
      const suffix = rel.split('/').filter(Boolean).map(cleanSegment).join(':');
      if (suffix) return `${item.collection}:${item.group}:${suffix}:index`;
    }

    return `${item.collection}:${item.group}:index`;
  };

  const cleanSegment = (segment: string) => segment.replace(/^\d+-/, '');

  const splitPath = (value: string) =>
    value
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean);

  const deriveSourceDir = (item: (typeof items)[number]) => {
    const parts = splitPath(item.sourcePath);
    if (item.collection === 'guides' && parts.length >= 2) {
      return `${parts[0]}/${parts[1]}`;
    }
    return parts.slice(0, -1).join('/') || item.collection;
  };

  const derivePathDir = (item: (typeof items)[number]) =>
    splitPath(item.sourcePath).slice(0, -1).join('/') || item.collection;

  const deriveRelativeDir = (sourceDir: string, collection: string) =>
    sourceDir.replace(new RegExp(`^${collection}/?`), '');

  for (const item of items) {
    const pageId = getPageId(item);

    if (!collections[item.collection]) {
      const label = titleCase(item.collection);
      collections[item.collection] = {
        label: Object.fromEntries(locales.map(locale => [locale, label])),
        rootDir: item.collection === 'guides' ? 'guides' : 'docs',
      };
    }

    if (!groups[item.group]) {
      const label = titleCase(item.group);
      const sourceDir = deriveSourceDir(item);
      groups[item.group] = {
        collection: item.collection,
        order: item.orderGroup,
        label: Object.fromEntries(locales.map(locale => [locale, label])),
        dir: sourceDir,
        slug: item.group,
        nav: { showInNavbar: true, navbarOrder: item.orderGroup },
      };
    }

    if (!pages[pageId]) {
      const sourceDir = deriveSourceDir(item);
      const pathDir = derivePathDir(item);
      const relativeDir = deriveRelativeDir(sourceDir, item.collection);
      const segments = splitPath(pathDir).map(cleanSegment);
      const depth = pathDir.startsWith(sourceDir) ? splitPath(pathDir.replace(sourceDir, '')).length - 1 : 0;

      pages[pageId] = {
        id: pageId,
        collection: item.collection,
        group: item.group,
        slug: item.slug,
        order: { group: item.orderGroup, page: item.orderPage },
        source: {
          dir: sourceDir,
          relativeDir,
          pathDir,
          segments,
          depth: Math.max(0, depth),
          isIndex: item.slug === '',
          basenameByLocale: {},
          sourcePathByLocale: {},
        },
        taxonomy: {
          type: item.taxonomy?.type,
          tags: item.taxonomy?.tags,
          audience: item.taxonomy?.audience,
        },
        frontmatter: {
          shared: {},
          byLocale: {},
        },
        assets: {
          thumbnailByLocale: {},
        },
        legacy: {},
        i18n: {},
      };
    }

    const page = pages[pageId];
    page.legacy[item.locale] = item.id;
    page.i18n[item.locale] = {
      title: item.title,
      description: item.description ?? null,
      url: item.url,
      href: item.url,
      sourcePath: item.sourcePath,
    };
    page.source.basenameByLocale[item.locale] = path.posix.basename(item.sourcePath);
    page.source.sourcePathByLocale[item.locale] = item.sourcePath;
    const sharedFrontmatter = item.frontmatter?.shared ?? {};
    if (!page.frontmatter.shared || Object.keys(page.frontmatter.shared).length === 0) {
      page.frontmatter.shared = sharedFrontmatter;
    }
    page.frontmatter.byLocale[item.locale] = item.frontmatter?.byLocale?.[item.locale] ?? {};
    page.assets.thumbnailByLocale[item.locale] = item.assets?.thumbnail ?? sharedFrontmatter.thumbnail ?? null;

    indexes.bySourcePath[item.sourcePath] = pageId;
    indexes.byUrl[item.url] = pageId;
    indexes.byLegacyId[item.id] = pageId;
  }

  for (const page of Object.values(pages)) {
    if (page.slug !== '') continue;
    const group = groups[page.group];
    if (!group) continue;
    for (const locale of Object.keys(page.i18n)) {
      group.label[locale] = page.i18n[locale].title;
    }
  }

  const navigation = {
    sidebar: {
      guides: {
        sectionOrder: [] as string[],
        sections: {} as Record<string, { title?: Record<string, string>; indexPage?: string; pages: string[] }>,
      },
    },
    navbar: buildNavigation(),
  };

  const guideGroups = Object.entries(groups)
    .filter(([, g]) => g.collection === 'guides')
    .sort((a, b) => a[1].order - b[1].order)
    .map(([key]) => key);

  navigation.sidebar.guides.sectionOrder = guideGroups;

  for (const groupKey of guideGroups) {
    const groupPages = Object.values(pages)
      .filter(p => p.collection === 'guides' && p.group === groupKey)
      .sort((a, b) => a.order.page - b.order.page);

    const indexPage = groupPages.find(p => p.slug === '')?.id;
    const pageIds = groupPages.filter(p => p.slug !== '').map(p => p.id);

    navigation.sidebar.guides.sections[groupKey] = {
      title: groups[groupKey]?.label,
      ...(indexPage ? { indexPage } : {}),
      pages: pageIds,
    };
  }

  const rewrites = buildRewrites(items as any, docsDir);
  const rewritesById: Record<string, Record<string, string>> = {};
  for (const [sourcePath, target] of Object.entries(rewrites)) {
    const pageId = indexes.bySourcePath[sourcePath];
    if (!pageId) continue;
    if (!rewritesById[pageId]) rewritesById[pageId] = {};
    const localeMatch = sourcePath.match(/-([a-z]{2})\.md$/);
    const locale = localeMatch ? localeMatch[1] : getDefaultLanguage();
    rewritesById[pageId][locale] = target;
  }

  const indexesByCollection: Record<string, string[]> = {};
  const indexesByGroup: Record<string, string[]> = {};
  const indexesByDir: Record<string, string[]> = {};
  const indexesByTag: Record<string, string[]> = {};
  const indexesByType: Record<string, string[]> = {};

  for (const page of Object.values(pages)) {
    indexesByCollection[page.collection] ||= [];
    indexesByCollection[page.collection].push(page.id);

    indexesByGroup[page.group] ||= [];
    indexesByGroup[page.group].push(page.id);

    indexesByDir[page.source.dir] ||= [];
    indexesByDir[page.source.dir].push(page.id);
    if (page.source.pathDir && page.source.pathDir !== page.source.dir) {
      indexesByDir[page.source.pathDir] ||= [];
      indexesByDir[page.source.pathDir].push(page.id);
    }

    const tags = page.taxonomy.tags || [];
    for (const tag of tags) {
      indexesByTag[tag] ||= [];
      indexesByTag[tag].push(page.id);
    }

    if (page.taxonomy.type) {
      indexesByType[page.taxonomy.type] ||= [];
      indexesByType[page.taxonomy.type].push(page.id);
    }
  }

  const cachePath = path.join(outDir, 'cms-cache.json');
  const cacheChanged = writeJsonIfChanged(cachePath, {
    version: '2.1.0',
    meta: {
      generatedAt: new Date().toISOString(),
      locales,
      defaultLocale: getDefaultLanguage(),
      sourceRoot: '',
      contentRoots: ['guides', 'docs'],
      generator: {
        name: 'cms-generate',
      },
    },
    collections,
    groups,
    pages,
    navigation,
    rewrites,
    rewritesById,
    indexes: {
      ...indexes,
      byId: Object.fromEntries(Object.keys(pages).map(id => [id, true])),
      byCollection: indexesByCollection,
      byGroup: indexesByGroup,
      byDir: indexesByDir,
      byTag: indexesByTag,
      byType: indexesByType,
    },
  });

  if (cacheChanged) {
    const tempDir = path.join(path.dirname(outDir), '.temp');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  return items.length;
}

export default { buildCmsCache };
