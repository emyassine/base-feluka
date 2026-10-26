#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")"
cargo build --release --target x86_64-unknown-linux-gnu
mkdir -p dist
install -m 755 target/x86_64-unknown-linux-gnu/release/webkernel-rust-probe dist/webkernel-rust-probe
printf 'Built %s\n' "$PWD/dist/webkernel-rust-probe"
