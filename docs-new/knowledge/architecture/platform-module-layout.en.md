# Platform and installable module layout

## Ownership model

Feluqa is the installed server platform. It owns the runtime, built-in System
panel, shared services, panel APIs, security contracts and module lifecycle.
A Feluqa module is authored against that platform and registers its
capabilities with it. It is not a second Feluqa server and does not copy the
System panel or shared panel framework.

The System panel is a Feluqa capability. Operators use it to select domains,
install/configure compatible modules and grant permitted capabilities. The
target lifecycle includes package integrity and compatibility checks,
licensing, domain activation, migrations, upgrades/recovery, disable and
uninstall with explicit data-retention behavior. Runtime installation,
licensing enforcement and the complete lifecycle are not implemented yet;
current registration is statically compiled.

## Two product-source shapes

A source may represent one installable module or a composed module containing
multiple business domains. Folder names are chosen by the developer and do
not themselves define platform packaging or lifecycle boundaries.

### One module

```text
products/customer-identity/
├── Cargo.toml
├── feluqa-module.toml
├── build.rs
├── resources/views/
├── public/
├── src/
│   ├── lib.rs
│   ├── provider.rs
│   ├── panel.rs
│   ├── resources/
│   ├── pages/
│   ├── features/
│   ├── routes.rs
│   ├── services.rs
│   ├── policies.rs
│   ├── migrations/{sqlite,postgresql}/
│   └── seeders/
└── tests/
```

### Composed module

```text
products/business-platform/
├── Cargo.toml
├── feluqa-module.toml
├── build.rs
├── resources/views/
├── public/
└── src/
    ├── lib.rs
    ├── provider.rs
    ├── website/                 # optional public site/panel contribution
    └── business/
        ├── crm/
        │   ├── module.toml
        │   ├── provider.rs
        │   ├── resources/
        │   ├── pages/
        │   ├── features/
        │   ├── routes.rs
        │   ├── services.rs
        │   ├── policies.rs
        │   ├── migrations/{sqlite,postgresql}/
        │   └── seeders/
        └── finance/
            ├── module.toml
            ├── provider.rs
            └── migrations/{sqlite,postgresql}/
```

Child business domains may be bundled into one installable package or exposed
as separate modules, according to the product's packaging decision. The
directory name `business/` is a convention, not a required runtime location.

## Vocabulary

- **Feluqa platform:** installed host and framework services, including the
  System panel and module lifecycle.
- **Feluqa module:** a platform package with manifest/provider, capabilities,
  permissions and panel contributions.
- **Business module:** a business domain within a composed source; it is
  independently installable only when packaging declares it so.
- **Feature:** a narrower capability inside a module, such as a CRM pipeline.
- **Rust module:** a language namespace declared by `mod` or `pub mod`; it does
  not imply a Feluqa package boundary.
- **Panel:** Feluqa's shared UI runtime configured for a domain or module. A
  module registers resources/pages with a panel instance; it does not ship a
  separate panel implementation.

## Database ownership

Modules in one product/platform installation use the shared `default`
connection unless a concrete external integration requires a named pool. Each
module owns its tables, migrations and seeders; it does not receive an isolated
database by default. SQLite and PostgreSQL variants belong under the same
migration identity. A module declares the dialects it supports and supplies a
matching migration set for each.

Seeders are separate from migrations. They are explicitly registered and
invoked by stable IDs; they are not executed by the schema migration runner.

## Composition and security

The module provider declares services, routes and panel contributions. Route
files stay with the website, panel or module that owns behavior; the process
composition root combines providers and applies global middleware. Shared
framework panel views/assets stay in Feluqa crates; module-specific views and
assets stay with their module.

Every server action enforces authorization regardless of navigation
visibility. Policies and services apply tenant, record and field scope in
queries and mutations. A package manifest and provider must not be treated as
proof of license entitlement; the platform must validate compatibility,
signature, license and operator permissions during installation/activation.

## Layout guidance

Prefer domain-owned folders (`website/`, `business/crm/`, `business/finance/`)
when they clarify ownership. Generic `src/app/` and `src/modules/` buckets are
allowed when the developer has a reason, but they are not the default scaffold
recommendation. Product-specific trees and transitional paths are documented
under [product implementations](../../exists/products/index.en.md).
