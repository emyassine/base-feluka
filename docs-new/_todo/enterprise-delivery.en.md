# Enterprise delivery plan

This English summary points to the execution plan and its acceptance gates.
The detailed task list remains in
[enterprise-delivery.fr.md](enterprise-delivery.fr.md) until the full plan is
translated. Treat both as planning documents; `exists/` describes what has
actually been verified.

## Required delivery tracks

1. **Platform module lifecycle:** package format, compatibility, signature and
   license checks, per-domain activation, staged upgrades, recovery, disable
   and safe uninstall/data retention.
2. **Module developer experience:** module scaffolding, providers, panels,
   resources, pages, clusters, widgets, CRUD adapters, migrations, seeders and
   standalone builds.
3. **Enterprise panels:** complete Filament-compatible theme and component
   system, accessible forms/tables/actions/notifications, and public websites
   as first-class panel instances.
4. **Security and data:** server-side policies on every action, tenant/record
   isolation, PostgreSQL HTTP coverage, audit, backups and verified restore.
5. **Operations:** production deployment, graceful shutdown, observability,
   backup/restore runbooks and security/documentation review.

Do not call the platform enterprise-ready until each applicable acceptance
gate has an end-to-end product test and operational evidence.
