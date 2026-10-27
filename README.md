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

The build-time view compiler now handles `.view.rs` templates with typed parameters, escaped and trusted output, `@rs`, conditions/loops, includes, layouts/sections, registered components and slots. Development watch/restart is still pending.

The `feluqa` facade defaults to the `web` feature set, and offers `spa`, `mobile`, `desktop`, `game` and `realtime` profiles. Set `default-features = false` to avoid linking web-profile crates. `auth`, `ui`, `panel`, and `module` are `no_std` + `alloc`; `live` currently requires `std`. Current contracts provide versioned, validated UI JSON and a small safe server renderer; exact permission checks; a system/business panel registry; HMAC-signed typed actions with replay protection; and deterministic static-module startup/shutdown. Sessions, persisted roles/audit, UI rendering/browser transport, a distributed replay store, plugin loading and production panel routes are not implemented yet.

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
