# Store data and run migrations

## Share the installation database

Modules in the same Numerimondes installation use the `default` connection by
default. Each module owns its tables and migration files, but does not receive
an isolated database automatically. Declare a named connection only for an
actual external, legacy or analytics integration.

## Provide dialect variants

Store SQL migrations with the module and provide the same migration identity
for each supported dialect, for example:

```text
migrations/
├── sqlite/0001_create_customers.sql
└── postgresql/0001_create_customers.sql
```

The build embeds declared migrations and checks that supported dialects have
matching identities. The runner tracks checksums and applies the variant for
the selected connection. Migrations change schema; seeders populate data and
belong in separate files/directories.

## Current database foundation

Feluqa uses SeaORM with SQLite and PostgreSQL pools and named connections.
Numerimondes has CRM migration variants for SQLite and PostgreSQL. Migration
application is explicit and recorded. Rollback does not restore deleted data;
use reviewed expand/contract changes for destructive schema evolution.

See [the web profile contract](../../knowledge/architecture/web-profile.en.md)
for the current migration registry and multi-database limits.
