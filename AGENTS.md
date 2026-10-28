# Feluqa — instructions for contributors and coding agents

Scope: this monorepo, excluding preserved historical evidence when a rule would alter recorded results. Read the [documentation index](docs/00.index.en.md) first. This file summarizes the project's contracts; the linked documents contain their details. User instructions take precedence. Record owner decisions in `docs/decisions/03.accepted-decisions.en.md`; keep only unresolved choices in `docs/decisions/01.pending-decisions.en.md`. Update this summary when a contract changes. Follow the [house style](README_Voice_And_Tone.en.md) and [documentation guidelines](docs/DOCS_GUIDELINES.md). The owner-designated [monorepo architecture](docs/02.architecture/01.monorepo-architecture.en.md), [product document](docs/01.introduction/02.intent.en.md), and [compilation requirements](docs/02.architecture/02.compilation-and-targets.en.md) are authoritative over other docs. Their target architecture supersedes conflicting older decisions; actual implementation status is summarized in [the baseline](docs/01.introduction/01.platform-overview.en.md). Current crate migration is planned in [the crate change plan](docs/roadmap/08.crates-change-plan.en.md).

## Goal and honest status

Feluqa is a proprietary platform and unified namespace for web, standalone workstation, mobile, games, APIs and real-time systems. A target product goal is that one business module (for example, a bookstore) can be composed into a hosted web application or a standalone workstation product, with optional authorized access from other devices. The canonical target is one ecosystem, unified namespace and SDK across web, SPA, desktop, mobile, games, APIs and real-time systems, with separate target runtimes. Operators use the built-in System Control Panel and module registry to manage installable Feluqa Modules. The current repository has not yet completed the target workspace, runtime shells or dynamic module lifecycle. Desktop storage, network topology, synchronization and offline conflict behavior remain open in `docs/roadmap/05.web-and-workstation-modules.en.md`. Share tooling, schemas and libraries; retain separate runtime profiles. Web delivery is the first product priority. Enterprise quality requires verified operational and security capabilities, not directory structure or a published crate.

Current implementation: the `feluqa` facade with opt-in target features; `feluqa-definitions` context roots and portable path ownership; Console current_context guards for in_dev, platform and anywhere; no_std authz/UI-schema/panel/resource-registry/module-lifecycle contracts; the generic `feluqa-panel` catalogue; signed typed Live action dispatch; the build-time `.view.rs` compiler/runtime; selected legacy panel implementation-derived browser assets; and `feluqa-imagery` with 7,681 Lucide, Simple Icons and Heroicons SVGs plus notices. `feluqa-definitions` is an initial context/path contract, not dynamic module installation or a globally injected runtime context. **The legacy panel implementation theme system and component catalog are not fully imported.** Selected CSS/JS bundles and adapted components do not provide the complete theme API or Blade component behavior. App composition roots use statically compiled Rust selected in `feluqa.toml`. Cross-struct binary-app tests live under `tests/support/`; direct `tests/*.rs` remain independent Cargo integration crates. `feluqa-database` uses SeaORM 1.1.20, SQLite/PostgreSQL, named pools and embedded dialect SQL migrations/checksums. `feluqa-core` provides identity/session/audit/tenant migrations, Argon2id login, server-side sessions, CSRF, logout, tenant-bound principals and role grants/delegation. Current app-level work includes Core account/role and tenant operations, migration/audit pages and tenant-scoped business CRUD. Missing capabilities include complete target System Panel and Feluqa UI integration, generic CRUD actions, dynamic module installation, browser Live reconciliation/shared replay, full ERP workflows, standalone generated-app build outside the checkout, deployment/restore and enterprise release qualification. Never describe those gaps as implemented.

## Documentation map and precedence

