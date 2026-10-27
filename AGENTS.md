# Feluqa — instructions for contributors and coding agents

Scope: this monorepo, excluding preserved historical evidence when a rule would alter recorded results. Read [docs/README.md](docs/README.md) first. This file summarizes the project's contracts; the linked documents contain their details. User instructions take precedence. Record new decisions in docs and update this summary when the contract changes.

## Goal and honest status

Feluqa is one proprietary NUMERIMONDES ecosystem and namespace for web, SPAs, mobile, desktop, games, APIs and real-time systems. Share tooling, schemas and libraries; retain separate runtime profiles. Web delivery is the first product priority. Enterprise quality requires verified operational and security capabilities, not directory structure or a published crate.

Current implementation: `feluqa` facade with opt-in target features; no_std authz/UI-schema/panel/resource-registry/module-lifecycle contracts; framework-owned `feluqa-system-panel`; HMAC-signed, typed, replay-guarded Live action dispatch; build-time `.view.rs` compiler/runtime; bundled Filament-derived panel browser assets; and `feluqa-imagery` with 7,681 Lucide, Simple Icons and Heroicons SVGs plus preserved notices. App composition roots can be selected with `app.service_provider` in `feluqa.toml` and are statically compiled Rust. Cross-struct binary-app tests live under `tests/support/` and are included as test-only modules; direct `tests/*.rs` remain independent Cargo integration crates. `feluqa-database` uses SeaORM 1.1.20, SQLite/PostgreSQL, named pools and embedded dialect SQL migrations/checksums. `feluqa-core` provides identity/session/audit/tenant migrations and tested bootstrap, Argon2id login, server-side sessions, CSRF, logout, tenant-bound principals, role grants/delegation and audit. Numerimondes wires MVC, `/system` account/role operations and tenant listing/provisioning, system migration/audit pages, and CRM CRUD at `/admin` with tenant/record ownership and field-level checks. Still missing: full Filament-compatible Rust panel/provider/resource/action/page/component APIs (including treating a public website as a first-class panel), tenant updates/deactivation/deletion in `/system`, generic CRUD adapters, installable module lifecycle, browser Live reconciliation/shared replay, full ERP workflows, PostgreSQL HTTP coverage for tenant scoping, standalone generated-app build outside the checkout, deployment/restore and enterprise release. Vendored browser theme/runtime assets do not imply feature parity with Filament. Never describe those missing capabilities as implemented.

## Documentation map and precedence

| Read for | Canonical document |
|---|---|
| Immediate work, dependencies, estimates and acceptance | [Enterprise delivery plan](docs/planning/ENTERPRISE_DELIVERY.md) |
| `.view.rs`, directives, includes, layouts, escaping and compilation | [View language](docs/views/LANGUAGE.md) |
| Core/system and business panels, components, SDUI, Live, lifecycle | [Panels and components](docs/architecture/PANELS_COMPONENTS.md) |
| Web MVC, ERP modules, named databases, dialect migrations | [Web profile architecture](docs/architecture/WEB_PROFILE.md) |
| Product/workspace directory ownership and provider composition | [Project layout](docs/architecture/PROJECT_LAYOUT.md) |
| Zed extension, Tree-sitter and language tooling | [Zed product](docs/editor/ZED.md) |
| Mandatory Rust rules | [Coding standard](docs/standards/RUST_CODING_STANDARD.md) |
| Current CLI and planned commands | [CLI](docs/CLI.md) |
| Ecosystem decisions and target profiles | [Decisions](docs/architecture/DECISIONS.md) |
| Earlier scope and broad estimates | [Initial roadmap](docs/planning/ROADMAP.md) |
| Deferred questions | [Later decisions](docs/architecture/DECISIONS_LATER.md) |
| Proprietary distribution and registry | [Licensing](docs/licensing/PROPRIETARY.md) and [LICENSE](LICENSE) |
| Measured language comparison, limits and evidence | [M0 results](docs/research/M0_RESULTS.md) |

