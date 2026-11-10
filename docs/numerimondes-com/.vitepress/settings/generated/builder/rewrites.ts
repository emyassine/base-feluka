import fs from 'node:fs';
import path from 'node:path';
import { getActiveLanguages, getDefaultLanguage } from '../../static/i18n';

type MinimalItem = { sourcePath: string; url: string };

export function buildRewrites(items: MinimalItem[], docsDir: string): Record<string, string> {
  const rewrites: Record<string, string> = {};
  const usedTargets = new Map<string, string>();

  for (const item of items) {
    const from = item.sourcePath;
    const to = item.url.replace(/^\//, '').replace(/\/$/, '') + '.md';

    rewrites[from] = to;

    if (usedTargets.has(to) && usedTargets.get(to) !== from) {
      console.warn(`Duplicate rewrite target: ${to} from ${from} and ${usedTargets.get(to)}`);
    }

    usedTargets.set(to, from);
  }

  const activeLocales = getActiveLanguages();
  const indexLocales = activeLocales.length ? activeLocales : [getDefaultLanguage()];

  for (const locale of indexLocales) {
    const prefix = `${locale}/`;

    const rootIndex = `index-${locale}.md`;
    if (fs.existsSync(path.join(docsDir, rootIndex))) {
      rewrites[rootIndex] = `${prefix}index.md`;
    }

    const guidesIndex = `guides/index-${locale}.md`;
    if (fs.existsSync(path.join(docsDir, guidesIndex))) {
      rewrites[guidesIndex] = `${prefix}guides/index.md`;
    }
  }

  return rewrites;
}
