#!/usr/bin/env bash
set -euo pipefail

product_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repository_root="$(cd "$product_dir/../.." && pwd)"
target="${1:-$(rustc -vV | sed -n 's/^host: //p')}"

cd "$repository_root"

if [[ -z "$target" ]]; then
    printf '%s\n' 'Could not determine the Rust host target. Pass a target triple.' >&2
    exit 2
fi

if command -v rustup >/dev/null 2>&1 \
    && ! rustup target list --installed | grep -Fxq "$target"; then
    printf 'Rust target %s is not installed. Install it with: rustup target add %s\n' \
        "$target" "$target" >&2
    exit 2
fi

extension=''
case "$target" in
    *-windows-*) extension='.exe' ;;
esac

cargo build \
    --manifest-path "$repository_root/_crates/Cargo.toml" \
    --package feluqa-cli \
    --bins \
    --release \
    --locked \
    --target "$target"

build_root="${CARGO_TARGET_DIR:-$repository_root/target}"
build_directory="$build_root/$target/release"
dist_directory="$product_dir/dist"
archive="$dist_directory/feluqa-cli-$target.tar.gz"

mkdir -p "$dist_directory"
tar -C "$build_directory" -czf "$archive" -- \
    "feluqa$extension" \
    "nadim$extension"

printf 'Built release binaries for %s: %s\n' "$target" "$archive"