The newer delivery plan and domain contracts refine the earlier roadmap. In particular, basic views/components/SDUI precede the Core panel; historical milestone M4 is not permission to delay these prerequisites. Historical measurements are evidence, not general production guarantees.

## Repository ownership

- `_crates/`: Cargo workspace root, lockfile and reusable libraries; facade APIs under `feluqa::...`.
- `products/`: runnable products/applications, CLI and future Zed/grammar products. Numerimondes-specific content stays in its product.
- Routes are declared by the owning site, panel or module; `src/routes/web.rs` only composes route providers and applies global middleware. Don't add product paths to the composition root.
- `docs/`: decisions, contracts, estimates, standards and evidence summaries.
- `target/`: generated build/package output, ignored by Git. `.cargo/config.toml` selects this location.
- No Cargo manifest/lockfile or rustup toolchain pin at repository root. Product manifests point explicitly to `../../_crates` when members of this workspace.
- `products/__M0/`: retained benchmark source and evidence. Preserve raw reports, snapshots and hashes; update navigational docs without rewriting measurements.
- Do not create empty crates to simulate progress. Add a crate with its first useful contract and integration.

## Rust and dependencies

Every handwritten crate root and generated application entrypoint starts with `#![no_implicit_prelude]`. Import items, macros and traits explicitly. Apply the lint policy in the coding standard; no blanket lint suppression. No `unwrap`/`expect` on production input paths; use typed errors with context. Review unsafe boundaries and keep them small; use `forbid(unsafe_code)` where appropriate.

Use `feluqa::view`, `feluqa::console` and future documented facade modules. `extern crate feluqa::view;` is not valid Rust: import the root crate when required by strict mode, then use `feluqa::view` or `use feluqa::view;`.

Use established libraries for concrete needs: Tokio/Axum/Tower for web runtimes, Serde for typed/versioned schemas/config, existing Rust parsing tools where justified. Keep server dependencies out of kernel/real-time crates. Review dependency license, MSRV, target support and ownership before adoption. The manifest's MSRV is a requirement to verify; successful compilation on a newer compiler does not prove it.

## Views and editor contract

Canonical target suffix: `.view.rs`. These are HTML/Blade-inspired templates containing Rust, not ordinary Rust modules. Generate Rust into `OUT_DIR`. Current `.view` files must migrate together with build discovery, naming and invalidation.

V1 includes escaped `{{ expression }}`, typed raw HTML, `@rs/@endrs`, conditionals, loops, includes, layouts/sections and namespaced components/slots. Follow the language specification rather than inventing syntax per feature. Rust blocks are trusted developer code compiled into the app; never compile template code submitted by panel users.

Production views are compiled. The build-time compiler and Numerimondes consumer implement the initial language. `feluqa dev` polls app source/view/config/migration files and local `_crates` workspace source, compiles with the previous process still serving, and replaces it only after a successful build. Rust `@rs` is trusted source compiled into the application, not a sandbox. The scanner handles nested delimiters, strings/raw strings, chars/lifetimes and comments. Resolve declared view roots/namespaces and detect cycles. Props, slots, source locations and errors are explicit. URL attributes require validated `SafeUrl`; JavaScript and CSS interpolation remain prohibited without dedicated encoders.

Compiler and Tree-sitter currently have separate tests; a shared conformance corpus remains to be connected. The grammar/parser and Zed language queries are in `products/tree-sitter-feluqa-view` and `products/feluqa-zed`. Run the dev-extension generator, install it in Zed, and check suffix detection, highlights and Rust injections before claiming editor validation. Highlighting alone does not provide rust-analyzer semantics. Do not commit fabricated grammar repository URLs or revisions; the development script generates a local pinned grammar snapshot.

## Panels, security and operations

