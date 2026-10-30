#!/usr/bin/env bash
set -euo pipefail

site_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -x "$site_dir/node_modules/.bin/vitepress" ]]; then
  printf '[vitepress-site] Dependencies are missing. Run `npm --prefix "%s" install` first.\n' "$site_dir" >&2
  exit 1
fi

exec npm --prefix "$site_dir" run docs:serve -- "$@"
