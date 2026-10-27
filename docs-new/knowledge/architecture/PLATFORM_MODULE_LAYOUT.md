# Feluqa platform and installable modules

## Platform model

**Feluqa is the platform.** An operator installs Feluqa on a server and uses
its built-in **System panel** to manage that installation and its domains.
Developers create **Feluqa modules** that can be installed into the platform.
Examples include an HRM module, a CRM module, or the Numerimondes platform
module. A module is authored against Feluqa; it is not a separate web app that
reimplements or brings its own copy of the panel framework.

The System panel is part of Feluqa. For a domain/installation, an authorized
operator installs or configures a module there, subject to its license and the
permissions granted for that domain, then uses the capabilities available to
them. The module registers its panel configuration, resources, pages, widgets,
routes and permissions through Feluqa's framework APIs. Feluqa supplies the
panel shell, shared components, Core operations and enforcement points.

The long-term product-source layout has two shapes: one installable module, or
a larger module/product source that groups multiple business modules under
`business/` or another folder chosen by the developer. Numerimondes is the
latter kind of platform module. Generic `src/app/` and `src/modules/` buckets
are allowed when they fit the developer's design, but are not recommended by
default. Numerimondes' current tree still has those transitional directories;
the examples below do not claim that refactor is complete.

## Vocabulary

- A **Feluqa platform** is the server runtime and framework installation,
  including System panel, module installation/configuration, domains, license
  checks, ACL and shared runtime services.
- An **installable Feluqa module** is a developer-authored unit/package loaded
  into the platform, such as HRM or Numerimondes. Its licensed capabilities
  and domain configuration determine what an operator can use.
- A **business module** is a domain unit inside a larger product/module source,
  such as CRM or finance under Numerimondes `business/`. Whether it is
  independently installable is an explicit packaging/lifecycle decision.
- A **feature** is a smaller capability, such as CRM contacts or pipeline. It
  is not independently installable unless explicitly packaged as a module.
- A **module Rust** is only a Rust language namespace declared with `mod` or
  `pub mod`. Say “module Rust” for that meaning; Rust file organization does
  not determine Feluqa module packaging or lifecycle.
- A **panel** is the Feluqa-provided UI system instantiated/configured for a
  domain or module. Feluqa's System panel is built in. An installable module
  registers its resources/pages with a panel instance; it does not implement a
  separate panel framework.

## Shape A: one installable module

Use this for a focused deliverable such as HRM or an authentication service.
This is a module source package, not a standalone Feluqa server installation.

```text
products/numerimondes-auth-service/
├── Cargo.toml                 # module crate and Feluqa API dependencies
├── feluqa-module.toml         # identity, compatibility, license/capabilities
├── build.rs                   # compiles .view.rs and embeds migrations
├── resources/views/           # module-owned views and components
├── public/                    # module-owned assets, if any
├── src/
│   ├── lib.rs                 # module entry/registration
│   ├── provider.rs            # module services, routes and panel declarations
│   ├── panel.rs               # resources, pages, clusters, widgets
│   ├── resources/
│   ├── pages/
│   ├── features/              # optional internal capabilities
│   ├── routes.rs              # exceptional routes only
│   ├── services.rs
│   ├── policies.rs
│   ├── migrations/{sqlite,postgresql}/
│   └── seeders/
└── tests/
```

Feluqa supplies the panel APIs and System panel. The module declares what it
contributes; the platform installs it, checks compatibility/license and
permissions, and exposes its registered capabilities on the configured
domain.

## Shape B: Numerimondes composed of multiple business modules

Use this for a larger product/module source that groups domains under
`business/`. The operator still installs/configures the Numerimondes module
through Feluqa System. Depending on packaging policy, child business modules
may be bundled together or independently installable.

