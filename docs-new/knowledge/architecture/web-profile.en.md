# Web profile architecture

Feluqa is the server platform; a module is compiled against it and installed
into the platform. This document describes the current web-profile foundation
and its remaining gaps. See [platform/module layout](platform-module-layout.en.md)
for module packaging and [product intent](../intent.en.md) for the operator
lifecycle.

## Current implementation

The workspace contains the `feluqa` facade, Axum/Tokio web profile, SeaORM
database layer, typed TOML configuration, named SQLite/PostgreSQL pools,
checksummed dialect SQL migrations, compiled `.view.rs` templates, auth/session
and CSRF support, resource/panel registries, SDUI rendering, signed Live
actions and a framework-owned System panel crate. Numerimondes currently
statically composes those crates and demonstrates account/role administration,
tenant listing/provisioning, migration/audit pages, and initial tenant-scoped
CRM CRUD.

This is a development/product binary, not the final module installer. The
System panel does not yet dynamically install packaged modules or enforce
licenses per domain. Numerimondes still contains transitional `src/app/` and
`src/modules/` trees; domain-owned layout is recommended, but developers may
choose another structure.

## Database model

Modules that belong to one Numerimondes installation share the `default`
application database. Modules own their tables and migrations, not isolated
databases. Additional named connections are explicit integration boundaries.
Each declared SQL dialect must provide matching migration identities. The
runner records checksums and applies the matching dialect variant.

## Request and access boundaries

Routes adapt HTTP input to services. Services own business operations and
transactions; policies decide access. A handler validates session, CSRF when
required, grants, tenant/record scope and input independently of navigation
visibility. The resource renderer filters tables/forms, but custom operations
still require server-side checks.

## Open work

Generic resource persistence/actions, complete Filament-like panel resources
and components, dynamic module lifecycle, production license/activation
checks, full browser Live reconciliation, full ERP workflows, standalone
generated-module builds, and deployment/restore qualification remain open.
Follow the [delivery plan](../../_todo/enterprise-delivery.en.md).
