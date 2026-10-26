# Feluqa

Feluqa is a Rust workspace for a multi-platform application framework. The server profile and reusable website delivery are the current focus; other profiles will share schemas and tools while keeping their own runtimes.

## Run the Numerimondes site

From the repository root, run the Feluqa CLI product:

```sh
cargo run --manifest-path _crates/Cargo.toml -p feluqa-cli -- dev
```

Open [http://127.0.0.1:38127/](http://127.0.0.1:38127/). The Numerimondes product resolves its config from `products/numerimondes/feluqa.toml`; its profile is `web`. It currently serves `/` and `/about`.

The page navigation shows handler elapsed time as **Request … ms**. The full server middleware duration is separate: inspect `Server-Timing: feluqa_binary;dur=…` in browser DevTools → Network → Response Headers, or watch the CLI terminal.

Build the standalone application binary with:

```sh
cargo build --manifest-path _crates/Cargo.toml -p numerimondes --release --locked
```

The CLI is a first-class product at `products/feluqa-cli/`, with the executable name `feluqa`. From source, run it with `cargo run --manifest-path _crates/Cargo.toml -p feluqa-cli -- help`.

The current view compiler supports text and escaped `{{ name }}` substitutions. Layouts, view control directives, hot reload, storage management, auth, and deployment adapters remain roadmap work.

## Repository layout

The repository root is reserved for products, documentation, and generated build output. The Cargo workspace and lockfile live under `_crates/`. The compiler version is managed by developer and CI environments; packages declare the minimum Rust version they support.

```text
_crates/Cargo.toml         workspace and shared dependency versions
_crates/Cargo.lock         workspace dependency lockfile
_crates/feluqa/            public framework facade
_crates/feluqa-console/    public console command contract
_crates/feluqa-view/       compiled view engine
products/feluqa-cli/       Feluqa CLI product (binary: feluqa)
products/numerimondes/     Numerimondes web application product
docs/                      product decisions, roadmap, standards, research
target/                    generated Rust build output
products/__M0/             retained language benchmark evidence and tools
```

See [the documentation index](docs/README.md) for the roadmap, architecture decisions, and coding standard.
