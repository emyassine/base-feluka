import fs from 'node:fs';
import path from 'node:path';
import { seoDefaults, seoFake } from './defaults.mjs';

const root = process.cwd();
const docsDir = path.join(root, 'docs');

const REQUIRED_KEYS = [
  'title',
  'titleTemplate',
  'description',
  'date',
  'head',
  'navbar',
  'sidebar',
  'aside',
  'outline',
  'lastUpdated',
  'editLink',
  'footer',
  'pageClass',
  'isHome',
];

const REQUIRED_DOC_META_KEYS = [
  'docTitle',
  'docSubTitle',
  'thumbnail',
  'tags',
  'audience',
  'type',
  'icon',
  'image',
  'draft',
  'order',
  'group',
];

const isMd = file => file.endsWith('.md');
const INDEX_TITLE_BY_LOCALE = { en: 'Overview', fr: 'Aperçu' };

const getLocaleFromFile = file => {
  const m = path.basename(file).match(/-([a-z]{2})\.md$/);
  return m ? m[1] : null;
};

const isIndexFile = file => {
  const base = path.basename(file, '.md');
  return base === 'index' || base.startsWith('index-');
};

const walk = dir => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(abs));
      continue;
    }
    if (entry.isFile() && isMd(entry.name)) out.push(abs);
  }
  return out;
};

const splitFrontmatter = content => {
  if (!content.startsWith('---')) return { fm: '', body: content, has: false };
  const endIndex = content.indexOf('\n---', 3);
  if (endIndex === -1) return { fm: '', body: content, has: false };
  const fm = content.slice(3, endIndex).trimEnd();
  const body = content.slice(endIndex + 4).replace(/^\s*\n/, '');
  return { fm, body, has: true };
};

const extractTitle = body => {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
};

const yamlScalar = value => {
  if (value === undefined) return '';
  if (value === null) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return `[${value.join(', ')}]`;
  return JSON.stringify(String(value));
};

const ensureHeadBlock = (desc, existing) => {
  if (existing) return null;
  const head = seoDefaults.head(desc);
  const lines = ['head:'];
  for (const entry of head) {
    if (!Array.isArray(entry) || entry.length < 2) continue;
    const [tag, attrs] = entry;
    lines.push(`  - - ${tag}`);
    lines.push(`    - name: ${yamlScalar(attrs.name)}`);
    lines.push(`      content: ${yamlScalar(attrs.content)}`);
  }
  return lines.join('\n');
};

const computeDefaults = (titleFallback, descFallback) => ({
  title: seoDefaults.i18n.title(titleFallback || 'Untitled'),
  description: seoDefaults.i18n.description(descFallback || titleFallback || 'TODO: add description'),
  date: seoDefaults.i18n.date(),
  titleTemplate: seoDefaults.titleTemplate,
  navbar: seoDefaults.navbar,
  sidebar: seoDefaults.sidebar,
  aside: seoDefaults.aside,
  outline: seoDefaults.outline,
  lastUpdated: seoDefaults.lastUpdated,
  editLink: seoDefaults.editLink,
  footer: seoDefaults.footer,
  pageClass: seoDefaults.pageClass,
  isHome: seoDefaults.isHome,
  docTitle: seoDefaults.docMeta.docTitle(titleFallback || ''),
  docSubTitle: seoDefaults.docMeta.docSubTitle(descFallback || ''),
  thumbnail: seoDefaults.docMeta.thumbnail(),
  tags: seoDefaults.docMeta.tags(),
  audience: seoDefaults.docMeta.audience(),
  type: seoDefaults.docMeta.type(),
  icon: seoDefaults.docMeta.icon(),
  image: seoDefaults.docMeta.image(),
  draft: seoDefaults.docMeta.draft(),
  order: seoDefaults.docMeta.order(),
  group: seoDefaults.docMeta.group(),
});

const buildMissingLines = (missingKeys, values, hasHead) => {
  const lines = [];
  for (const key of REQUIRED_KEYS) {
    if (!missingKeys.has(key) || key === 'head') continue;
    const value = values[key];
    if (value === undefined) lines.push(`${key}:`);
    else lines.push(`${key}: ${yamlScalar(value)}`);
  }
  for (const key of REQUIRED_DOC_META_KEYS) {
    if (!missingKeys.has(key)) continue;
    const value = values[key];
    if (value === undefined) lines.push(`${key}:`);
    else lines.push(`${key}: ${yamlScalar(value)}`);
  }
  if (missingKeys.has('head')) {
    const headBlock = ensureHeadBlock(values.description, hasHead);
    if (headBlock) lines.push(headBlock);
  }
  return lines;
};

if (!fs.existsSync(docsDir)) {
  console.error(`SEO apply failed: docs dir not found at ${docsDir}`);
  process.exit(1);
}

const files = walk(docsDir);
const dirStats = new Map();
const indexByDir = new Map();

for (const file of files) {
  const locale = getLocaleFromFile(file);
  if (!locale) continue;
  const relDir = path.relative(docsDir, path.dirname(file)).replace(/\\/g, '/');
  const key = `${locale}::${relDir}`;
  dirStats.set(key, (dirStats.get(key) || 0) + 1);
  if (isIndexFile(file)) indexByDir.set(key, file);
}

let updated = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const { fm, body, has } = splitFrontmatter(content);
  const fmLines = fm ? fm.split(/\r?\n/) : [];
  const cleanedFmLines = fmLines.filter(line => !/^layout:\s*"?undefined"?\s*$/i.test(line.trim()));
  const presentKeys = new Set();
  const locale = getLocaleFromFile(file);
  const relDir = path.relative(docsDir, path.dirname(file)).replace(/\\/g, '/');
  const dirKey = locale ? `${locale}::${relDir}` : null;
  const needsSidebarIndexTitle =
    !!dirKey && isIndexFile(file) && indexByDir.has(dirKey) && (dirStats.get(dirKey) || 0) > 1;

  for (const line of cleanedFmLines) {
    const match = line.match(/^([A-Za-z0-9_]+):/);
    if (match) presentKeys.add(match[1]);
  }

  const missingKeys = new Set([
    ...REQUIRED_KEYS.filter(k => !presentKeys.has(k)),
    ...REQUIRED_DOC_META_KEYS.filter(k => !presentKeys.has(k)),
  ]);
  if (
    missingKeys.size === 0 &&
    cleanedFmLines.length === fmLines.length &&
    (!needsSidebarIndexTitle || presentKeys.has('sidebarIndexTitle'))
  )
    continue;

  const headingTitle = extractTitle(body);
  const baseName = path.basename(file, '.md');
  const titleFallback = headingTitle || baseName;
  const defaults = computeDefaults(titleFallback, titleFallback);

  const newLines = buildMissingLines(missingKeys, defaults, presentKeys.has('head'));
  if (needsSidebarIndexTitle && !presentKeys.has('sidebarIndexTitle')) {
    const defaultIndexTitle = (locale && INDEX_TITLE_BY_LOCALE[locale]) || 'Overview';
    newLines.push(`sidebarIndexTitle: ${yamlScalar(defaultIndexTitle)}`);
  }
  if (newLines.length === 0) continue;

  const nextFm = cleanedFmLines.length ? `${cleanedFmLines.join('\n')}\n${newLines.join('\n')}` : newLines.join('\n');
  const next = `---\n${nextFm}\n---\n\n${body}`;

  if (next !== content) {
    fs.writeFileSync(file, next, 'utf8');
    updated += 1;
  }
}

console.log(`SEO apply: updated ${updated} file(s).`);
