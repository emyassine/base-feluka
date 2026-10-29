#!/usr/bin/env bash
set -euo pipefail

site_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
host="${HOST:-127.0.0.1}"
port="${PORT:-}"

if [[ -z "$port" ]]; then
  port="$(node --input-type=module -e '
    import net from "node:net";
    for (let candidate = 4173; candidate <= 4190; candidate++) {
      const server = net.createServer();
      const free = await new Promise((resolve) => {
        server.once("error", () => resolve(false));
        server.listen(candidate, "127.0.0.1", () => server.close(() => resolve(true)));
      });
      if (free) { console.log(candidate); break; }
    }
  ')"
fi

if [[ -z "$port" ]]; then
  printf '[serve] No available port between 4173 and 4190; set PORT explicitly.\n' >&2
  exit 1
fi

if [[ ! -d "$site_dir/node_modules/vitepress" ]]; then
  printf '[serve] Installing VitePress dependencies\n'
  npm --prefix "$site_dir" install
fi

printf '[serve] Building docs with VitePress local search enabled\n'
"$site_dir/build.sh"

printf '[serve] Starting local site at http://%s:%s/ (Ctrl+C to stop)\n' "$host" "$port"
cd "$site_dir"
npm exec vitepress -- preview --host "$host" --port "$port" --strictPort