| Read for | Canonical document |
|---|---|
| Immediate work, dependencies, estimates and acceptance | [Enterprise delivery plan](docs/roadmap/02.enterprise-delivery.en.md) |
| `.view.rs`, directives, includes, layouts, escaping and compilation | [View language](docs/05.reference/05.view-language.en.md) |
| Core/system and business panels, components, SDUI, Live, lifecycle | [Panels and components](docs/03.for-developers/03.panels-resources-and-pages.en.md) |
| legacy panel implementation/Webkernel behavior port inventory and parity status | [legacy panel implementation port status](docs/03.for-developers/03.panels-resources-and-pages.en.md) |
| Web MVC, ERP modules, named databases, dialect migrations | [Web profile architecture](docs/02.architecture/07.web-profile.en.md) |
| Product/workspace directory ownership and provider composition | [Project layout](docs/02.architecture/06.platform-module-layout.en.md) |
| Platform/product distinction, context ownership, portable paths and productivity goals | [Platform context and productivity](docs/02.architecture/08.platform-context-and-productivity.en.md) |
| Zed extension, Tree-sitter and language tooling | [Zed product](docs/05.reference/02.zed-editor.en.md) |
| Mandatory Rust rules | [Coding standard](docs/05.reference/03.rust-coding-standard.en.md) |
| Current CLI and planned commands | [CLI](docs/05.reference/01.cli-commands.en.md) |
| Decisions already made | [Accepted decisions](docs/decisions/03.accepted-decisions.en.md) |
| Decisions that remain open | [Open decisions](docs/decisions/01.pending-decisions.en.md) |
| Proprietary distribution and registry | [Licensing](docs/06.governance-and-policy/02.proprietary.en.md) and [LICENSE](LICENSE) |
| Measured language comparison, limits and evidence | [M0 results](docs/07.research-and-notes/05.m0-results.en.md) |

The delivery plan and domain contracts define current sequencing. Basic views/components/SDUI precede the Core panel; historical milestone M4 is not permission to delay these prerequisites. Historical measurements are evidence, not general production guarantees.

## Repository ownership

- Current code: `_crates/` contains the Cargo workspace, lockfile and reusable libraries, including `feluqa-definitions`; facade APIs are under `feluqa::...`. Target: follow the root virtual workspace and domain-grouped `crates/` tree in the canonical Monorepo Architecture; migration steps are in `docs/roadmap/08.crates-change-plan.en.md`.
- `products/`: CLI/editor products and Feluqa module sources, including the current statically composed development consumer.
- Routes are declared by the owning site, panel or module; `src/routes/web.rs` only composes route providers and applies global middleware. Don't add product paths to the composition root.
- `docs/`: canonical numbered documentation, with `roadmap/` for delivery work and `decisions/` for accepted decisions and choices that remain open. Read `README_Voice_And_Tone.en.md` and `docs/DOCS_GUIDELINES.md`; retained source material does not override accepted contracts.
- `target/`: generated build/package output, ignored by Git. `.cargo/config.toml` selects this location.
- Current manifests and product paths still point into `_crates/`; migrate them to the canonical root workspace. The target includes root `Cargo.toml`, `Cargo.lock` and pinned `rust-toolchain.toml`.
- `products/__M0/`: retained benchmark source and evidence. Preserve raw reports, snapshots and hashes; update navigational docs without rewriting measurements.
- Recommended module layouts follow domain ownership; generic `src/app/` and `src/modules/` buckets are allowed when they suit the developer, but are not the default recommendation. See [Project layout](docs/02.architecture/06.platform-module-layout.en.md).
- Do not create empty crates to simulate progress. Add a crate with its first useful contract and integration.

## Rust and dependencies

Every handwritten crate root and generated application entrypoint starts with `#![no_implicit_prelude]`. Import items, macros and traits explicitly. Apply the lint policy in the coding standard; no blanket lint suppression. No `unwrap`/`expect` on production input paths; use typed errors with context. Review unsafe boundaries and keep them small; use `forbid(unsafe_code)` where appropriate.

Use `feluqa::view`, `feluqa::console` and future documented facade modules. `extern crate feluqa::view;` is not valid Rust: import the root crate when required by strict mode, then use `feluqa::view` or `use feluqa::view;`.

Use established libraries for concrete needs: Tokio/Axum/Tower for web runtimes, Serde for typed/versioned schemas/config, existing Rust parsing tools where justified. Keep server dependencies out of kernel/real-time crates. Review dependency license, MSRV, target support and ownership before adoption. The manifest's MSRV is a requirement to verify; successful compilation on a newer compiler does not prove it.

## Views and editor contract

Canonical target suffix: `.view.rs`. These are HTML/Blade-inspired templates containing Rust, not ordinary Rust modules. Generate Rust into `OUT_DIR`. Current `.view` files must migrate together with build discovery, naming and invalidation.

