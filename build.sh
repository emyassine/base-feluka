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

# ANSI Color Codes (ASCII safe)
COLOR_RESET="\033[0m"
COLOR_BOLD="\033[1m"
COLOR_GREEN="\033[32m"
COLOR_YELLOW="\033[33m"
COLOR_RED="\033[31m"
COLOR_CYAN="\033[36m"

print_info() {
    printf "${COLOR_CYAN}[INFO]${COLOR_RESET} %s\n" "$1"
}

print_success() {
    printf "${COLOR_GREEN}[SUCCESS]${COLOR_RESET} %s\n" "$1"
}

print_warn() {
    printf "${COLOR_YELLOW}[WARNING]${COLOR_RESET} %s\n" "$1"
}

print_error() {
    printf "${COLOR_RED}[ERROR]${COLOR_RESET} %s\n" "$1" >&2
}

# Check if cargo is installed
if ! command -v cargo >/dev/null 2>&1; then
    print_error "cargo is required to build Feluqa"
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
            print_error "Unknown option: $argument"
            printf 'Usage: %s [--release] [--all] [target-triple]\n' "$0" >&2
            exit 2
            ;;
        *)
            if [[ -n "$target" ]]; then
                print_error "Pass at most one target triple."
                exit 2
            fi
            target="$argument"
            ;;
    esac
done

cd "$repository_root"

if [[ -z "$host_target" ]]; then
    print_error "Could not determine the Rust host target. Pass a target triple."
    exit 2
fi

build_target="$target"
if [[ -z "$build_target" ]]; then
    build_target="$host_target"
fi

if [[ -n "$target" ]] && command -v rustup >/dev/null 2>&1 \
    && ! rustup target list --installed | grep -Fxq "$target"; then
    print_warn "Rust target $target is not installed. Installing it..."
    rustup target add "$target"
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

if [[ -n "$target" ]]; then
    build_arguments+=(--target "$target")
fi
if [[ "$profile" == 'release' ]]; then
    build_arguments+=(--release)
fi

print_info "Fetching dependencies and building Feluqa (${profile})..."
cargo "${build_arguments[@]}"

build_root="${CARGO_TARGET_DIR:-$repository_root/target}"
if [[ -n "$target" ]]; then
    build_directory="$build_root/$target/$profile"
else
    build_directory="$build_root/$profile"
fi

if [[ "$build_all" == 'true' ]]; then
    print_success "Built ${profile} workspace binaries/targets for ${build_target} in ${build_directory}"
else
    print_success "Built ${profile} binaries for ${build_target} in ${build_directory}"
fi
