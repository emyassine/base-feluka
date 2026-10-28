# Enterprise delivery plan

This plan defines the remaining delivery tracks, rough engineering effort and
acceptance evidence. Estimates are person-days for an experienced Rust
engineer, including review and verification; they are planning ranges, not
dates or a commercial quote. Parallel work and external deployment access may
change calendar time. `exists/` describes what has actually been verified.

## Delivery tracks and estimates

| Track | Rough effort | Current gap and acceptance evidence |
|---|---:|---|
| F0. Webkernel language/component inventory and shared conformance fixtures | 3–5 days | Complete the directive/component matrix and connect compiler, Tree-sitter and editor fixtures. |
| F1. `.view.rs` compiler | 10–16 days | Initial compiler exists; finish the grammar contract, diagnostics and conformance checks across build profiles. |
| F2. Tree-sitter and Zed | 6–10 days | Grammar/package generation exist and a representative parser smoke sample succeeds; port stateful HTML tag matching/recovery, add shared compiler/grammar fixtures, then install in a pinned Zed release and verify suffix detection, injections, highlighting and recovery. Global IDE CLI commands are estimated separately at 2–4 days. |
| F3. Components and SDUI | 12–20 days | Initial schema and renderer exist; add typed props/slots, accessible forms, theme APIs and browser-tested behavior. |
| F4. Data, Core and panels | 15–25 days | Database, auth and vertical panel slices exist; finish generic resources/actions, tenant lifecycle, PostgreSQL HTTP coverage and restore. |
| F5. Live actions | 10–18 days | Signed typed dispatch exists; add shared replay protection, client reconciliation/focus handling and failure/reconnect tests. |
| F6. Sites, CLI and deployment | 8–14 days | Local scaffold/watcher exist; validate standalone builds, a second independent site, production deployment and rollback. |
| F7. Installable module lifecycle | 12–20 days | Static lifecycle exists; implement artifact compatibility/signatures, licensing, domain activation, staging, recovery and safe uninstall/data retention. |
| F8. Leptos panel UI migration | Unestimated pending build spike | Replace Filament-derived panel UI with Feluqa-owned Leptos components behind `feluqa::ui::component`; integrate SSR and hydration with Axum, migrate all panel pages/interactions, verify light/dark and responsive behavior, then remove unused Filament assets. Acceptance and sequencing are in [the Leptos UI migration contract](../knowledge/architecture/leptos-ui.en.md). |

These tracks have dependencies and some can run in parallel. Do not sum the
ranges as a committed schedule; re-estimate after each acceptance gate exposes
the actual integration work.

The global `feluqa support:ide ...` command family and its context rules are
specified in the [IDE support plan](editor/ide-support-commands.en.md). These
commands are available regardless of app/module/workspace context; they are
not implemented yet.

## Release gates

- **Platform module lifecycle:** signed package compatibility, license and
  permission checks, per-domain activation, staged upgrade/recovery, disable
  and explicit data-retention behavior.
- **Module developer experience:** concise providers, panels, resources, pages,
  clusters, widgets, CRUD adapters, migrations, seeders and standalone builds.
- **Enterprise panels:** complete Feluqa Leptos theme/component system,
  accessible forms/tables/actions/notifications, responsive Core panel and
  first-class public-site panel composition; see F8. Filament parity is no
  longer the target.
- **Security and data:** server-side authorization on every action,
  tenant/record isolation, PostgreSQL HTTP coverage, audit and a verified
  restore drill.
- **Operations:** production deployment, graceful shutdown, observability,
  backup/restore runbooks and security/documentation review.

Do not call the platform enterprise-ready until each applicable gate has an
end-to-end application test and operational evidence.
