#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import {
  loadCmsCache,
  buildValidUrlSet,
  listMarkdownFiles,
  findDeadLinks,
  buildSlugIndex,
  suggestRewrites,
  applyRewrite,
  applyRemove,
  writeStubFiles,
  saveReport,
  loadReport,
  buildReport,
} from './lib.mjs';

const cwd = process.cwd();
const cmd = process.argv[2] || 'scan';

function printHelp() {
  console.log('Usage: node scripts/dead-links/cli.mjs [scan|fix]');
}

function createInterface() {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

function scan() {
  const { cachePath, cache } = loadCmsCache(cwd);
  if (!cache) {
    console.error(`CMS cache not found at ${cachePath}. Run the generator first.`);
    process.exit(1);
  }
  const { normalized } = buildValidUrlSet(cache);
  const files = listMarkdownFiles([path.join(cwd, 'docs'), path.join(cwd, '.vitepress', 'cache', 'gen', 'i18n')]);
  const deadMap = findDeadLinks(files, normalized);
  const report = buildReport(deadMap);
  const reportPath = saveReport(cwd, report);
  console.log(`Found ${report.total} unique dead links.`);
  console.log(`Report saved to ${reportPath}`);
}

async function fix() {
  const { cachePath, cache } = loadCmsCache(cwd);
  if (!cache) {
    console.error(`CMS cache not found at ${cachePath}. Run the generator first.`);
    process.exit(1);
  }
  let report = loadReport(cwd);
  if (!report) {
    const { normalized } = buildValidUrlSet(cache);
    const files = listMarkdownFiles([path.join(cwd, 'docs'), path.join(cwd, '.vitepress', 'cache', 'gen', 'i18n')]);
    const deadMap = findDeadLinks(files, normalized);
    report = buildReport(deadMap);
    saveReport(cwd, report);
  }

  const rl = createInterface();
  const slugIndex = buildSlugIndex(cache);
  const docsFiles = listMarkdownFiles(path.join(cwd, 'docs'));
  const actions = ['skip', 'remove', 'rewrite', 'stub', 'all'];
  let bulkAction = null;
  let bulkRewrite = null;
  let anySkip = false;

  for (const item of report.items) {
    const key = item.key;
    const urls = item.urls || [];
    const count = item.count;

    let action = bulkAction;
    let rewriteTo = bulkRewrite;

    if (!action) {
      console.log(`\nDead link: ${key} (count: ${count})`);
      if (urls.length > 1) {
        console.log(`Variants: ${urls.join(', ')}`);
      }
      const choice = await ask(rl, 'Choose action: [s]kip, [r]emove, [w]rewrite, s[t]ub, [a]ll same: ');
      const c = choice.toLowerCase();
      if (c.startsWith('a')) {
        const which = await ask(rl, 'Apply which action to all? [r]emove, [w]rewrite, s[t]ub, [s]kip: ');
        const w = which.toLowerCase();
        if (w.startsWith('r')) action = 'remove';
        else if (w.startsWith('w')) action = 'rewrite';
        else if (w.startsWith('t')) action = 'stub';
        else action = 'skip';
        bulkAction = action;
      } else if (c.startsWith('r')) action = 'remove';
      else if (c.startsWith('w')) action = 'rewrite';
      else if (c.startsWith('t')) action = 'stub';
      else action = 'skip';
    }

    if (action === 'rewrite') {
      if (!rewriteTo) {
        const suggestions = suggestRewrites(key, slugIndex);
        if (suggestions.length) {
          console.log('Suggestions:');
          suggestions.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
          const pick = await ask(rl, 'Pick number or enter custom URL: ');
          const idx = Number(pick);
          if (!Number.isNaN(idx) && idx > 0 && idx <= suggestions.length) {
            rewriteTo = suggestions[idx - 1];
          } else if (pick) {
            rewriteTo = pick;
          }
        } else {
          const custom = await ask(rl, 'No suggestions. Enter custom URL or leave blank to skip: ');
          rewriteTo = custom || null;
        }
      }
      if (!rewriteTo) {
        console.log('Skipping (no rewrite selected).');
        continue;
      }
    }

    if (action === 'skip') {
      anySkip = true;
      continue;
    }

    if (action === 'stub') {
      const created = writeStubFiles(cwd, key, cache);
      if (created.length) console.log(`Created stubs: ${created.join(', ')}`);
      continue;
    }

    let touched = 0;
    for (const abs of docsFiles) {
      const content = fs.readFileSync(abs, 'utf8');
      let next = content;
      for (const url of urls.length ? urls : [key]) {
        if (action === 'remove') next = applyRemove(next, url);
        if (action === 'rewrite') next = applyRewrite(next, url, rewriteTo);
      }
      if (next !== content) {
        fs.writeFileSync(abs, next, 'utf8');
        touched += 1;
      }
    }
    if (!touched) {
      console.log('No source file updated in docs/.');
    }

    if (bulkAction === 'rewrite' && !bulkRewrite) {
      bulkRewrite = rewriteTo;
    }
  }

  rl.close();

  const flagPath = path.join(cwd, '.vitepress', 'cache', 'gen', 'dead-links-ignore.json');
  if (anySkip) {
    fs.mkdirSync(path.dirname(flagPath), { recursive: true });
    fs.writeFileSync(flagPath, JSON.stringify({ ignoreDeadLinks: true }, null, 2));
  } else if (fs.existsSync(flagPath)) {
    fs.rmSync(flagPath, { force: true });
  }
}

if (cmd === 'scan') scan();
else if (cmd === 'fix') fix();
else printHelp();
