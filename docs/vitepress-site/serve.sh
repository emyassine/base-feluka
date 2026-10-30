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

if [[ ! -x "$site_dir/node_modules/.bin/vitepress" ]]; then
  printf '[serve] Installing VitePress dependencies\n'
  npm --prefix "$site_dir" install
fi

printf '[serve] Preparing guides and cached Mermaid diagrams\n'
node "$site_dir/scripts/preparation/pipeline.mjs"
printf '[serve] Starting VitePress dev server at http://%s:%s/\n' "$host" "$port"
printf '[serve] Markdown and asset edits hot reload; navigation/config edits reload VitePress. Ctrl+C stops both processes.\n'

(cd "$site_dir" && exec ./node_modules/.bin/vitepress dev --host "$host" --port "$port" --strictPort) &
vitepress_pid=$!
(cd "$site_dir" && exec node scripts/dev/watch.mjs) &
watcher_pid=$!

shutdown() {
  trap - EXIT INT TERM
  kill -TERM "$watcher_pid" "$vitepress_pid" 2>/dev/null || true
  wait "$watcher_pid" 2>/dev/null || true
  wait "$vitepress_pid" 2>/dev/null || true
}
trap shutdown EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

wait -n "$vitepress_pid" "$watcher_pid"
