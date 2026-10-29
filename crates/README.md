# Framework Crates

This directory contains Feluqa’s reusable framework packages. Products live in `products/`. The repository’s virtual Cargo workspace is defined by the root `Cargo.toml`.

## Why the crates are grouped

The folders show what a package is responsible for. They are not runtime profiles and do not control compilation. Cargo packages define dependency and publishing boundaries; Rust `mod` files organize code inside a package. Use Cargo features and Rust `cfg` for target-specific code.

- [`core/`](core/README.md) holds shared framework foundations and contracts.
- [`macros/`](macros/README.md) holds procedural macros that generate or validate Rust APIs.
- [`ui/`](ui/README.md) holds UI schemas, view compilation, components and current web UI runtime packages.
- [`services/`](services/README.md) holds reusable services such as authentication, persistence, Live actions, notifications and imagery.
- [`platform/`](platform/README.md) holds the public facade and platform-level developer contracts.

A healthy dependency direction keeps shared contracts below the services and platform that use them. Avoid cycles. Add a package when it gives useful ownership, build, API or publishing boundaries; do not create an empty package just to match a diagram.

## Headless UI and renderers

Feluqa’s selected UI direction is a shared, headless Rust layer with target-specific renderers. The headless layer describes state, events and semantic UI—what a screen contains and what actions it supports. A renderer turns that description into platform output, such as DOM for the web or native controls in an operating-system shell.

This keeps application behavior and UI meaning reusable while letting each platform use its own input, accessibility, navigation and visual conventions. It does not mean every platform must share identical pixels.

The complete headless semantic core and native shell adapters are not implemented yet. The current UI packages include versioned UI schemas, a separate reactivity package, view compilation, components and web-oriented runtime packages. See [`ui/README.md`](ui/README.md) and the [monorepo architecture](../docs-new/technical/02.architecture/01.monorepo-architecture.en.md) for the current-to-target mapping.

## What is not here yet

The selected architecture also includes bridge and runtime packages, plus native projects under `shells/`. They are not added until there is a working contract and a consumer. Follow the [framework roadmap](../docs-new/999-roadmap/01.index.en.md) for that work.
