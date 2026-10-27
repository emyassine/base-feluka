# Data ownership and security

## Data stays with the installation

Feluqa is intended for organizations that want to control their software and
data on infrastructure they operate or choose. The platform uses configured
storage paths and database connections. Production backups, restore drills,
retention periods, encryption at rest and operational monitoring must be
defined for each deployment; do not infer that they are all provided by the
current code.

## Shared ERP database

Modules in one Numerimondes installation share the application database via
the `default` connection unless an integration needs a named connection. A
module owns its tables and migrations, not a separate database by default.
Named connections are available for legacy systems, analytics warehouses or
external services. SQL migration variants such as SQLite and PostgreSQL
describe dialect support, not separate databases per module.

## Security controls already present

The current Core implementation includes password hashing, server-side
sessions, CSRF verification, role grants, audit events and tenant-bound
principals. Numerimondes CRM checks tenant/record ownership and field-level
grants. HTTP tests cover allowed and denied paths in the documented test
configurations.

## Important limits

Runtime module installation, domain-scoped license enforcement, complete
production multi-instance session management, backup/restore qualification,
and the full enterprise operations surface remain incomplete. Review the
[current delivery status](../index.en.md) before planning a production rollout.
