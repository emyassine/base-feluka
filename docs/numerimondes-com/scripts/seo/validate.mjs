import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cachePath = path.join(root, '.vitepress', 'cache', 'gen', 'cms-cache.json');

if (!fs.existsSync(cachePath)) {
  console.error(`SEO validation failed: missing cache at ${cachePath}`);
  process.exit(1);
}

const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
const locales = cache?.meta?.locales || [];
const pages = cache?.pages || {};

const errors = [];

const isNonEmptyString = v => typeof v === 'string' && v.trim().length > 0;
const isBoolean = v => typeof v === 'boolean';
const isDateLike = v => v instanceof Date || typeof v === 'string' || typeof v === 'number';

const hasMetaHead = head =>
  Array.isArray(head) &&
  head.some(entry => {
    if (!Array.isArray(entry) || entry.length < 2) return false;
    const [tag, attrs] = entry;
    if (tag !== 'meta' || !attrs || typeof attrs !== 'object') return false;
    return isNonEmptyString(attrs.name) && isNonEmptyString(attrs.content);
  });

const validateFrontmatter = (raw, ctx) => {
  const missing = [];
  const invalid = [];

  if (!raw || typeof raw !== 'object') {
    errors.push({ ...ctx, missing: ['frontmatter._raw (object)'], invalid: [] });
    return;
  }

  const reqString = ['title', 'description', 'pageClass'];
  for (const key of reqString) {
    if (raw[key] == null) missing.push(key);
    else if (!isNonEmptyString(raw[key])) invalid.push(key);
  }

  if (raw.titleTemplate == null) {
    missing.push('titleTemplate');
  } else if (!(typeof raw.titleTemplate === 'string' || typeof raw.titleTemplate === 'boolean')) {
    invalid.push('titleTemplate');
  }

  if (raw.layout != null && !['doc', 'home', 'page'].includes(raw.layout)) {
    invalid.push('layout');
  }

  const reqBool = ['navbar', 'sidebar', 'editLink', 'footer', 'isHome'];
  for (const key of reqBool) {
    if (raw[key] == null) missing.push(key);
    else if (!isBoolean(raw[key])) invalid.push(key);
  }

  if (raw.aside == null) {
    missing.push('aside');
  } else if (!(raw.aside === 'left' || typeof raw.aside === 'boolean')) {
    invalid.push('aside');
  }

  if (raw.outline == null) {
    missing.push('outline');
  } else {
    const okNumber = typeof raw.outline === 'number';
    const okTuple =
      Array.isArray(raw.outline) && raw.outline.length === 2 && raw.outline.every(n => typeof n === 'number');
    const okLiteral = raw.outline === 'deep' || raw.outline === false;
    if (!(okNumber || okTuple || okLiteral)) invalid.push('outline');
  }

  if (raw.lastUpdated == null) {
    missing.push('lastUpdated');
  } else if (!(isBoolean(raw.lastUpdated) || isDateLike(raw.lastUpdated))) {
    invalid.push('lastUpdated');
  }

  if (raw.head == null) {
    missing.push('head');
  } else if (!hasMetaHead(raw.head)) {
    invalid.push('head');
  }

  if (missing.length || invalid.length) {
    errors.push({ ...ctx, missing, invalid });
  }
};

const validateI18n = (entry, ctx) => {
  const missing = [];
  const invalid = [];

  const req = ['title', 'description', 'url', 'href', 'sourcePath'];
  for (const key of req) {
    if (entry?.[key] == null) missing.push(`i18n.${key}`);
    else if (!isNonEmptyString(entry[key])) invalid.push(`i18n.${key}`);
  }

  if (missing.length || invalid.length) {
    errors.push({ ...ctx, missing, invalid });
  }
};

const requireSidebarIndexTitle = (cache, locales) => {
  const pages = cache?.pages || {};
  const byDir = new Map();

  const getSourcePath = (page, locale) =>
    page?.source?.sourcePathByLocale?.[locale] || page?.i18n?.[locale]?.sourcePath || '';

  for (const page of Object.values(pages)) {
    for (const locale of locales) {
      const sourcePath = getSourcePath(page, locale);
      if (!sourcePath) continue;
      const dir = path.posix.dirname(sourcePath.replace(/\\/g, '/'));
      const key = `${locale}::${page.collection || 'unknown'}::${dir}`;
      if (!byDir.has(key)) byDir.set(key, []);
      byDir.get(key).push({ page, locale, sourcePath });
    }
  }

  for (const entries of byDir.values()) {
    if (entries.length <= 1) continue;
    const indexEntry = entries.find(e => e.page?.slug === '' || e.page?.source?.isIndex);
    if (!indexEntry) continue;
    const raw = indexEntry.page?.frontmatter?.byLocale?.[indexEntry.locale]?._raw || {};
    const sidebarIndexTitle = typeof raw.sidebarIndexTitle === 'string' ? raw.sidebarIndexTitle.trim() : '';
    if (!sidebarIndexTitle) {
      errors.push({
        pageId: indexEntry.page?.id,
        locale: indexEntry.locale,
        sourcePath: indexEntry.sourcePath,
        missing: ['sidebarIndexTitle'],
        invalid: [],
      });
    }
  }
};

for (const [pageId, page] of Object.entries(pages)) {
  const localesToCheck = Object.keys(page?.i18n || {});
  if (!localesToCheck.length) continue;
  for (const locale of localesToCheck) {
    const entry = page?.i18n?.[locale];
    const front = page?.frontmatter?.byLocale?.[locale];
    const raw = front?._raw;
    const ctx = {
      pageId,
      locale,
      sourcePath: entry?.sourcePath || front?.sourcePath || page?.source?.sourcePathByLocale?.[locale],
    };
    validateI18n(entry, ctx);
    validateFrontmatter(raw, ctx);
  }
}

requireSidebarIndexTitle(cache, locales);

if (errors.length) {
  const lines = errors.map(e => {
    const parts = [];
    if (e.missing?.length) parts.push(`missing: ${e.missing.join(', ')}`);
    if (e.invalid?.length) parts.push(`invalid: ${e.invalid.join(', ')}`);
    return `- ${e.pageId} [${e.locale}] ${e.sourcePath || ''} -> ${parts.join(' | ')}`.trim();
  });
  console.error(`SEO validation failed (${errors.length}):\n${lines.join('\n')}`);
  process.exit(1);
}

console.log('SEO validation passed.');
