export type CmsMeta = {
  generatedAt: string;
  locales: string[];
  defaultLocale: string;
  sourceRoot: string;
  contentRoots: string[];
  generator?: {
    name: string;
    build?: string;
    gitSha?: string;
  };
};

export type CmsCollection = {
  label: Record<string, string>;
  rootDir: string;
  defaultGroup?: string;
};

export type CmsGroup = {
  collection: string;
  order: number;
  label: Record<string, string>;
  dir: string;
  slug: string;
  nav: { showInNavbar: boolean; navbarOrder: number };
};

export type CmsI18nEntry = {
  title: string;
  description: string | null;
  url: string;
  href: string;
  sourcePath: string;
  editUrl?: string;
  head?: {
    image?: string;
    keywords?: string[];
  };
};

export type CmsPage = {
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
  taxonomy: {
    type?: string;
    tags?: string[];
    audience?: string[];
  };
  frontmatter: {
    shared: Record<string, any>;
    byLocale: Record<string, Record<string, any>>;
  };
  assets: {
    thumbnailByLocale: Record<string, string | null>;
  };
  legacy: Record<string, string>;
  i18n: Record<string, CmsI18nEntry>;
};

export type CmsCache = {
  version: string;
  meta: CmsMeta;
  collections: Record<string, CmsCollection>;
  groups: Record<string, CmsGroup>;
  pages: Record<string, CmsPage>;
  navigation: any;
  rewrites: Record<string, string>;
  rewritesById?: Record<string, Record<string, string>>;
  indexes: {
    byId: Record<string, boolean>;
    bySourcePath: Record<string, string>;
    byUrl: Record<string, string>;
    byLegacyId: Record<string, string>;
    byCollection: Record<string, string[]>;
    byGroup: Record<string, string[]>;
    byDir: Record<string, string[]>;
    byTag: Record<string, string[]>;
    byType: Record<string, string[]>;
  };
};

export type InsightItem = {
  id: string;
  title: string;
  description?: string | null;
  href: string;
  collection?: string;
  group?: string;
  slug?: string;
  order?: { group?: number; page?: number };
  thumbnail?: string | null;
  tags?: string[];
  type?: string;
  meta?: Record<string, any>;
};

export type CmsQuery = {
  inCollection: (key: string) => CmsQuery;
  inGroup: (key: string) => CmsQuery;
  inPath: (dir: string) => CmsQuery;
  onlyIndex: () => CmsQuery;
  noIndex: () => CmsQuery;
  depth: (n: number | '*') => CmsQuery;
  ifDirectoryContains: (seg: string) => CmsQuery;
  ifPathIncludes: (str: string) => CmsQuery;
  ifSlugStartsWith: (prefix: string) => CmsQuery;
  type: (value: string) => CmsQuery;
  tag: (value: string) => CmsQuery;
  tagsAny: (values: string[] | string) => CmsQuery;
  tagsAll: (values: string[] | string) => CmsQuery;
  hasLocale: (value: string) => CmsQuery;
  fallbackLocale: () => CmsQuery;
  sortByOrder: () => CmsQuery;
  sortByTitle: () => CmsQuery;
  sort: (keyOrFn: string | ((a: any, b: any) => number), dir?: 'asc' | 'desc') => CmsQuery;
  limit: (count: number) => CmsQuery;
  offset: (count: number) => CmsQuery;
  transform: (mappingOrFn: Record<string, string> | ((row: any) => any)) => CmsQuery;
  select: (fields: string[] | ((row: any) => any)) => CmsQuery;
  debug: (opts?: {
    label?: string;
    sample?: number;
    include?: Array<'id' | 'slug' | 'group' | 'collection' | 'order' | 'source' | 'taxonomy' | 'i18n' | 'assets'>;
  }) => CmsQuery;
  get: () => any[];
  first: () => any | null;
  count: () => number;
  pluck: (field: string) => any[];
};