```text
products/numerimondes/
├── Cargo.toml
├── feluqa-module.toml         # Numerimondes platform module metadata
├── build.rs
├── resources/views/           # shared Numerimondes views/components
├── public/                    # Numerimondes assets
├── src/
│   ├── lib.rs
│   ├── provider.rs            # registers product capabilities with Feluqa
│   ├── website/               # optional public website panel contribution
│   └── business/              # business modules composed by Numerimondes
│       ├── crm/
│       │   ├── module.toml
│       │   ├── provider.rs
│       │   ├── resources/     # contacts, companies, opportunities
│       │   ├── pages/
│       │   ├── features/      # pipeline, scoring, etc.
│       │   ├── routes.rs      # exceptional custom routes
│       │   ├── services.rs
│       │   ├── policies.rs
│       │   ├── migrations/{sqlite,postgresql}/
│       │   └── seeders/
│       └── finance/
│           ├── module.toml
│           ├── provider.rs
│           └── migrations/{sqlite,postgresql}/
└── tests/
```

The platform's System panel and Feluqa Core are not copied into this source.
`provider.rs` declares module capabilities and their registration into
Feluqa-provided panel instances. Module-specific settings and operations are
declared by the module and exposed through its registered resources/pages.

## Install, configure, authorize, use

The intended lifecycle is:

1. A developer builds/packages a Feluqa module against a declared Feluqa
   compatibility range and lists its capabilities and requirements.
2. An operator selects the module in Feluqa System for a domain/installation.
3. Feluqa validates package integrity, compatibility, license, requested
   capabilities and operator permission before installation/activation.
4. The operator configures the module's settings and grants access using
   Feluqa's ACL/policy mechanisms.
5. Feluqa registers the module's panel contributions, resources, routes and
   migrations; users access only the licensed and authorized capabilities.
6. Upgrade, disable, uninstall and recovery follow explicit lifecycle rules;
   uninstall must not silently destroy business data.

This is the target contract, **not a claim that runtime module installation is
already implemented**. Current module registration is static in the compiled
product. Installable artifacts, compatibility resolution, license enforcement,
domain-scoped activation, upgrade/rollback and uninstall/data-retention flows
remain to be built. See [delivery plan](../../_todo/ENTERPRISE_DELIVERY.md).

## Shared data, routes, views and tests

Modules within one Numerimondes ERP installation use the shared application
database through `default` unless a concrete integration requires a named
connection. Each business module owns its migrations/tables; it does not get a
private database by default. Named connections are for legacy databases,
analytics warehouses or external systems. Dialect variants such as
`migrations/sqlite/` and `migrations/postgresql/` describe SQL compatibility,
not one database per module. Seeders are separate from migrations and can be
module-owned or product-bundle-wide.

A module usually registers resources/pages into a Feluqa panel instance. Feluqa
is intended to supply standard CRUD pages, ACL checks, forms, tables,
navigation and clusters from short declarations. Resources may be clustered or
unclustered; custom pages may compose `.view.rs` fragments and widgets.
Exceptional routes may return views or controller responses and may be public
or protected by explicit middleware and server-side policies. Hiding a link is
never authorization.

`feluqa-module.toml` selects/declares the module package; Rust provider code is
statically compiled today. Routes belong to their website or module owner.
The route composition layer only combines registered route providers and
global middleware. Product/module views and assets are module-owned; shared
panel theme/components/browser assets belong to Feluqa crates. The Filament
theme and component catalog are **not fully imported**; see
[Filament port status](../../exists/architecture/FILAMENT_PORT_STATUS.md).

Cross-struct tests belong in `tests/`; private unit tests may remain beside
implementation. For binary products, test support can be included as a
test-only module; each top-level `tests/*.rs` is a separate Cargo integration
crate. Mutable service data lives in configured POSIX-owned platform storage,
not in the public root or source control.

## Current state and related contracts

Numerimondes already exists as product/module source within this Feluqa
monorepo, but its runtime registration is currently static and its tree retains
transitional `src/app/` and `src/modules/` directories. The target module
ownership layout and System-panel installation lifecycle are not yet fully
implemented.

- [Web profile and ERP database design](WEB_PROFILE.md)
- [Panels, resources, SDUI and Live status](../../exists/architecture/PANELS_COMPONENTS.md)
- [Filament/Webkernel port inventory](../../exists/architecture/FILAMENT_PORT_STATUS.md)
- [Proprietary licensing](../policy/PROPRIETARY.md)
