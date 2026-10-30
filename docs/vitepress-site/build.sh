#!/usr/bin/env bash
set -euo pipefail

site_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_docs_dir="$(cd "$site_dir/.." && pwd)"
output_dir="$repo_docs_dir/build"
exec 9>"$site_dir/.build.lock"
flock 9
stage_dir="$(mktemp -d "$repo_docs_dir/.build-stage.XXXXXX")"
backup_dir="$repo_docs_dir/.build-backup.$BASHPID"
build_started=$SECONDS
trap 'rm -rf "$stage_dir" "$backup_dir"' EXIT

stage() {
  printf '[%s] %s (%ss elapsed)\n' "$(date +%H:%M:%S)" "$1" "$((SECONDS - build_started))"
}

if [[ ! -d "$site_dir/node_modules/vitepress" ]]; then
  stage 'Installing VitePress dependencies'
  npm --prefix "$site_dir" install
fi

stage 'Preparing guides and rendering uncached Mermaid diagrams'
DOCS_PREPARE_LOCK_HELD=1 node "$site_dir/scripts/preparation/pipeline.mjs"
stage 'Building VitePress client site with native local search'
(cd "$site_dir" && DOCS_OUTPUT_DIR="$stage_dir" npm exec vitepress build -- --base /)
test -f "$stage_dir/index.html"
stage 'Checking generated local links'
node "$site_dir/scripts/build/check-file-links.mjs" "$stage_dir"

if [[ -d "$output_dir/assets" ]]; then
  for asset_directory in assets __docs-assets mermaid; do
    if [[ -d "$output_dir/$asset_directory" ]]; then
      mkdir -p "$stage_dir/$asset_directory"
      cp -an "$output_dir/$asset_directory/." "$stage_dir/$asset_directory/"
    fi
  done
fi

if [[ -e "$output_dir" ]]; then mv "$output_dir" "$backup_dir"; fi
mv "$stage_dir" "$output_dir"
rm -rf "$backup_dir"
stage "Build complete: $output_dir"
