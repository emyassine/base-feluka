#!/usr/bin/env bash
set -euo pipefail

site_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_docs_dir="$(cd "$site_dir/.." && pwd)"
build_started=$SECONDS

stage() {
  printf '[%s] %s (%ss elapsed)\n' "$(date +%H:%M:%S)" "$1" "$((SECONDS - build_started))"
}

if [[ ! -d "$site_dir/node_modules/vitepress" ]]; then
  stage 'Installing VitePress dependencies'
  npm --prefix "$site_dir" install
fi

stage 'Preparing guides and rendering uncached Mermaid diagrams'
node "$site_dir/prepare.mjs"
stage 'Building static pages with VitePress'
(cd "$site_dir" && npm run docs:build -- --base / --mpa)
stage 'Inlining CSS, fonts, images, and file-safe controls'
test -f "$repo_docs_dir/build/index.html"
node "$site_dir/make-file-urls-relative.mjs" "$repo_docs_dir/build"
stage 'Checking generated local links'
node "$site_dir/check-file-links.mjs" "$repo_docs_dir/build"
stage "Build complete: $repo_docs_dir/build"
