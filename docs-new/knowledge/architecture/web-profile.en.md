# Web profile architecture

This document records the design boundaries for the Web target. Current
capabilities and gaps belong in the [implementation guides](../../exists/index.en.md).

## Runtime boundary

The Web profile uses Tokio, Axum and Tower for asynchronous HTTP. Database,
view compilation and browser delivery remain behind the `feluqa::...` facade.
Other target profiles share schemas and application contracts where useful,
but do not inherit the Web runtime.

## Application composition

An application selects a statically compiled Rust service provider from its
Feluqa manifest. Providers register owned routes, panels, resources, views,
services and module implementations. The process composition root combines
those providers and global middleware. Product URLs do not belong in framework
crates or the generic composition root.

## Database boundary

Modules in one installation share the `default` application database unless
they declare a named integration connection. Each module owns its table
migrations and seeder definitions. SQL migrations have the same identity in
each supported dialect folder; the build embeds the variants and the runner
selects by connection dialect and records checksums.

SQLite and PostgreSQL are the current supported drivers. Additional drivers
require matching configuration, migrations, integration coverage and an
explicit support claim.

## Request and authorization boundaries

Routes adapt HTTP inputs into services. Services own business operations and
transactions; policies decide access. Handlers validate session and CSRF as
required, then apply grants, tenant/record scope and input validation. Apply
record and tenant restrictions in database queries. UI schema and navigation
visibility do not enforce authorization.

## Remaining design work

Generic resource persistence/actions, complete panel/component APIs, dynamic
module lifecycle, production license and activation checks, browser Live
reconciliation, standalone generated-app builds and deployment/restore
qualification remain open. The [delivery plan](../../_todo/enterprise-delivery.en.md)
tracks acceptance criteria.

## Performance objectives

The current target budgets are under 10 ms for a warm dynamic business
request, including authorization, a database query and rendering, and under
50 µs for warm static-file handling on the server, excluding network round
trip. These are goals, not guarantees or results. Reports must include median,
p95 and p99, host/OS, compiler profile, response size, concurrency, cache and
database temperature, sample count and instrumentation. Pool startup, process
startup, cold storage and network latency are separate measurements. A failed
target stays visible in the report; do not change the budget to make a result
pass. See the [M0 measurements](../../exists/reference/research/m0-results.en.md)
for the scope and limits of existing evidence.
