#!/usr/bin/env bash
set -euo pipefail

site_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_docs_dir="$(cd "$site_dir/.." && pwd)"

if [[ ! -d "$site_dir/node_modules/vitepress" ]]; then
  npm --prefix "$site_dir" install
fi

node "$site_dir/prepare.mjs"
(cd "$site_dir" && npm run docs:build -- --base /)
test -f "$repo_docs_dir/build/index.html"
test -f "$repo_docs_dir/build/index.html"
node "$site_dir/make-file-urls-relative.mjs" "$repo_docs_dir/build"
node "$site_dir/check-file-links.mjs" "$repo_docs_dir/build"
printf 'Built documentation site at %s\n' "$repo_docs_dir/build"
