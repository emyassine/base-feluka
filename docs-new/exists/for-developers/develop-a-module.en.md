# Develop a Feluqa module

## Choose the package shape

A module is a Rust library package installed into Feluqa; it is not a second
Feluqa server. A focused module can own all its capabilities. A composed
product such as Numerimondes can group business modules under `business/` or
another developer-chosen folder. Generic `src/app/` or `src/modules/` buckets
are allowed when useful, but domain-owned paths are the recommended default.

```text
my-module/
├── Cargo.toml
├── feluqa-module.toml       # target manifest contract; packaging is pending
├── resources/views/
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
│   └── migrations/{sqlite,postgresql}/
└── tests/
```

## Current development workflow

The present CLI can scaffold and run a compiled web product inside this
monorepo. `feluqa dev` watches Rust source, views, configuration and migration
inputs, then rebuilds and restarts the development process. Follow the current
[CLI guide](../reference/cli/commands.en.md) and the repository
[quick start](../../../README.md).

The package format illustrated above is the target for installable modules.
Today, module registration is static and linked into the compiled product.
System-panel installation, package compatibility resolution, license checks,
domain activation and safe upgrade/uninstall are not implemented.

## Keep ownership clear

Put resources, pages, policies, migrations, seeders and business services with
the module that owns them. Use Rust `mod`/`pub mod` only to organize source;
call those language namespaces **Rust modules** to distinguish them from
Feluqa modules. Seeders are separate from migrations.

Next: [add a panel resource and page](panels-resources-and-pages.en.md).
