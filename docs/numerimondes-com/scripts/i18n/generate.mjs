import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'docs');
const OUT_DIR = path.join(ROOT, '.vitepress', 'cache', 'gen', 'i18n');
const I18N_CONFIG_PATH = path.join(ROOT, '.vitepress', 'settings', 'static', 'i18n', 'index.ts');

const EXCLUDE_DIRS = new Set(['public']);
const EXCLUDE_PREFIXES = ['.', '_'];

const BASE_ENV = process.env.BASE ?? '/';
const BASE = BASE_ENV.endsWith('/') ? BASE_ENV : `${BASE_ENV}/`;

function readI18nConfig() {
  const raw = fs.readFileSync(I18N_CONFIG_PATH, 'utf8');
  const localesMatch = raw.match(/locales:\s*\[([^\]]+)\]/);
  const defaultMatch = raw.match(/defaultLocale:\s*'([^']+)'/);

  const locales = (localesMatch?.[1] || '')
    .split(',')
    .map(value => value.replace(/['"`]/g, '').trim().toLowerCase())
    .filter(Boolean);

  const defaultLocale = (defaultMatch?.[1] || '').trim().toLowerCase();

  return { locales, defaultLocale };
}

const { locales: LOCALES, defaultLocale: DEFAULT_LOCALE } = readI18nConfig();

if (!LOCALES.length) {
  throw new Error(`i18n: no locales found in ${I18N_CONFIG_PATH}`);
}

function isExcludedName(name) {
  return EXCLUDE_PREFIXES.some(prefix => name.startsWith(prefix));
}

function isMarkdown(fileName) {
  return fileName.toLowerCase().endsWith('.md');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function stripNumericPrefix(name) {
  return name.replace(/^\d+-/, '');
}

function stripLocaleSuffix(fileName) {
  return fileName.replace(/-([a-z]{2})\.md$/i, '.md');
}

function mapRelativePath(relPath) {
  const segments = relPath.split(path.sep).map((seg, idx, arr) => {
    if (idx === arr.length - 1 && isMarkdown(seg)) {
      const cleaned = stripLocaleSuffix(seg);
      return stripNumericPrefix(cleaned);
    }
    return stripNumericPrefix(seg);
  });
  return path.join(...segments);
}

function isExternalLink(link) {
  return (
    link.startsWith('http://') ||
    link.startsWith('https://') ||
    link.startsWith('mailto:') ||
    link.startsWith('tel:') ||
    link.startsWith('#')
  );
}

function hasLocalePrefix(link) {
  return LOCALES.some(locale => link === `/${locale}` || link.startsWith(`/${locale}/`));
}

function splitLinkSuffix(link) {
  const queryIndex = link.indexOf('?');
  const hashIndex = link.indexOf('#');
  const cut = Math.min(...[queryIndex, hashIndex].filter(n => n >= 0), link.length);
  return {
    path: link.slice(0, cut),
    suffix: link.slice(cut),
  };
}

function normalizeLinkPath(linkPath) {
  const parts = linkPath.split('/');
  const lastIndex = parts.length - 1;

  const mapped = parts.map((seg, idx) => {
    if (!seg || seg === '.' || seg === '..') return seg;
    if (idx === lastIndex) {
      let cleaned = stripLocaleSuffix(seg);
      cleaned = stripNumericPrefix(cleaned);
      cleaned = cleaned.replace(/\.md$/i, '');
      return cleaned;
    }
    return stripNumericPrefix(seg);
  });

  let joined = mapped.join('/');
  joined = joined.replace(/\/index$/, '/');
  return joined;
}

function rewriteLinkTarget(link, locale) {
  if (isExternalLink(link)) return link;

  const { path: linkPath, suffix } = splitLinkSuffix(link);
  let normalized = normalizeLinkPath(linkPath);

  if (normalized.startsWith('/')) {
    if (!hasLocalePrefix(normalized)) {
      normalized = normalized === '/' ? `/${locale}/` : `/${locale}${normalized}`;
    }
  }

  return `${normalized}${suffix}`;
}

function rewriteLinks(content, locale) {
  return content.replace(/\\]\\(([^)]+)\\)/g, (match, rawLink) => {
    const [link, ...rest] = rawLink.split(/\\s+/);
    const rewritten = rewriteLinkTarget(link, locale);
    if (!rest.length) return match.replace(rawLink, rewritten);
    return match.replace(rawLink, `${rewritten} ${rest.join(' ')}`);
  });
}

function withBasePath(url) {
  if (!url || BASE === '/') return url;
  if (!url.startsWith('/')) return url;
  if (url.startsWith('//')) return url;
  if (url.startsWith(BASE)) return url;
  return `${BASE}${url.replace(/^\//, '')}`;
}

function prefixAbsoluteLinks(content) {
  if (BASE === '/') return content;

  let next = content;

  // HTML/Vue attributes.
  next = next.replace(
    /(\b(?:src|href|poster|avatar|image|img|data-src|data-href|data-image|background|bg)=)(["'])(\/[^"']*)(\2)/g,
    (match, prefix, quote, url, suffix) => `${prefix}${quote}${withBasePath(url)}${suffix}`
  );

  // JS object string values inside templates/MD (e.g. href: '/about')
  next = next.replace(
    /(\b(?:href|src|avatar|image|poster|thumbnail|icon)\s*:\s*)(['"])(\/[^'"]*)(\2)/g,
    (match, prefix, quote, url, suffix) => `${prefix}${quote}${withBasePath(url)}${suffix}`
  );

  return next;
}

function writeRootRedirect() {
  const content = `---
title: Redirecting...
---

<script setup>
import { onMounted } from 'vue';
import { withBase } from 'vitepress';

onMounted(() => {
  const target = withBase('/${DEFAULT_LOCALE}/');
  if (window.location.pathname !== target) {
    window.location.replace(target);
  }
});
</script>

Redirecting to the default language...
`;
  ensureDir(OUT_DIR);
  fs.writeFileSync(path.join(OUT_DIR, 'index.md'), content, 'utf8');
}

function copyToLocale(srcPath, relPath, locale) {
  const destPath = path.join(OUT_DIR, locale, mapRelativePath(relPath));
  ensureDir(path.dirname(destPath));
  fs.copyFileSync(srcPath, destPath);
}

const ignoredMarkdown = [];
const writeCounts = Object.fromEntries(LOCALES.map(locale => [locale, 0]));

function processFile(filePath, srcDir) {
  const relPath = path.relative(srcDir, filePath);
  const fileName = path.basename(filePath);

  if (!isMarkdown(fileName)) {
    for (const locale of LOCALES) {
      copyToLocale(filePath, relPath, locale);
    }
    return;
  }

  const match = /^(.+)-([a-z]{2})\.md$/i.exec(fileName);
  if (match) {
    const lang = match[2].toLowerCase();
    if (!LOCALES.includes(lang)) return;

    const relDir = path.dirname(relPath);
    const baseName = `${match[1]}.md`;
    const targetRelPath = path.join(relDir, baseName);
    const raw = fs.readFileSync(filePath, 'utf8');
    const rewritten = prefixAbsoluteLinks(rewriteLinks(raw, lang));
    const destPath = path.join(OUT_DIR, lang, mapRelativePath(targetRelPath));
    ensureDir(path.dirname(destPath));
    fs.writeFileSync(destPath, rewritten, 'utf8');
    writeCounts[lang] = (writeCounts[lang] || 0) + 1;
    return;
  }

  ignoredMarkdown.push(relPath);
}

function walk(dirPath, srcDir) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (isExcludedName(entry.name)) continue;
    if (entry.isDirectory() && EXCLUDE_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, srcDir);
    } else if (entry.isFile()) {
      processFile(fullPath, srcDir);
    }
  }
}

fs.rmSync(OUT_DIR, { recursive: true, force: true });
writeRootRedirect();

if (fs.existsSync(DOCS_DIR)) {
  walk(DOCS_DIR, DOCS_DIR);
}

if (ignoredMarkdown.length > 0) {
  console.warn('i18n: ignored markdown without language suffix:');
  for (const file of ignoredMarkdown) {
    console.warn(`- ${file}`);
  }
}

console.log(`i18n generated: ${OUT_DIR}`);
console.log('i18n: generated markdown per locale:', writeCounts);
