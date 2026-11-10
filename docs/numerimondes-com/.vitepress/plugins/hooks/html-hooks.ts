import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const HOOKS_DIR = path.resolve('.vitepress/cache/gen/html');
const CSS_DIR = path.resolve('imports/css');

const HOOK_FILES = {
  head_start: 'head_start.html',
  head_end: 'head_end.html',
  body_before: 'body_before.html',
  body_start: 'body_start.html',
  body_end: 'body_end.html',
  content_before: 'content_before.html',
  content_start: 'content_start.html',
  content_end: 'content_end.html',
  content_after: 'content_after.html',
  footer: 'footer.html',
} as const;

function readHook(name: keyof typeof HOOK_FILES): string | null {
  if (!fs.existsSync(HOOKS_DIR)) return null;

  const files = fs
    .readdirSync(HOOKS_DIR, { withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .filter(file => file.startsWith(name) && file.endsWith('.html'))
    .sort((a, b) => a.localeCompare(b));

  if (!files.length) return null;

  return files.map(file => fs.readFileSync(path.join(HOOKS_DIR, file), 'utf8')).join('\n');
}

function wrapHook(name: keyof typeof HOOK_FILES, content: string | null): string {
  if (content === null) return '';
  return `<!----[START-HOOK//${name}]---->${content}<!----[END-HOOK//${name}]---->`;
}

function listCssFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listCssFiles(full));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.css')) {
      files.push(full);
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function buildInlineCss(): string {
  const files = listCssFiles(CSS_DIR);
  if (!files.length) return '';

  const parts = files.map(file => {
    const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    return `/* ${rel} */\n${content}`;
  });

  return `<style>\n${parts.join('\n')}\n</style>`;
}

function injectAfter(html: string, pattern: RegExp, injection: string): string {
  if (!injection) return html;
  let injected = false;
  const out = html.replace(pattern, match => {
    injected = true;
    return `${match}${injection}`;
  });
  return injected ? out : html;
}

function injectBefore(html: string, pattern: RegExp, injection: string): string {
  if (!injection) return html;
  let injected = false;
  const out = html.replace(pattern, match => {
    injected = true;
    return `${injection}${match}`;
  });
  return injected ? out : html;
}

export function applyHtmlHooks(html: string): string {
  const inlineCss = buildInlineCss();
  const headStartContent = [inlineCss, readHook('head_start')].filter(Boolean).join('\n');
  const headStart = wrapHook('head_start', headStartContent);
  const headEnd = wrapHook('head_end', readHook('head_end'));
  const bodyBefore = wrapHook('body_before', readHook('body_before'));
  const bodyStart = wrapHook('body_start', readHook('body_start'));
  const bodyEnd = wrapHook('body_end', readHook('body_end'));
  const contentBefore = wrapHook('content_before', readHook('content_before'));
  const contentStart = wrapHook('content_start', readHook('content_start'));
  const contentEnd = wrapHook('content_end', readHook('content_end'));
  const contentAfter = wrapHook('content_after', readHook('content_after'));
  const footer = wrapHook('footer', readHook('footer'));

  let out = html;

  out = injectAfter(out, /<head[^>]*>/i, headStart);
  out = injectBefore(out, /<\/head>/i, headEnd);

  out = injectBefore(out, /<body[^>]*>/i, bodyBefore);
  out = injectAfter(out, /<body[^>]*>/i, bodyStart);

  out = injectBefore(out, /<main[^>]*>/i, contentBefore);
  out = injectAfter(out, /<main[^>]*>/i, contentStart);
  out = injectBefore(out, /<\/main>/i, contentEnd);
  out = injectAfter(out, /<\/main>/i, contentAfter);

  if (footer) {
    const next = injectBefore(out, /<\/footer>/i, footer);
    out = next === out ? injectBefore(out, /<\/body>/i, footer) : next;
  }

  out = injectBefore(out, /<\/body>/i, bodyEnd);

  return out;
}

export function htmlHooksPlugin(): Plugin {
  return {
    name: 'html-hooks',
    enforce: 'post',
    transformIndexHtml(html) {
      return applyHtmlHooks(html);
    },
  };
}
