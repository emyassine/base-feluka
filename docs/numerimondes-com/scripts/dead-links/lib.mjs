import fs from 'node:fs';
import path from 'node:path';

export function loadCmsCache(cwd) {
  const cachePath = path.join(cwd, '.vitepress', 'cache', 'gen', 'cms-cache.json');
  if (!fs.existsSync(cachePath)) return { cachePath, cache: null };
  const raw = fs.readFileSync(cachePath, 'utf8');
  return { cachePath, cache: JSON.parse(raw) };
}

function normalizeUrl(input) {
  if (typeof input !== 'string') return '';
  let url = input.trim();
  if (!url.startsWith('/')) return '';
  url = url.replace(/\.md$/i, '');
  url = url.replace(/\/index\/?$/i, '/');
  if (url.length > 1) url = url.replace(/\/+$/g, '');
  return url;
}

export function buildValidUrlSet(cache) {
  const urls = new Set();
  const normalized = new Set();
  if (!cache?.pages) return { urls, normalized };
  for (const page of Object.values(cache.pages)) {
    const i18n = page?.i18n || {};
    for (const locale of Object.keys(i18n)) {
      const url = i18n[locale]?.url;
      if (!url) continue;
      urls.add(url);
      normalized.add(normalizeUrl(url));
      if (!url.endsWith('/')) {
        urls.add(`${url}/`);
        normalized.add(normalizeUrl(`${url}/`));
      }
    }
  }
  return { urls, normalized };
}

export function listMarkdownFiles(roots) {
  const files = [];
  const rootList = Array.isArray(roots) ? roots : [roots];
  const stack = rootList.filter(root => fs.existsSync(root));
  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      if (entry.name === 'node_modules') continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(full);
      }
    }
  }
  return files;
}

function isInternalLink(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('//')) return false;
  if (!url.startsWith('/')) return false;
  if (url.startsWith('/@')) return false;
  return true;
}

export function extractLinks(content) {
  const links = [];
  const mdLink = /\[([^\]]*?)\]\(([^)]+)\)/g;
  const hrefDouble = /href\s*=\s*"([^"]+)"/g;
  const hrefSingle = /href\s*=\s*'([^']+)'/g;

  let match;
  while ((match = mdLink.exec(content))) {
    const text = match[1];
    const url = match[2];
    links.push({ type: 'md', text, url, full: match[0] });
  }
  while ((match = hrefDouble.exec(content))) {
    links.push({ type: 'href', url: match[1], full: match[0] });
  }
  while ((match = hrefSingle.exec(content))) {
    links.push({ type: 'href', url: match[1], full: match[0] });
  }

  return links.filter(link => isInternalLink(link.url));
}

export function findDeadLinks(files, validNormalized) {
  const dead = new Map();
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const links = extractLinks(content);
    for (const link of links) {
      const normalized = normalizeUrl(link.url);
      const isValid = normalized && validNormalized.has(normalized);
      if (isValid) continue;
      const key = normalized || link.url;
      if (!key) continue;
      if (!dead.has(key)) dead.set(key, { urls: new Set(), occurrences: [] });
      const entry = dead.get(key);
      entry.urls.add(link.url);
      entry.occurrences.push({ file, ...link });
    }
  }
  return dead;
}

export function buildSlugIndex(cache) {
  const map = new Map();
  if (!cache?.pages) return map;
  for (const page of Object.values(cache.pages)) {
    const i18n = page?.i18n || {};
    for (const locale of Object.keys(i18n)) {
      const url = i18n[locale]?.url;
      if (!url) continue;
      const parts = url.split('/').filter(Boolean);
      const slug = parts[parts.length - 1] || '';
      if (!slug) continue;
      if (!map.has(slug)) map.set(slug, []);
      map.get(slug).push(url);
    }
  }
  return map;
}

