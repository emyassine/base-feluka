#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
COMMAND="${1:-all}"
# Match the Go toolchain recorded by the final M0 measurement. Go's toolchain
# download mechanism fetches it when the package-manager Go is older.
export GOTOOLCHAIN="go1.27.1"

usage() {
  cat <<'EOF'
Feluka M0 bootstrap and test entry point

Usage:
  ./benchmarks/bootstrap.sh [all|check|install|test|bench]

  all      Install missing base tools where supported, validate, then run tests (default)
  check    Validate required tools and libraries without changing the machine
  install  Install base dependencies and pinned toolchains using available package managers
  test     Run unit/conformance tests and evidence audits into results/<timestamp>/
  bench    Run the Linux-only pinned HTTP benchmark into results/<timestamp>/

Supported hosts: Linux, macOS, and WSL2 (Linux distribution packages).
EOF
}

die() { printf 'feluka: %s\n' "$*" >&2; exit 1; }

os="$(uname -s)"
if [[ "$os" == MINGW* || "$os" == MSYS* || "$os" == CYGWIN* ]]; then
  die 'Use WSL2 for Windows; native Windows is not supported.'
fi
if [[ "$os" == Darwin ]] && command -v brew >/dev/null 2>&1; then
  export PKG_CONFIG_PATH="$(brew --prefix sqlite 2>/dev/null)/lib/pkgconfig${PKG_CONFIG_PATH:+:$PKG_CONFIG_PATH}"
fi

install_deps() {
  case "$os" in
    Darwin)
      command -v brew >/dev/null 2>&1 || die 'Install Homebrew first: https://brew.sh'
      brew list go >/dev/null 2>&1 || brew install go
      brew list python@3.12 >/dev/null 2>&1 || brew install python@3.12
      brew list pkgconf >/dev/null 2>&1 || brew install pkgconf
      brew list sqlite >/dev/null 2>&1 || brew install sqlite
      brew list make >/dev/null 2>&1 || brew install make
      if ! xcode-select -p >/dev/null 2>&1; then
        printf 'Install the Apple command line tools, then rerun: xcode-select --install\n' >&2
        return 1
      fi
      ;;
    Linux)
      if command -v apt-get >/dev/null 2>&1; then
        sudo apt-get update
        sudo apt-get install -y build-essential pkg-config libsqlite3-dev curl ca-certificates git make python3 python3-venv golang-go
      elif command -v dnf >/dev/null 2>&1; then
        sudo dnf install -y gcc gcc-c++ make pkgconf-pkg-config sqlite-devel curl ca-certificates git python3 golang
      elif command -v pacman >/dev/null 2>&1; then
        sudo pacman -Syu --needed --noconfirm base-devel pkgconf sqlite curl ca-certificates git python go
      else
        die 'No supported package manager found (apt, dnf, pacman). Install the tools listed by ./benchmarks/bootstrap.sh check.'
      fi
      ;;
    *) die "Unsupported operating system: $os" ;;
  esac

  if ! command -v rustup >/dev/null 2>&1; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  fi
  # shellcheck disable=SC1091
  [[ -f "$HOME/.cargo/env" ]] && source "$HOME/.cargo/env"
  command -v rustup >/dev/null 2>&1 || die 'rustup installation did not provide rustup in PATH; open a new shell and rerun.'
  rustup toolchain install 1.99.0 --profile minimal
}

check_deps() {
  local missing=()
  for tool in python3 go rustc cargo rustup pkg-config cc; do
    command -v "$tool" >/dev/null 2>&1 || missing+=("$tool")
  done
  if [[ "$os" == Darwin ]]; then
    command -v gmake >/dev/null 2>&1 || missing+=("GNU make (gmake)")
  else
    command -v make >/dev/null 2>&1 || missing+=(make)
  fi
  if ((${#missing[@]})); then
    printf 'Missing required commands: %s\n' "${missing[*]}" >&2
    printf 'Run ./benchmarks/bootstrap.sh install, then open a new shell if PATH changed.\n' >&2
    return 1
  fi
  python3 - <<'PY' || return 1
import sys
if sys.version_info < (3, 10):
    raise SystemExit("Python 3.10 or newer is required")
PY
  pkg-config --exists sqlite3 || { echo 'SQLite development files are missing (pkg-config sqlite3).' >&2; return 1; }
  go version || return 1
  rustc --version || return 1
  cargo --version || return 1
  python3 --version
  pkg-config --modversion sqlite3 || return 1
  printf 'Dependency check passed on %s (%s).\n' "$os" "$(uname -m)"
}

make_command() {
  if [[ "$os" == Darwin ]]; then command -v gmake; else command -v make; fi
}

case "$COMMAND" in
  -h|--help|help) usage ;;
  install) install_deps; check_deps ;;
  check) check_deps ;;
  test) check_deps; exec "$(make_command)" -C "$ROOT" test ;;
  all)
    if ! check_deps >/dev/null 2>&1; then install_deps; fi
    check_deps
    exec "$(make_command)" -C "$ROOT" test
    ;;
  bench)
    check_deps
    [[ "$os" == Linux ]] || die 'The pinned HTTP benchmark requires Linux (taskset, /proc, and CPU governor metadata).'
    exec "$(make_command)" -C "$ROOT" bench
    ;;
  *) usage >&2; die "Unknown command: $COMMAND" ;;
esac
