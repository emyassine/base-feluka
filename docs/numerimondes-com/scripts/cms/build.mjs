import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const ROOT = process.cwd();
const ENTRY = path.join(ROOT, 'scripts', 'cms', 'generate.mts');
const OUT_DIR = path.join(ROOT, '.vitepress', 'cache');
const OUTFILE = path.join(OUT_DIR, 'cms-generate.cjs');

fs.mkdirSync(OUT_DIR, { recursive: true });

await build({
  entryPoints: [ENTRY],
  outfile: OUTFILE,
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  sourcemap: 'inline',
});
