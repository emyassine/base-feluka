# Core Crates

Core packages hold contracts and behavior shared across Feluqa products. Keep dependencies here only when they are needed by the shared contract; web servers, native UI and product-specific workflows belong in higher layers.

## Packages in this folder

- [`feluqa-definitions`](feluqa-definitions/Cargo.toml) owns current platform context, product identity and portable path definitions.
- [`feluqa-core`](feluqa-core/Cargo.toml) currently owns persistent identity, access-control, session and audit behavior.

## Direction

The selected architecture keeps small shared primitives and portable definitions at the bottom of the dependency graph. A minimal `no_std` surface is a target, not a claim about the current `feluqa-core` implementation. Its current persistence responsibilities and database/auth dependencies must be preserved and deliberately separated if that boundary changes.

Do not move persistence schemas or authentication behavior just to make a package name match the target diagram. Keep migrations, data ownership and consumers aligned when changing these boundaries. See the [monorepo architecture](../../docs-new/technical/02.architecture/01.monorepo-architecture.en.md).
