# Feluqa

Feluqa is a Rust workspace for a multi-platform application framework. The server profile and reusable website delivery are the current focus; other profiles will share schemas and tools while keeping their own runtimes.

## Run the Numerimondes site

From the repository root, run the Feluqa CLI product:

```sh
cargo run --manifest-path _crates/Cargo.toml -p feluqa-cli -- dev
```

Open [http://127.0.0.1:38127/](http://127.0.0.1:38127/). The Numerimondes product resolves its config from `products/numerimondes/feluqa.toml`; its profile is `web`. It currently serves `/` and `/about`.

The page navigation shows handler elapsed time as **Request … ms**. The full server middleware duration is separate: inspect `Server-Timing: feluqa_binary;dur=…` in browser DevTools → Network → Response Headers, or watch the CLI terminal.

Check the no-default-dependency realtime facade profile with `cargo check --manifest-path _crates/Cargo.toml -p feluqa --no-default-features --features realtime`. This proves host compilation only, not a specific embedded target or hard-deadline behavior.

Build the standalone application binary with:

```sh
cargo build --manifest-path _crates/Cargo.toml -p numerimondes --release --locked
```

The CLI is a first-class product at `products/feluqa-cli/`, with the executable name `feluqa`. From source, run it with `cargo run --manifest-path _crates/Cargo.toml -p feluqa-cli -- help`.

The build-time view compiler now handles `.view.rs` templates with typed parameters, escaped and trusted output, `SafeUrl`-checked links, `@rs`, conditions/loops, includes, layouts/sections, registered components and slots. `feluqa dev` watches application and local framework sources, keeps the last working server alive after a failed build, and restarts after a successful build.

The `feluqa` facade defaults to the `web` feature set, and offers `spa`, `mobile`, `desktop`, `game` and `realtime` profiles. Set `default-features = false` to avoid linking web-profile crates. `auth`, `ui`, `panel`, and `module` are `no_std` + `alloc`; `live` currently requires `std`. The contracts provide versioned UI JSON and a safe initial renderer, exact permissions, panel registration, signed typed actions, and deterministic static-module lifecycle. Feluqa Core also has persistent users, roles, sessions and audit. Browser Live transport, distributed replay, dynamic module installation and a reusable generic administration panel remain unfinished.

Numerimondes now exercises a first product-specific MVC path: Core setup/login/logout and user/role administration under `/system`, plus an audited CRM customer CRUD under `/admin`. This is an initial vertical slice, not yet a reusable enterprise ERP panel. The CLI generates a web MVC starter with routes, controllers, compiled views and dialect migration folders. Inside this monorepo, generated apps use local Feluqa crates; outside it, the private registry must first receive the current `0.2.0` crate set (it currently exposes `feluqa` through `0.1.1`). See [the Web profile architecture and current delivery gap](docs/architecture/WEB_PROFILE.md).

The Web data foundation uses SeaORM 1.1.20 with named SQLite/PostgreSQL pools, typed TOML configuration, and checksummed SQL migrations compiled by module and dialect. Numerimondes supplies both CRM migration variants; the initial `/system` and `/admin` routes enforce sessions, CSRF, grants and CRM record scope. PostgreSQL migration application is verified, while the full panel HTTP suite still needs PostgreSQL coverage.

## Repository layout

The repository root is reserved for products, documentation, and generated build output. The Cargo workspace and lockfile live under `_crates/`. The compiler version is managed by developer and CI environments; packages declare the minimum Rust version they support.

```text
_crates/Cargo.toml         workspace and shared dependency versions
_crates/Cargo.lock         workspace dependency lockfile
_crates/feluqa/            public framework facade
_crates/feluqa-console/    public console command contract
_crates/feluqa-auth/       no_std identity and permission contracts
_crates/feluqa-ui/         no_std versioned SDUI schema
_crates/feluqa-panel/      system/business panel registry
_crates/feluqa-live/       signed typed action dispatch
_crates/feluqa-module/     deterministic static module lifecycle
_crates/feluqa-view/       compiled view engine
products/feluqa-cli/       Feluqa CLI product (binary: feluqa)
products/numerimondes/     Numerimondes web application product
docs/                      product decisions, roadmap, standards, research
target/                    generated Rust build output
products/__M0/             retained language benchmark evidence and tools
```

See [the documentation index](docs/README.md) for the roadmap, architecture decisions, and coding standard.

Implementation contractsè: [delivery plan](docs/planning/ENTERPRISE_DELIVERY.md), [`.view.rs` language](docs/views/LANGUAGE.md), [panels and components](docs/architecture/PANELS_COMPONENTS.md), [Zed tooling](docs/editor/ZED.md). Contributors start with [AGENTS.md](AGENTS.md).
