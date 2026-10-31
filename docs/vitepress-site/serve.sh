#!/usr/bin/env bash
set -euo pipefail

site_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
host="${HOST:-127.0.0.1}"
base_port="${PORT:-4173}"
requested_sites=""
sites_option=0
build=0
preview=0
list_sites=0

if [[ -t 1 && -n "${TERM:-}" && "$TERM" != "dumb" && -z "${NO_COLOR:-}" ]]; then
  RESET=$'\033[0m'
  BOLD=$'\033[1m'
  BLUE=$'\033[34m'
  CYAN=$'\033[36m'
  GREEN=$'\033[32m'
  YELLOW=$'\033[33m'
  RED=$'\033[31m'
else
  RESET=''
  BOLD=''
  BLUE=''
  CYAN=''
  GREEN=''
  YELLOW=''
  RED=''
fi

info() { printf '%sINFO%s %s\n' "$CYAN" "$RESET" "$*"; }
success() { printf '%sOK%s %s\n' "$GREEN" "$RESET" "$*"; }
warning() { printf '%sWARN%s %s\n' "$YELLOW" "$RESET" "$*" >&2; }
error() { printf '%sERROR%s %s\n' "$RED" "$RESET" "$*" >&2; }

usage() {
  cat <<'EOF'
Usage: ./serve.sh [OPTIONS]

  --list              List registered sites, source directories, and output paths.
  --sites LIST        Select comma-separated site ids or directory names.
  --build             Build selected sites instead of starting servers.
  --preview           Build selected sites, serve the static output, and rebuild
                      only the site whose sources change.
  --help              Show this help.

Examples:
  ./serve.sh --list
  ./serve.sh --sites=site-1
  ./serve.sh --sites=site-1,site-2
  ./serve.sh --sites=site-1 --build
  ./serve.sh --sites=site-1 --preview

Without --sites, an interactive terminal prompts for a selection. Non-interactive
execution selects all registered sites. Servers use distinct available ports,
starting at PORT (default: 4173).
EOF
}

while (($#)); do
  case "$1" in
    --list) list_sites=1; shift ;;
    --sites=*) requested_sites="${1#*=}"; sites_option=1; shift ;;
    --sites) (($# >= 2)) || { error '--sites needs a comma-separated list.'; exit 2; }; requested_sites="$2"; sites_option=1; shift 2 ;;
    --build) build=1; shift ;;
    --preview) preview=1; shift ;;
    --help|-h) usage; exit 0 ;;
    *) error "Unknown option: $1"; usage >&2; exit 2 ;;
  esac
done

if ((sites_option)) && [[ -z "$requested_sites" ]]; then
  error '--sites needs a non-empty comma-separated list.'
  exit 2
fi

if ((list_sites)) && { ((build || preview || sites_option)); }; then
  error '--list cannot be combined with --sites, --build, or --preview.'
  exit 2
fi

if ((build && preview)); then
  error '--build and --preview cannot be combined.'
  exit 2
fi

