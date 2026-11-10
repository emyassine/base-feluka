import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

let generatedOnce = false;

export function runGenerators(): void {
  if (generatedOnce) return;
  generatedOnce = true;

  execFileSync('node', ['scripts/seo/apply.mjs'], { stdio: 'inherit' });
  execFileSync('node', ['scripts/i18n/generate.mjs'], { stdio: 'inherit' });
  execFileSync('node', ['scripts/cms/build.mjs'], { stdio: 'inherit' });
  execFileSync('node', ['scripts/preload/generate.mjs'], { stdio: 'inherit' });
  execFileSync('node', ['.vitepress/cache/cms-generate.cjs'], { stdio: 'inherit' });
  execFileSync('node', ['scripts/seo/validate.mjs'], { stdio: 'inherit' });

  const isBuild = process.argv.includes('build');
  if (isBuild) {
    execFileSync('node', ['scripts/dead-links/cli.mjs', 'fix'], { stdio: 'inherit' });
    execFileSync('node', ['scripts/seo/apply.mjs'], { stdio: 'inherit' });
    execFileSync('node', ['scripts/i18n/generate.mjs'], { stdio: 'inherit' });
    execFileSync('node', ['scripts/cms/build.mjs'], { stdio: 'inherit' });
    execFileSync('node', ['scripts/preload/generate.mjs'], { stdio: 'inherit' });
    execFileSync('node', ['.vitepress/cache/cms-generate.cjs'], { stdio: 'inherit' });
    execFileSync('node', ['scripts/seo/validate.mjs'], { stdio: 'inherit' });
  }

  const root = process.cwd();
  const publicSrc = path.join(root, 'public');
  const publicDest = path.join(root, '.vitepress', 'cache', 'gen', 'i18n', 'public');
  if (fs.existsSync(publicSrc)) {
    fs.rmSync(publicDest, { recursive: true, force: true });
    fs.cpSync(publicSrc, publicDest, { recursive: true });
  }
}

export function metaBuildGenerate(): Plugin {
  return {
    name: 'meta-build-generate',
    apply: 'serve',
    buildStart() {
      runGenerators();
    },
  };
}
