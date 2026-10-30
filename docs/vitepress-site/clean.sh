#!/usr/bin/env bash
set -euo pipefail

# Remove only disposable outputs owned by the VitePress documentation pipeline.
site_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
docs_dir="$(cd "$site_dir/.." && pwd)"
exec 9>"$site_dir/.build.lock"
flock 9

rm -rf \
  "$docs_dir/build" \
  "$site_dir/.generated-guides" \
  "$site_dir/.generated-guides.md" \
  "$site_dir/.vitepress/generated" \
  "$site_dir/.vitepress/cache" \
  "$site_dir/.vitepress/mermaid-cache"

find "$site_dir/config" "$site_dir/.vitepress/config" -maxdepth 1 -type f -name '*.timestamp-*.mjs' -delete

printf '[clean] Removed generated guides, VitePress caches, and docs/build. Source guides were left in place.\n'