V1 includes escaped `{{ expression }}`, typed raw HTML, `@rs/@endrs`, conditionals, loops, includes, layouts/sections and namespaced components/slots. Follow the language specification rather than inventing syntax per feature. Rust blocks are trusted developer code compiled into the app; never compile template code submitted by panel users.

Production views are compiled. The build-time compiler is exercised by application consumers. `feluqa dev` polls app source/view/config/migration files and local `_crates` workspace source, compiles with the previous process still serving, and replaces it only after a successful build. Rust `@rs` is trusted source compiled into the application, not a sandbox. The scanner handles nested delimiters, strings/raw strings, chars/lifetimes and comments. Resolve declared view roots/namespaces and detect cycles. Props, slots, source locations and errors are explicit. URL attributes require validated `SafeUrl`; JavaScript and CSS interpolation remain prohibited without dedicated encoders.

Compiler and Tree-sitter currently have separate tests; a shared conformance corpus remains to be connected. The grammar/parser and Zed language queries are in `products/tree-sitter-feluqa-view` and `products/feluqa-zed`. Run the dev-extension generator, install it in Zed, and check suffix detection, highlights and Rust injections before claiming editor validation. Highlighting alone does not provide rust-analyzer semantics. Do not commit fabricated grammar repository URLs or revisions; the development script generates a local pinned grammar snapshot.

## Panels, security and operations

Feluqa target architecture includes the generic `feluqa-panel` contracts and a built-in System Control Panel implementation. The current code removed its previous implementation; restore/complete it as a platform consumer of shared contracts. Keep reusable catalogue APIs separate from the System Panel product. Product providers configure panel instances; modules register resources/pages with those instances. CSS/JS live only in `feluqa-panel/assets` and are served by `feluqa::web`; product builds compile crate-owned view roots. Do not copy framework panel views, CSS or JS into a product. Keep the generic catalogue API separate from the built-in System Panel implementation. UI components remain a separate, unfinished integration. Keep the versioned `feluqa::ui` schema `no_std` and web-profile runtime web-only. The `feluqa::panel` catalogue validates panel paths, schemas, system/business permission namespaces and collisions between page/resource routes. Core mutations use audited handlers; tenant creation is transactional; role delegation follows Core policy. HTTP coverage exercises CSRF, Core account/role operations, Live dispatch/replay denial, delegation, session revocation, record ownership, field-level access and cross-user denial. Generic SeaORM CRUD adapters, tenant lifecycle operations, resource-driven actions for remaining Core mutations and a complete accessible component catalogue remain to build. In the current code, `feluqa-core` owns identity, role/grant, session, bootstrap and audit persistence. The target architecture assigns `feluqa-core` shared primitives and scheduling, and a minimal `feluqa-nostd` surface; map and migrate these responsibilities without losing identity persistence. Password-change flows and production multi-instance session management remain unimplemented. `feluqa::live::LiveRuntime` issues permission-scoped snapshots; the in-memory replay guard is not enabled outside development. `feluqa::module` orders and starts statically registered modules with rollback; application lifecycle wiring and installable artifacts remain pending.

Products may build panels using the shared panel catalogue and SDUI schema. UI schemas describe presentation; services own business operations. Enforce authorization on every server action, independently of UI visibility. Separate platform, app-admin and end-user authority; preserve tenant and record isolation.

Live actions require typed input, session/CSRF validation, authorization, bounded work and a concurrency/replay policy. Signed client state must not contain secrets. Modules require deterministic lifecycle, explicit capabilities, compatibility checks, staging and recovery; code rollback is not data rollback.

`public/` is the document root. Mutable state lives in configured user-owned POSIX storage; confine paths and symlinks. Config is Serde-backed and validated. Keep secrets out of source, generated HTML, client snapshots and logs. Document backups/restores, migrations, graceful shutdown, limits and observability before declaring an enterprise release.

Keep handler elapsed time, whole server request duration and client-observed latency separate. Measure claims under a documented scenario; M0 microbenchmarks do not demonstrate production HA or hard real-time guarantees.

## Workflow and acceptance

Compilation scalability, generated-crate orchestration and built-in BI requirements are recorded in
[Compilation](docs/02.architecture/02.compilation-and-targets.en.md). Measure before partitioning generated
code, preserve deterministic cache invalidation, budget workstation resources,
and keep BI data changes outside compilation. Generated-crate orchestration and
the integrated BI catalogue remain planned, not verified capabilities.

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
