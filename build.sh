#!/usr/bin/env bash
set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
host_target="$(rustc -vV | sed -n 's/^host: //p')"
target=''
profile='debug'

for argument in "$@"; do
    case "$argument" in
        --release)
            profile='release'
            ;;
        --*)
            printf 'Unknown option: %s\n' "$argument" >&2
            printf 'Usage: %s [--release] [target-triple]\n' "$0" >&2
            exit 2
            ;;
        *)
            if [[ -n "$target" ]]; then
                printf '%s\n' 'Pass at most one target triple.' >&2
                exit 2
            fi
            target="$argument"
            ;;
    esac
done

cd "$repository_root"

if [[ -z "$host_target" ]]; then
    printf '%s\n' 'Could not determine the Rust host target. Pass a target triple.' >&2
    exit 2
fi

build_target="$target"
if [[ -z "$build_target" ]]; then
    build_target="$host_target"
fi

if [[ -n "$target" ]] && command -v rustup >/dev/null 2>&1 \
    && ! rustup target list --installed | grep -Fxq "$target"; then
    printf 'Rust target %s is not installed. Install it with: rustup target add %s\n' \
        "$target" "$target" >&2
    exit 2
fi

build_arguments=(
    build
    --manifest-path "$repository_root/Cargo.toml"
    --package feluqa-cli
    --bins
    --locked
)
if [[ -n "$target" ]]; then
    build_arguments+=(--target "$target")
fi
if [[ "$profile" == 'release' ]]; then
    build_arguments+=(--release)
fi
cargo "${build_arguments[@]}"

build_root="${CARGO_TARGET_DIR:-$repository_root/target}"
if [[ -n "$target" ]]; then
    build_directory="$build_root/$target/$profile"
else
    build_directory="$build_root/$profile"
fi
printf 'Built %s binaries for %s in %s\n' "$profile" "$build_target" "$build_directory"
