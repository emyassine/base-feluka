#!/usr/bin/env bash
# ==============================================================================
# Script Name: build.sh
# Description: Builds Feluqa workspace or specific package using Cargo.
#
# Usage Examples:
#   1. Build the default CLI package (debug mode, host target):
#      ./build.sh
#
#   2. Build the entire workspace with all targets (debug mode):
#      ./build.sh --all
#
#   3. Build the CLI package in release mode:
#      ./build.sh --release
#
#   4. Build the entire workspace in release mode:
#      ./build.sh --release --all
#
#   5. Build for a specific target triple (e.g., cross-compilation):
#      ./build.sh x86_64-unknown-linux-musl
#      ./build.sh --release --all x86_64-unknown-linux-musl
# ==============================================================================

set -euo pipefail

# Check if cargo is installed
if ! command -v cargo >/dev/null 2>&1; then
    printf '%s\n' 'error: cargo is required to build Feluqa' >&2
    exit 127
fi

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
host_target="$(rustc -vV | sed -n 's/^host: //p')"
target=''
profile='debug'
build_all='false'

for argument in "$@"; do
    case "$argument" in
        --release)
            profile='release'
            ;;
        --all)
            build_all='true'
            ;;
        --*)
            printf 'Unknown option: %s\n' "$argument" >&2
            printf 'Usage: %s [--release] [--all] [target-triple]\n' "$0" >&2
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

# Configure build arguments based on flags (--all vs single package)
if [[ "$build_all" == 'true' ]]; then
    build_arguments=(
        build
        --manifest-path "$repository_root/Cargo.toml"
        --workspace
        --all-targets
    )
else
    build_arguments=(
        build
        --manifest-path "$repository_root/Cargo.toml"
        --package feluqa-cli
        --bins
    )
fi

# Add --locked if Cargo.locked exists
if [[ -f "$repository_root/Cargo.locked" ]]; then
    build_arguments+=(--locked)
fi

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

if [[ "$build_all" == 'true' ]]; then
    printf 'Built %s workspace binaries/targets for %s in %s\n' "$profile" "$build_target" "$build_directory"
else
    printf 'Built %s binaries for %s in %s\n' "$profile" "$build_target" "$build_directory"
fi
