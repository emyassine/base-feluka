#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v cargo >/dev/null 2>&1; then
    printf '%s\n' 'error: cargo is required to build Feluqa' >&2
    exit 127
fi

cargo build \
    --manifest-path "$ROOT_DIR/_crates/Cargo.toml" \
    --workspace \
    --all-targets \
    "$@"
