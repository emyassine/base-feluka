#!/usr/bin/env bash

set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case "${1:-}" in
    docs)
        if [[ "$#" -ne 1 ]]; then
            printf 'Usage: %s docs\n' "$0" >&2
            exit 2
        fi

        exec cargo \
            --config 'registries.feluqa.index="sparse+https://crates.feluqa.numerimondes.com/api/v1/crates/"' \
            --config 'registries.feluqa.credential-provider="cargo:token"' \
            doc \
            --manifest-path "$repository_root/Cargo.toml" \
            --package feluqa \
            --all-features \
            --open
        ;;
    *)
        printf 'Usage: %s docs\n' "$0" >&2
        exit 2
        ;;
esac