mapfile -t sites < <(node --input-type=module - "$site_dir" "$requested_sites" "$list_sites" <<'NODE'
import { basename, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const root = process.argv[2]
const requested = process.argv[3]
const listMode = process.argv[4] === '1'
const { loadSites } = await import(pathToFileURL(resolve(root, 'app/scripts/site-registry.mjs')).href)
const sites = (await loadSites()).map((site) => ({
  ...site,
  sourceRoot: site.paths.root,
  outputRoot: site.paths.output,
  aliases: [site.id, site.name, resolve(site.paths.root).split(/[\\/]/).pop()].filter(Boolean),
}))
if (sites.length === 0) throw new Error(`No sites are registered in ${registryPath}`)

const ascii = (value) => String(value).replace(/[\t\r\n]/g, ' ').replace(/[^\x20-\x7E]/g, '?')
if (listMode) {
  for (const site of sites) {
    console.log([site.id, ascii(site.name ?? site.id), ascii(basename(site.sourceRoot)), ascii(site.sourceRoot), ascii(site.outputRoot || '(not configured)')].join('\t'))
  }
  process.exit(0)
}

let selections
if (requested) {
  selections = requested.split(',').map((item) => item.trim()).filter(Boolean)
} else if (stdin.isTTY && stdout.isTTY) {
  stdout.write('Available sites:\n')
  sites.forEach((site, index) => stdout.write(`  ${index + 1}) ${ascii(site.name ?? site.id)} [${site.id}; ${ascii(basename(site.sourceRoot))}]\n`))
  const terminal = createInterface({ input: stdin, output: stdout })
  try {
    const answer = (await terminal.question('Select site numbers or names, comma-separated [all]: ')).trim()
    selections = answer ? answer.split(',').map((item) => item.trim()).filter(Boolean) : sites.map((site) => site.id)
  } finally {
    terminal.close()
  }
} else {
  selections = sites.map((site) => site.id)
}

const chosen = []
for (const selection of selections) {
  const site = sites.find((candidate, index) => candidate.aliases.some((alias) => alias.toLowerCase() === selection.toLowerCase()) || String(index + 1) === selection)
  if (!site) throw new Error(`Unknown site "${selection}". Available: ${sites.map((candidate) => `${candidate.id} (${basename(candidate.sourceRoot)})`).join(', ')}`)
  if (!chosen.some((candidate) => candidate.id === site.id)) chosen.push(site)
}
for (const site of chosen) console.log(`${site.id}\t${ascii(site.name ?? site.id)}\t${ascii(site.outputRoot)}`)
NODE
)

if ((list_sites)); then
  if (( ${#sites[@]} == 0 )); then
    error 'No sites are registered.'
    exit 1
  fi
  printf '%s\n' "${BOLD}${BLUE}Registered sites${RESET}"
  printf '  %s\n' "${BOLD}ID                     NAME                     SOURCE                   OUTPUT${RESET}"
  for entry in "${sites[@]}"; do
    IFS=$'\t' read -r site_id site_name source_name source_root output_root <<<"$entry"
    printf '  %-22s %-24s %-24s %s\n' "$site_id" "$site_name" "$source_name" "$output_root"
  done
  exit 0
fi

if (( ${#sites[@]} == 0 )); then
  error 'No sites selected.'
  exit 1
fi

if ((build)); then
  info "Building ${#sites[@]} selected site(s)."
  for entry in "${sites[@]}"; do
    IFS=$'\t' read -r site_id _ _ <<<"$entry"
    (cd -- "$site_dir" && node app/scripts/site.mjs build --site "$site_id")
  done
  success 'Build completed.'
  exit 0
fi

if ((preview)); then
  info "Building ${#sites[@]} selected site(s) before preview."
  for entry in "${sites[@]}"; do
    IFS=$'\t' read -r site_id _ output_root <<<"$entry"
    if [[ -z "$output_root" ]]; then
      error "Site $site_id has no paths.output in its root spmpst.json."
      exit 1
    fi
    (cd -- "$site_dir" && node app/scripts/site.mjs build --site "$site_id")
  done
  success 'Build completed.'
fi

mapfile -t ports < <(node --input-type=module - "$base_port" "${#sites[@]}" <<'NODE'
import net from 'node:net'
const start = Number(process.argv[2])
const count = Number(process.argv[3])
const available = []
for (let port = start; port <= 65535 && available.length < count; port++) {
  const server = net.createServer()
  const free = await new Promise((resolve) => {
    server.once('error', () => resolve(false))
    server.listen(port, '127.0.0.1', () => server.close(() => resolve(true)))
  })
  if (free) available.push(port)
}
if (available.length !== count) process.exit(1)
for (const port of available) console.log(port)
NODE
)

if (( ${#ports[@]} != ${#sites[@]} )); then
  error "Could not allocate ${#sites[@]} ports starting at $base_port. Set PORT to another base port."
  exit 1
fi

if ((${#sites[@]} > 1)); then
  info "Starting ${#sites[@]} selected sites."
else
  info 'Starting 1 selected site.'
fi

pids=()
shutdown() {
  trap - EXIT INT TERM
  for pid in "${pids[@]}"; do kill -TERM "$pid" 2>/dev/null || true; done
  for pid in "${pids[@]}"; do wait "$pid" 2>/dev/null || true; done
}
trap shutdown EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

for index in "${!sites[@]}"; do
  IFS=$'\t' read -r site_id site_name output_root <<<"${sites[$index]}"
  port="${ports[$index]}"
  printf '  %s%-24s%s %s (%s)\n' "$BOLD" "$site_name" "$RESET" "http://$host:$port/" "$site_id"
  if ((preview)); then
    (cd -- "$site_dir" && PORT="$port" HOST="$host" exec node app/scripts/site.mjs serve-build --site "$site_id") &
    pids+=("$!")
    (cd -- "$site_dir" && exec node app/scripts/site.mjs watch --site "$site_id") &
    pids+=("$!")
  else
    (cd -- "$site_dir" && PORT="$port" HOST="$host" exec node app/scripts/site.mjs serve --site "$site_id") &
    pids+=("$!")
  fi
done

wait -n "${pids[@]}"
