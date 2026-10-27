# Data ownership and security

## Data stays with the installation

Feluqa is intended for organizations that want to control their software and
data on infrastructure they operate or choose. The platform uses configured
storage paths and database connections. Production backups, restore drills,
retention periods, encryption at rest and operational monitoring must be
defined for each deployment; do not infer that they are all provided by the
current code.

## Data responsibility

The platform installation owns its configured databases and storage. Modules
own their schemas and migration history; they do not get isolated databases
automatically. Operators should define retention, backup and restore policy
for the installation. Technical connection and dialect behavior is covered
in the [developer migration guide](../for-developers/data-and-migrations.en.md).

## Security controls already present

The current Core implementation includes password hashing, server-side
sessions, CSRF verification, role grants, audit events and tenant-bound
principals. Resource authorization supports tenant/record ownership and
field-level grants. HTTP tests cover allowed and denied paths in the
documented test configurations.

## Deployment responsibilities

Production multi-instance session management, backup/restore qualification,
and the full enterprise operations surface remain incomplete. Review the
[platform availability](platform-overview.en.md) before planning a production
rollout. Module lifecycle availability is covered in [licensing and domains](modules-domains-and-licensing.en.md).
