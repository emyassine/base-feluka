# Feluqa

Feluqa is a proprietary Rust platform and ecosystem for installable modules
across web, SPAs, mobile, desktop, games, APIs and real-time systems. Products
share tools and schemas while keeping runtime profiles suited to their
targets. Web delivery is the current priority.

## Start here

- [Documentation](docs-new/00.index.en.md): the single index for the developer guides
  and technical references, from app creation to the current roadmap.
- [SPMPST specification](docs/SSG.md): the draft standard for the documentation
  source tree and static site adapters.
- [Contributor instructions](AGENTS.md): repository boundaries, Rust rules
  and validation commands.

The CLI product is `products/feluqa-cli/` and its binary is `feluqa`. From this
checkout, inspect its help with:

```sh
cargo run -p feluqa-cli -- help
```

Product-specific run/build instructions belong in each product guide. Crate APIs and setup instructions belong beside their crate.

## Workspace

The root Cargo workspace contains domain-grouped framework crates under `crates/`, tools under `tools/`, and product consumers under `products/`. The `feluqa` facade exposes target profiles. The web profile
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
gates are not complete. See the [active roadmap](docs-new/999-roadmap/01.index.en.md).
