import type { CmsCache, CmsPage, CmsQuery } from '../types';

const toArray = (value?: string[] | string): string[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const normalizePath = (value: string) => value.replace(/\\/g, '/').replace(/\/+$/g, '');

const getByPath = (obj: any, path: string): any => {
  const parts = path.split('.').filter(Boolean);
  let current = obj;
  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }
  return current;
};

const resolveLocale = (page: CmsPage, locale: string, fallback?: string) => {
  if (page.i18n[locale]) return locale;
  if (fallback && page.i18n[fallback]) return fallback;
  return '';
};

const resolveEntry = (page: CmsPage, locale: string, fallback?: string) => {
  const resolved = resolveLocale(page, locale, fallback);
  if (!resolved) return null;
  return { locale: resolved, data: page.i18n[resolved] };
};

export function createCmsQuery(cache: CmsCache, locale?: string): CmsQuery {
  const defaultLocale = cache.meta.defaultLocale;
  const state = {
    locale: locale || defaultLocale,
    allowFallback: false,
    filters: [] as Array<{ name: string; fn: (page: CmsPage) => boolean }>,
    sorter: null as null | ((a: CmsPage, b: CmsPage) => number),
    selector: null as null | ((row: any) => any),
    transformer: null as null | ((row: any) => any),
    limit: null as null | number,
    offset: 0,
    debug: null as null | {
      label?: string;
      sample?: number;
      include?: Array<'id' | 'slug' | 'group' | 'collection' | 'order' | 'source' | 'taxonomy' | 'i18n' | 'assets'>;
    },
  };

  const addFilter = (name: string, fn: (page: CmsPage) => boolean) => {
    state.filters.push({ name, fn });
  };

  const resolveRows = () => {
    const pages = Object.values(cache.pages);
    const filtered = pages.filter(page => state.filters.every(entry => entry.fn(page)));
    const total = filtered.length;
    const sorted = state.sorter ? [...filtered].sort(state.sorter) : filtered;
    const sliced =
      state.limit != null ? sorted.slice(state.offset, state.offset + state.limit) : sorted.slice(state.offset);

    const rows = sliced
      .map(page => {
        const entry = resolveEntry(page, state.locale, state.allowFallback ? defaultLocale : undefined);
        if (!entry) return null;
        const data = entry.data;
        return {
          id: page.id,
          collection: page.collection,
          group: page.group,
          slug: page.slug,
          order: page.order,
          source: page.source,
          taxonomy: page.taxonomy,
          frontmatter: page.frontmatter,
          assets: page.assets,
          i18n: data,
          _locale: entry.locale,
        };
      })
      .filter(Boolean) as any[];

    return { rows, total };
  };

  const pickDebugRow = (row: any, include?: Array<string>) => {
    if (!include || include.length === 0) {
      return { id: row.id, slug: row.slug, group: row.group, collection: row.collection, i18n: row.i18n };
    }
    const out: Record<string, any> = {};
    for (const key of include) {
      out[key] = row[key];
    }
    return out;
  };

  const logDebug = (rows: any[], total: number) => {
    if (!state.debug) return;
    if (!(import.meta as any)?.env?.DEV) return;
    const label = state.debug.label ? `CMS ${state.debug.label}` : 'CMS query';
    const sample = Math.max(0, Math.floor(state.debug.sample ?? 3));
    const include = state.debug.include;
    const filterNames = state.filters.map(f => f.name);
    console.log(`[${label}] locale=${state.locale} fallback=${state.allowFallback}`);
    console.log(`[${label}] filters=${state.filters.length}`, filterNames);
    console.log(
      `[${label}] totalMatched=${total} returned=${rows.length} offset=${state.offset} limit=${state.limit ?? 'none'}`
    );
    if (sample > 0) {
      const preview = rows.slice(0, sample).map(row => pickDebugRow(row, include));
      console.log(`[${label}] sample`, preview);
    }
  };

  const query: CmsQuery = {
    inCollection(key) {
      addFilter('inCollection', page => page.collection === key);
      return query;
    },
    inGroup(key) {
      addFilter('inGroup', page => page.group === key);
      return query;
    },
    inPath(dir) {
      const target = normalizePath(dir);
      addFilter('inPath', page => {
        const sourceDir = normalizePath(page.source.dir);
        const pathDir = normalizePath(page.source.pathDir);
        const entry = resolveEntry(page, state.locale, state.allowFallback ? defaultLocale : undefined);
        const sourcePath = entry?.data?.sourcePath ? normalizePath(entry.data.sourcePath) : '';
        return (
          sourceDir === target ||
          sourceDir.startsWith(`${target}/`) ||
          pathDir === target ||
          pathDir.startsWith(`${target}/`) ||
          sourcePath === target ||
          sourcePath.startsWith(`${target}/`)
        );
      });
      return query;
    },
    onlyIndex() {
      addFilter('onlyIndex', page => page.source.isIndex === true);
      return query;
    },
    noIndex() {
      addFilter('noIndex', page => page.source.isIndex === false);
      return query;
    },
    depth(n) {
      if (n === '*') return query;
      const target = Math.max(0, Math.floor(n));
      addFilter('depth', page => page.source.depth === target);
      return query;
    },
    ifDirectoryContains(seg) {
      addFilter('ifDirectoryContains', page => page.source.segments.includes(seg));
      return query;
    },
    ifPathIncludes(str) {
      const needle = str.toLowerCase();
      addFilter('ifPathIncludes', page => {
        const entry = resolveEntry(page, state.locale, state.allowFallback ? defaultLocale : undefined);
        const sourcePath = entry?.data?.sourcePath || '';
        return sourcePath.toLowerCase().includes(needle);
      });
      return query;
    },
    ifSlugStartsWith(prefix) {
      const needle = prefix.toLowerCase();
      addFilter('ifSlugStartsWith', page => page.slug.toLowerCase().startsWith(needle));
      return query;
    },
    type(value) {
      addFilter('type', page => page.taxonomy.type === value);
      return query;
    },
    tag(value) {
      addFilter('tag', page => (page.taxonomy.tags || []).includes(value));
      return query;
    },
    tagsAny(values) {
      const list = toArray(values);
      if (list.length === 0) return query;
      const set = new Set(list);
      addFilter('tagsAny', page => (page.taxonomy.tags || []).some(tag => set.has(tag)));
      return query;
    },
    tagsAll(values) {
      const list = toArray(values);
      if (list.length === 0) return query;
      addFilter('tagsAll', page => list.every(tag => (page.taxonomy.tags || []).includes(tag)));
      return query;
    },
    hasLocale(value) {
      addFilter('hasLocale', page => Boolean(page.i18n[value]));
      return query;
    },
    fallbackLocale() {
      state.allowFallback = true;
      return query;
    },
    sortByOrder() {
      state.sorter = (a, b) => {
        if (a.order.group !== b.order.group) return a.order.group - b.order.group;
        return a.order.page - b.order.page;
      };
      return query;
    },
    sortByTitle() {
      state.sorter = (a, b) => {
        const aEntry = resolveEntry(a, state.locale, state.allowFallback ? defaultLocale : undefined);
        const bEntry = resolveEntry(b, state.locale, state.allowFallback ? defaultLocale : undefined);
        return (aEntry?.data?.title || '').localeCompare(bEntry?.data?.title || '');
      };
      return query;
    },
    sort(keyOrFn, dir = 'asc') {
      if (typeof keyOrFn === 'function') {
        state.sorter = keyOrFn;
        return query;
      }
      const key = keyOrFn;
      state.sorter = (a, b) => {
        const aVal = getByPath(a, key);
        const bVal = getByPath(b, key);
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return dir === 'asc' ? -1 : 1;
        if (bVal == null) return dir === 'asc' ? 1 : -1;
        if (aVal < bVal) return dir === 'asc' ? -1 : 1;
        if (aVal > bVal) return dir === 'asc' ? 1 : -1;
        return 0;
      };
      return query;
    },
    limit(count) {
      const value = Math.max(0, Math.floor(count));
      state.limit = value;
      return query;
    },
    offset(count) {
      const value = Math.max(0, Math.floor(count));
      state.offset = value;
      return query;
    },
    transform(mappingOrFn) {
      if (typeof mappingOrFn === 'function') {
        state.transformer = mappingOrFn;
        return query;
      }
      const map = mappingOrFn;
      state.transformer = (row: any) => {
        const out: Record<string, any> = {};
        for (const [from, to] of Object.entries(map)) {
          out[to] = getByPath(row, from);
        }
        return out;
      };
      return query;
    },
    select(fields) {
      if (typeof fields === 'function') {
        state.selector = fields;
      } else {
        const keys = fields;
        state.selector = (row: any) => {
          const out: Record<string, any> = {};
          for (const key of keys) out[key] = getByPath(row, key);
          return out;
        };
      }
      return query;
    },
    debug(opts) {
      state.debug = opts || {};
      return query;
    },
    get() {
      const { rows, total } = resolveRows();
      logDebug(rows, total);

      const transformed = state.transformer ? rows.map(state.transformer) : rows;

      if (state.selector) {
        return transformed.map(state.selector);
      }

      return transformed;
    },
    first() {
      return query.get()[0] ?? null;
    },
    count() {
      return resolveRows().rows.length;
    },
    pluck(field) {
      return resolveRows()
        .rows.map(row => getByPath(row, field))
        .filter(v => v != null);
    },
  };

  return query;
}
