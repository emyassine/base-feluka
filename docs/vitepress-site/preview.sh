#!/usr/bin/env bash
set -euo pipefail

site_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
docs_dir="$(cd "$site_dir/.." && pwd)"

"$site_dir/build.sh"
exec python3 -m http.server "${PORT:-4173}" --directory "$docs_dir/build"
