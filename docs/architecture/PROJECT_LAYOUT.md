# Feluqa project layout

This document distinguishes the current application tree from the intended
domain-owned layout. The target is a convention for future scaffolds and
refactors; it does not claim Numerimondes has already been moved.

## Target layout

```text
numerimondes/
├── Cargo.toml
├── feluqa.toml                 # selects runtime profile and service provider
├── build.rs                    # compiles views and embeds declared migrations
├── config/                     # environment-specific operational settings
├── resources/views/             # application-owned shared views/components
├── public/                      # public document root and product assets
├── database/seeders/            # optional application-wide seeders
├── src/
│   ├── main.rs
│   ├── service_provider.rs      # composition root; no product route definitions
│   ├── routes/web.rs            # composes owner-provided routes + global middleware
│   ├── website/                 # public website panel, pages, and exceptional routes
│   ├── system/                  # Numerimondes-specific extensions to Feluqa Core
│   └── business/
│       ├── crm/                 # a Feluqa business module
│       │   ├── module.toml
│       │   ├── panel.rs         # panel/resource/page registration
│       │   ├── resources/
│       │   ├── pages/
│       │   ├── features/        # optional finer business capabilities
│       │   ├── routes.rs        # exceptional custom routes only
│       │   ├── services.rs
│       │   ├── policies.rs
│       │   ├── migrations/{sqlite,postgresql}/
│       │   └── seeders/
│       └── finance/             # another unit, same default database
├── tests/                       # cross-struct and application integration tests
└── storage/                     # mutable POSIX-owned runtime state
```

The target deliberately has no generic `src/app/` and `src/modules/` buckets.
Code lives with the surface or business capability that owns it. A business
unit may contain subdomains or features. These directory names organize the
application; each `.rs` file still participates in Rust's ordinary module
namespace.

## Vocabulary

- A **Feluqa module** is a business/platform unit such as CRM, finance, HR,
  inventory, procurement, manufacturing, or project management. It can register
  migrations, resources, pages, widgets, routes, policies, and services.
- A **feature** is a smaller capability inside a Feluqa module, such as CRM
  contacts or opportunities. It is not automatically independently installed.
- A **module Rust** is a Rust language namespace declared with `mod` or
  `pub mod`. Use the full term “module Rust” when discussing Rust namespaces;
  do not confuse one with a Feluqa module.
- A **panel** is a user-facing surface with its own provider, path, navigation,
  authentication/ACL rules, resources, pages, and widgets. The public website,
  Feluqa Core `/system`, and business ERP `/admin` are all panels.

## Ownership and composition

- `feluqa.toml` selects a statically compiled Rust service provider. The
  provider composes panels and business units; it is not a place for every
  route, controller, or resource implementation.
- Routes belong to the website, panel, or Feluqa module that owns their
  behavior. `src/routes/web.rs` only composes those route providers and applies
  global middleware. A normal resource route should come from the panel/resource
  registration, not a handwritten product route list.
- A Feluqa module usually registers its resources with a panel. Feluqa should
  provide standard CRUD pages, navigation/cluster integration, and ACL checks
  from the resource declaration. Custom pages and widgets extend that default.
  Resources may be assigned to a navigation cluster or declared unclustered.
- A custom route may return a view or controller response, and may be public or
  protected. Protected handlers must enforce middleware and server-side policy;
  hiding a navigation item is not authorization.
- ERP modules use one shared application database through the `default`
  connection unless a concrete integration requires another named connection.
  Per-dialect migration directories (`sqlite`, `postgresql`, etc.) describe SQL
  compatibility; they do not imply one database per module.
- Seeders are separate from migrations. A module may own its seeders; application
  wide seeders belong under `database/seeders/`.
- Application website and business views/assets are product-owned. Shared panel
  theme, components and browser assets belong to the Feluqa framework crates.
  The current Filament theme and component catalog are **not fully imported**;
  see [Filament port status](FILAMENT_PORT_STATUS.md).
- Cross-struct tests belong in `tests/`; private unit tests may stay alongside
  implementation. For binary applications, test support can be included as a
  test-only module; each top-level `tests/*.rs` is a separate Cargo integration
  crate.
- `storage/` contains mutable service data and is resolved from configuration,
  not from the process working directory. Keep it out of source control and
  public assets.

## Current Numerimondes tree

Numerimondes still has `src/app/` and `src/modules/`. Treat this as a
transitional implementation, not the target architecture above. In particular,
the public site, framework Core integration, business code, route composition,
and module manifests have not all been refactored to the domain-owned layout.
Do not describe the move as complete until the source tree and scaffold have
actually changed.

Framework-owned panel views and assets already remain in their framework
crates, including `feluqa-panel` and `feluqa-system-panel`; generated apps must
consume them rather than copy them. This ownership fact does not mean the
Filament theme, Blade component catalogue, or behaviors have achieved parity.

## Related contracts

- [Web profile and shared database design](WEB_PROFILE.md)
- [Panels, resources, SDUI and Live status](PANELS_COMPONENTS.md)
- [Filament/Webkernel port inventory](FILAMENT_PORT_STATUS.md)
- [Proprietary licensing](../licensing/PROPRIETARY.md)
