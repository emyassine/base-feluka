# Platform Crates

Platform packages define Feluqa’s public entry points and the contracts that applications use to compose framework capabilities.

## Packages in this folder

- [`feluqa`](feluqa/Cargo.toml) is the public facade. Its Cargo features opt products into framework APIs.
- [`feluqa-console`](feluqa-console/Cargo.toml) provides reusable command and development-console contracts; `products/feluqa-cli` is the CLI application.
- `feluqa-module` provides static module lifecycle contracts. Dynamic installable module artifacts are not implemented.
- `feluqa-panel` provides a generic panel catalogue and validation contracts. It is not the removed built-in System Panel product.

A product composes its routes, modules and panel providers. The platform provides shared contracts and services; product-specific pages and business workflows belong in the product or module. Keep the facade stable and expose only documented APIs.

Deploy orchestration, dynamic module installation, registry trust and a built-in operator panel remain roadmap work. See the [monorepo architecture](../../docs/02.architecture/01.monorepo-architecture.en.md) for the selected larger layout and its current status.
