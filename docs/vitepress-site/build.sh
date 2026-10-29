#!/usr/bin/env bash
set -euo pipefail

site_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_docs_dir="$(cd "$site_dir/.." && pwd)"

if [[ ! -d "$site_dir/node_modules/vitepress" ]]; then
  npm --prefix "$site_dir" install
fi

node "$site_dir/prepare.mjs"
(cd "$site_dir" && npm run docs:build -- --base /)

for language in $(node -e 'process.stdout.write(JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")).languages.join(" "))' "$site_dir/config-vitepress-site.json"); do
  index_path=$(node -e 'const c=JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); process.stdout.write(c.indexPath.replaceAll("$lang", process.argv[2]))' "$site_dir/config-vitepress-site.json" "$language")
  cp "$repo_docs_dir/build/index.html" "$site_dir/$index_path"
done
test -f "$repo_docs_dir/build/index.html"
printf 'Built documentation site at %s\n' "$repo_docs_dir/build"
