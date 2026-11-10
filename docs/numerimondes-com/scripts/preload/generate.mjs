import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const outputDir = path.join(root, '.vitepress', 'cache', 'gen', 'html');
const outputFile = path.join(outputDir, 'head_start.preload.html');

const baseEnv = process.env.BASE ?? '/';
const base = baseEnv.endsWith('/') ? baseEnv : `${baseEnv}/`;

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif', '.apng']);
const VIDEO_EXT = new Set(['.mp4', '.webm', '.ogv', '.mov']);
const AUDIO_EXT = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac']);

const MIME_BY_EXT = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.apng': 'image/apng',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogv': 'video/ogg',
  '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.flac': 'audio/flac',
};

const SCAN_EXTS = new Set(['.md', '.vue', '.html']);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
      continue;
    }
    if (entry.isFile()) out.push(full);
  }
  return out;
}

function toPosix(p) {
  return p.replace(/\\/g, '/');
}

function asTypeFromUrl(url) {
  const ext = path.extname(url.split('?')[0].split('#')[0]).toLowerCase();
  if (IMAGE_EXT.has(ext)) return { as: 'image', type: MIME_BY_EXT[ext] };
  if (VIDEO_EXT.has(ext)) return { as: 'video', type: MIME_BY_EXT[ext] };
  if (AUDIO_EXT.has(ext)) return { as: 'audio', type: MIME_BY_EXT[ext] };
  return null;
}

function normalizeHref(src) {
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  if (src.startsWith('/')) return `${base}${src.replace(/^\//, '')}`;
  return null;
}

function collectPublicMedia() {
  const files = walk(publicDir);
  const links = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    let as = '';
    if (IMAGE_EXT.has(ext)) as = 'image';
    else if (VIDEO_EXT.has(ext)) as = 'video';
    else if (AUDIO_EXT.has(ext)) as = 'audio';
    else continue;

    const rel = toPosix(path.relative(publicDir, file));
    const href = `${base}${rel}`;
    const type = MIME_BY_EXT[ext] ? ` type=\"${MIME_BY_EXT[ext]}\"` : '';
    links.push(`<link rel=\"preload\" href=\"${href}\" as=\"${as}\"${type}>`);
  }

  return links;
}

function extractMediaFromSource() {
  const roots = [path.join(root, 'docs'), path.join(root, 'imports')];
  const urls = new Set();

  for (const dir of roots) {
    for (const file of walk(dir)) {
      if (!SCAN_EXTS.has(path.extname(file))) continue;
      const content = fs.readFileSync(file, 'utf8');

      const mdImage = /!\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g;
      let match = null;
      while ((match = mdImage.exec(content))) {
        const src = match[1].trim();
        urls.add(src);
      }

      const htmlSrc = /<(img|source|video|audio)[^>]+?\s(src|poster)=(["'])(.*?)\3/gi;
      while ((match = htmlSrc.exec(content))) {
        const src = match[4].trim();
        urls.add(src);
      }

      const ndsImg = /<NDSImg[^>]+?\ssrc=(["'])(.*?)\1/gi;
      while ((match = ndsImg.exec(content))) {
        const src = match[2].trim();
        urls.add(src);
      }
    }
  }

  return Array.from(urls);
}

function buildMediaPreloads() {
  const urls = extractMediaFromSource();
  const links = [];
  for (const url of urls) {
    const href = normalizeHref(url);
    if (!href) continue;
    const info = asTypeFromUrl(url);
    if (info) {
      const type = info.type ? ` type=\"${info.type}\"` : '';
      links.push(`<link rel=\"preload\" href=\"${href}\" as=\"${info.as}\"${type}>`);
      continue;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      links.push(`<link rel=\"preload\" href=\"${href}\" as=\"image\">`);
    }
  }
  return links;
}

function extractIframeSrcs() {
  const roots = [path.join(root, 'docs'), path.join(root, 'imports')];
  const srcs = new Set();

  for (const dir of roots) {
    for (const file of walk(dir)) {
      if (!SCAN_EXTS.has(path.extname(file))) continue;
      const content = fs.readFileSync(file, 'utf8');
      const regex = /<iframe[^>]+?\s([:@]?src|v-bind:src)=(['"])(.*?)\2/gi;
      let match = null;
      while ((match = regex.exec(content))) {
        const attr = match[1];
        if (attr !== 'src') continue;
        const src = match[3].trim();
        if (!src || src.startsWith('javascript:') || src.startsWith('#')) continue;
        srcs.add(src);
      }
    }
  }

  return Array.from(srcs);
}

function buildIframePreloads() {
  const srcs = extractIframeSrcs();
  const links = [];

  for (const src of srcs) {
    const href = normalizeHref(src) ?? src;
    links.push(`<link rel=\"preload\" href=\"${href}\" as=\"document\">`);
  }

  return links;
}

function uniqueLines(lines) {
  return Array.from(new Set(lines)).sort((a, b) => a.localeCompare(b));
}

function buildOutput() {
  const parts = [];
  parts.push('<!-- Auto-generated. Do not edit. -->');
  parts.push(...collectPublicMedia());
  parts.push(...buildMediaPreloads());
  parts.push(...buildIframePreloads());
  return `${uniqueLines(parts).join('\n')}\n`;
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, buildOutput(), 'utf8');
