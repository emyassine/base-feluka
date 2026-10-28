# Service Crates

Services provide reusable platform capabilities behind defined APIs. Products and modules compose these capabilities through the Feluqa facade or documented contracts instead of duplicating infrastructure logic.

## Packages in this folder

- `feluqa-auth` provides authentication and authorization contracts.
- `feluqa-database` provides named database connections and dialect-aware migrations, currently using SeaORM with SQLite and PostgreSQL.
- `feluqa-imagery` provides bundled icon assets and their required notices.
- `feluqa-live` provides signed, typed action dispatch and related authorization checks. Full browser reconciliation and production shared replay protection remain incomplete.
- `feluqa-notifications` provides notification data and mailbox contracts.

Services own business operations and enforce access rules. UI visibility does not authorize a request. Keep web-only adapters out of portable contracts and follow the service’s own README or `DEPENDENCIES.md` when present.

OIDC, offline identity and licensing, disconnected synchronization, complete real-time collaboration and enterprise operations are not implied by the packages’ presence. Their implementation and acceptance are tracked in the [roadmap](../../docs-new/999-roadmap/01.index.en.md).
