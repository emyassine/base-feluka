#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
grammar_root="$repo_root/products/tree-sitter-feluqa-view"
zed_product="$repo_root/products/feluqa-zed"
output_root="$repo_root/target/feluqa-zed-dev-$$"
grammar_repo="$output_root/grammar-repo"
extension_dir="$output_root/extension"
prepare_only=0
if [[ "${1:-}" == "--prepare-only" ]]; then
  prepare_only=1
fi

if ! command -v npm >/dev/null 2>&1; then
  printf 'npm is required to generate and validate the Tree-sitter grammar.\n' >&2
  exit 1
fi
if [[ "$prepare_only" -eq 0 ]] && ! command -v zed >/dev/null 2>&1; then
  printf 'Zed must be installed and available as `zed`.\n' >&2
  exit 1
fi

mkdir -p "$output_root"
npm --prefix "$grammar_root" install
npm --prefix "$grammar_root" run generate
npm --prefix "$grammar_root" test
mkdir -p "$grammar_repo" "$extension_dir/languages"
cp -R "$grammar_root/grammar.js" "$grammar_root/tree-sitter.json" "$grammar_root/src" "$grammar_repo/"
cp -R "$zed_product/languages/feluqa_view" "$extension_dir/languages/"
cp "$zed_product/README.md" "$extension_dir/README.md"
git -C "$grammar_repo" init -q
git -C "$grammar_repo" add .
git -C "$grammar_repo" -c user.name='Feluqa Local Build' -c user.email='build@localhost' commit -qm 'Local Feluqa Views grammar snapshot'
revision="$(git -C "$grammar_repo" rev-parse HEAD)"
repository="file://$grammar_repo"
sed -e "s|__LOCAL_GRAMMAR_REPOSITORY__|$repository|" -e "s|__LOCAL_GRAMMAR_REVISION__|$revision|" "$zed_product/extension.toml.in" > "$extension_dir/extension.toml"
printf 'Generated dev extension: %s\nGrammar revision: %s\n' "$extension_dir" "$revision"
if [[ "$prepare_only" -eq 1 ]]; then
  printf 'Prepared only. Install this directory in Zed: %s\n' "$extension_dir"
else
  zed "$extension_dir"
  printf 'In Zed, run "zed: install dev extension" and select the generated extension directory above.\n'
fi