The `feluqa::panel` catalogue validates panel paths, schemas, system/business permission namespaces and collisions between page and resource routes. Numerimondes registers `/system`, `/admin`, Core users/roles/tenants/modules/connections/migrations/audit and CRM customers through this catalogue; dashboard authorization uses the registered page permissions. `feluqa::ui` validates/serializes a closed versioned schema and renders fixed HTML components, including forms, inputs, selects and tables. The CRM resource renderer filters table columns and generates create/update forms from declared input metadata and field grants; Core users, roles, tenants, modules, connections, migrations and audit pages use the shared resource table renderer. `/system/users` create and role-change forms and `/system/roles` create/update forms are generated from their resources, including escaped select/textarea content and operation-specific fields. Core mutations still pass through dedicated audited handlers; tenant creation atomically creates a tenant-scoped owner and records a platform audit event; role choices come from the Core delegation policy. Numerimondes inserts only renderer-produced HTML into compiled views. SQLite/PostgreSQL HTTP coverage includes same-origin CSRF, Core account/role administration, Live snapshot dispatch and replay denial, delegation checks, session revocation after role changes, record ownership, field-level CRM access and cross-user denial. Generic SeaORM CRUD adapters, tenant update/deactivation/deletion in `/system`, resource-driven actions for the remaining Core mutations and a complete accessible component catalogue remain to build. Core users, roles, audit records and CRM queries are scoped by the session tenant; the platform administrator can list tenants and create a tenant with its initial tenant-scoped administrator; tenant updates/deactivation/deletion are not implemented. `feluqa-core` owns dialect migrations and entities for users, roles, exact grants, assignments, sessions, bootstrap settings and audit. `CoreStore` provides Argon2id credentials, expiry/auth-version checks, CSRF verification, exact role-grant resolution and audit events. Password-change flows and production multi-instance session management remain unimplemented. `feluqa::live::LiveRuntime` issues permission-scoped short-lived snapshots and dispatches typed actions; Numerimondes exposes its authenticated HTTP transport in development. Its in-memory replay guard is not enabled outside development. `feluqa::module` orders and starts statically registered modules with rollback; application lifecycle wiring and installable artifacts remain pending.

Build Core and business panels using the same public components and SDUI schema. UI schemas describe presentation; services own business operations. Enforce authorization on every server action, independently of UI visibility. Separate platform, app-admin and end-user authority; preserve tenant and record isolation.

Live actions require typed input, session/CSRF validation, authorization, bounded work and a concurrency/replay policy. Signed client state must not contain secrets. Modules require deterministic lifecycle, explicit capabilities, compatibility checks, staging and recovery; code rollback is not data rollback.

`public/` is the document root. Mutable state lives in configured user-owned POSIX storage; confine paths and symlinks. Config is Serde-backed and validated. Keep secrets out of source, generated HTML, client snapshots and logs. Document backups/restores, migrations, graceful shutdown, limits and observability before declaring an enterprise release.

Keep handler elapsed time, whole server request duration and client-observed latency separate. Measure claims under a documented scenario; M0 microbenchmarks do not demonstrate production HA or hard real-time guarantees.

## Workflow and acceptance

Use the delivery plan's task IDs and acceptance criteria. Inspect the current code and documentation before choosing the next change. Implement complete vertical behavior with a representative product consumer, and keep implemented/planned status explicit. Update CLI templates and docs when changing the public DX.

From repository root:

```sh
cargo fmt --manifest-path _crates/Cargo.toml --all --check
cargo check --manifest-path _crates/Cargo.toml --workspace --all-targets --locked
cargo clippy --manifest-path _crates/Cargo.toml --workspace --all-targets --locked -- -D warnings
cargo test --manifest-path _crates/Cargo.toml --workspace --locked
```

Run checks appropriate to the change; documentation-only work needs link/consistency review rather than a full runtime suite. Compiler work requires rendering/error/compile-fail coverage; auth and filesystem work require denial and boundary cases. Report existing failures honestly; never hide them by relaxing policy. No server launch or production load test is required for a documentation change.

Feluqa remains proprietary. Existing private registry restrictions remain in place. Public distribution, including extension/grammar sources, needs an explicit user decision; earlier discussion of crates.io is not a completed migration. Credentials stay in approved local credential storage. Do not infer ongoing authorization to publish from a prior release. Preserve required third-party notices.
