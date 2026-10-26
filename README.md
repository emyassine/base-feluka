# Feluqa

Feluqa is a Rust workspace for a multi-platform application framework. The server profile and reusable website delivery are the current focus; other profiles will share schemas and tools while keeping their own runtimes.

## Run the Numerimondes site

From the workspace root:

```sh
cargo run -p numerimondes -- dev
```

Open [http://127.0.0.1:38127/](http://127.0.0.1:38127/). The Numerimondes app resolves its config from `apps/numerimondes/feluqa.toml`; its profile is `web`. It currently serves `/` and `/about`.

The page navigation shows handler elapsed time as **Request … ms**. The full server middleware duration is separate: inspect `Server-Timing: feluqa_binary;dur=…` in browser DevTools → Network → Response Headers, or watch the `cargo run` terminal.

Build the standalone application binary with:

```sh
cargo build -p numerimondes --release --locked
```

The current view compiler supports text and escaped `{{ name }}` substitutions. Layouts, view control directives, hot reload, storage management, auth, and deployment adapters remain roadmap work.

## Workspace layout

The root `Cargo.toml` is the **workspace manifest**. It lists packages and shared dependency versions; it is intentionally not an application package. Each crate and runnable app has its own `Cargo.toml` in its directory.

```text
Cargo.toml                 workspace and shared dependency versions
crates/feluqa/             public framework facade
crates/feluqa-console/     public console command contract
crates/feluqa-view/        compiled view engine
apps/numerimondes/         Numerimondes web application
tools/feluqa-cli/          planned installable CLI (not implemented yet)
docs/                      product decisions, roadmap, standards, research
archive/prototypes/        earlier standalone prototypes (not workspace members)
__M0/                      retained language benchmark evidence and tools
```

See [the documentation index](docs/README.md) for the roadmap, architecture decisions, and coding standard.
# base-feluka
