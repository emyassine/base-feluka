# Feluqa

Feluqa is a proprietary Rust platform and ecosystem for installable modules
across web, SPAs, mobile, desktop, games, APIs and real-time systems. Products
share tools and schemas while keeping runtime profiles suited to their
targets. Web delivery is the current priority.

## Start here

- [Documentation](docs/00.index.en.md): organization guides, module developer
  guides, technical references, architecture intent and remaining work.
- [Contributor instructions](AGENTS.md): repository boundaries, Rust rules
  and validation commands.

The CLI product is `products/feluqa-cli/` and its binary is `feluqa`. From this
checkout, inspect its help with:

```sh
cargo run --manifest-path _crates/Cargo.toml -p feluqa-cli -- help
```

Product-specific run/build instructions belong in the corresponding guide
in `docs/03.for-developers/10.product-implementations.en.md`.

## Workspace

The Cargo workspace and lockfile live under `_crates/`; product sources live
under `products/`. The `feluqa` facade exposes target profiles. The web profile
uses Tokio, Axum, Tower, Serde and SeaORM. Shared contracts such as auth,
versioned UI schemas, panel registration and module lifecycle are kept behind
Feluqa namespaces; a non-web target does not inherit the server runtime by
default.

Every handwritten crate root and generated app entrypoint uses
`#![no_implicit_prelude]`. Views use the compiled `.view.rs` template language.
The panel and view references document current behavior and gaps; browser
assets alone do not establish feature parity with any PHP framework.

The platform remains in active development. Dynamic module installation,
domain license enforcement, complete legacy panel implementation-compatible panels, production
Live reconciliation, deployment/restore qualification and enterprise release
gates are not complete. See the [delivery plan](docs/roadmap/01.index.en.md).