export function suggestRewrites(link, slugIndex) {
  const clean = link.replace(/\?.*$/, '');
  const parts = clean.split('/').filter(Boolean);
  let slug = parts[parts.length - 1] || '';
  if (slug === 'index' && parts.length > 1) slug = parts[parts.length - 2];
  if (!slug) return [];
  const urls = slugIndex.get(slug) || [];
  return Array.from(new Set(urls)).slice(0, 5);
}

export function applyRewrite(content, oldUrl, newUrl) {
  const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const md = new RegExp(`\\]\\(${escaped}\\)`, 'g');
  const hrefDouble = new RegExp(`href\\s*=\\s*\"${escaped}\"`, 'g');
  const hrefSingle = new RegExp(`href\\s*=\\s*'${escaped}'`, 'g');
  let out = content.replace(md, `](${newUrl})`);
  out = out.replace(hrefDouble, `href="${newUrl}"`);
  out = out.replace(hrefSingle, `href='${newUrl}'`);
  return out;
}

export function applyRemove(content, oldUrl) {
  const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const md = new RegExp(`\\[([^\\]]*?)\\]\\(${escaped}\\)`, 'g');
  const html = new RegExp(`<a\\s+[^>]*?href\\s*=\\s*['\"]${escaped}['\"][^>]*?>(.*?)<\\/a>`, 'g');
  let out = content.replace(md, '$1');
  out = out.replace(html, '$1');
  return out;
}

export function linkToDocPaths(link, locales, defaultLocale) {
  const clean = link.replace(/\?.*$/, '').replace(/\.md$/i, '');
  const parts = clean.split('/').filter(Boolean);
  if (!parts.length) return [];
  const first = parts[0];
  const hasLocale = locales.includes(first);
  const rest = hasLocale ? parts.slice(1) : parts;
  const fileBase = rest[rest.length - 1] === 'index' ? 'index' : rest[rest.length - 1];
  const dirParts = rest[rest.length - 1] === 'index' ? rest.slice(0, -1) : rest.slice(0, -1);
  const out = [];
  const targets = hasLocale ? [first] : locales;
  for (const locale of targets) {
    const filename = fileBase === 'index' ? `index-${locale}.md` : `${fileBase}-${locale}.md`;
    const rel = path.join('docs', ...dirParts, filename);
    out.push({ locale, path: rel });
  }
  if (!hasLocale && !targets.includes(defaultLocale)) {
    const filename = fileBase === 'index' ? `index-${defaultLocale}.md` : `${fileBase}-${defaultLocale}.md`;
    const rel = path.join('docs', ...dirParts, filename);
    out.push({ locale: defaultLocale, path: rel });
  }
  return out;
}

export function writeStubFiles(cwd, link, cache) {
  const locales = cache?.meta?.locales || ['en'];
  const defaultLocale = cache?.meta?.defaultLocale || locales[0] || 'en';
  const targets = linkToDocPaths(link, locales, defaultLocale);
  const created = [];
  for (const target of targets) {
    const abs = path.join(cwd, target.path);
    if (fs.existsSync(abs)) continue;
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    const title = link.split('/').filter(Boolean).slice(-1)[0] || 'Untitled';
    const content = `---\ntitle: ${title}\ndescription: \n---\n\n# ${title}\n`;
    fs.writeFileSync(abs, content, 'utf8');
    created.push(target.path);
  }
  return created;
}

export function saveReport(cwd, report) {
  const reportDir = path.join(cwd, '.vitepress', 'cache', 'gen');
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, 'dead-links-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  return reportPath;
}

export function loadReport(cwd) {
  const reportPath = path.join(cwd, '.vitepress', 'cache', 'gen', 'dead-links-report.json');
  if (!fs.existsSync(reportPath)) return null;
  return JSON.parse(fs.readFileSync(reportPath, 'utf8'));
}

export function buildReport(deadMap) {
  const items = [];
  for (const [key, data] of deadMap.entries()) {
    const urls = Array.from(data.urls || []);
    const occurrences = data.occurrences || [];
    items.push({
      key,
      urls,
      count: occurrences.length,
      occurrences,
    });
  }
  items.sort((a, b) => b.count - a.count);
  return { total: items.length, items };
}
