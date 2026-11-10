import path from 'node:path';
import builder from '../../.vitepress/settings/generated/builder/index.ts';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'docs');
const OUT_DIR = path.join(ROOT, '.vitepress', 'cache', 'gen');

function main() {
  const itemCount = builder.buildCmsCache(DOCS_DIR, OUT_DIR);
  console.log(`Generated ${itemCount} CMS items.`);
}

main();
