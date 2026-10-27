# Develop a Feluqa module

## Choose the package shape

A module is authored against Feluqa; it is not a second Feluqa server. Decide
whether its installable boundary contains one capability or composes several
business domains. Keep resources, policies, migrations, seeders and services
with the domain that owns them. The [module layout reference](../../knowledge/architecture/platform-module-layout.en.md)
shows both source shapes and explains how Feluqa modules differ from Rust
modules.

## Current development workflow

The present CLI can scaffold and run a compiled web product inside this
monorepo. `feluqa dev` watches Rust source, views, configuration and migration
inputs, then rebuilds and restarts the development process. Follow the current
[CLI guide](../reference/cli/commands.en.md) and the repository
[quick start](../../../README.md).

The installable package format is still a target contract. Today, module
registration is static and linked into the compiled product.
System-panel installation, package compatibility resolution, license checks,
domain activation and safe upgrade/uninstall are not implemented.

## Keep ownership clear

Put resources, pages, policies, migrations, seeders and business services with
the module that owns them. Use Rust `mod`/`pub mod` only to organize source;
call those language namespaces **Rust modules** to distinguish them from
Feluqa modules. Seeders are separate from migrations.

Next: [add a panel resource and page](panels-resources-and-pages.en.md).
