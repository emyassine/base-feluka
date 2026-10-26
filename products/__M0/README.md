# Feluka M0 — Rust and Go comparison

A reproducible comparison of the Rust and Go implementations proposed for Feluka. The retained M0 result selects **Rust: 84.09/100**, compared with **Go: 67.21/100**. The measurements and their limits are in [the decision report](docs/DECISIONS_MO_RESULTS.md).

## Clone and run

```sh
git clone <repository-url> feluka-m0
cd feluka-m0
make all
```

`make all` checks dependencies, installs missing prerequisites on supported systems, and runs the portable unit/conformance suites and the retained-evidence audits. Each execution saves its commands, tool versions, exit codes, complete logs, and recalculated score in `results/YYYY-MM-DD-HH_MM_SS/`, with a readable HTML report at `results/YYYY-MM-DD-HH_MM_SS.html`. Benchmark commands use the same timestamp format. A failing check makes the command fail.

Supported development systems are **Linux, macOS, and WSL2**. Linux setup supports apt, dnf, and pacman. macOS setup uses Homebrew and Apple's command line tools. Package installation may request the normal system administrator password. The first run downloads dependencies; subsequent runs reuse `builds/`.

If Make itself is missing, start with:

```sh
./benchmarks/bootstrap.sh all
```

The compiler versions match the retained run: **Go 1.27.1** and **Rust 1.99.0**. Rust libraries use committed `Cargo.lock` files; Go libraries use `go.mod` and `go.sum`. Python 3.10+, a C compiler, pkg-config, and SQLite development headers are also required. The setup script checks and installs these where supported. SQLite and system compiler versions can differ by operating system and are recorded by the measurement tools.

## Where things live

```text
.
├── benchmarks/          Comparison implementations, test suites, and runners
├── builds/              Generated executables, database, targets, and compiler cache
├── docs/                Protocol, preregistration, and decision report
├── results/             Timestamped runs and the evidence index
├── Makefile             Public commands; make all is the entry point
├── README.md
└── rust-toolchain.toml   Pinned Rust compiler
```

`benchmarks/` is a numbered test catalog. Each suite has a `benchmark.json` descriptor and language subfolders with implementation manifests. HTTP and WASM code, matched ports, and PocketBase compatibility code live with their suites; memory/build/target suites explicitly reuse the HTTP implementation. See [the catalog and authoring guide](benchmarks/README.md).

`builds/` is ignored by Git except for its directory guide. Rust crates share `builds/cargo/` and reuse compatible dependency artifacts. Normal runs preserve that cache. Run `make clean` only when you want to remove generated builds; it preserves all results.

## Commands

| Command | Purpose |
| --- | --- |
| `make all` | Set up missing dependencies, then run portable tests and evidence audits |
| `make check` | Check dependency availability |
| `make install` | Install prerequisites and the pinned Rust toolchain |
| `make test` | Run the portable suite with dependencies already available |
| `make benchmark-list` | List the numbered benchmark suites and their implementations |
| `make benchmark-check` | Validate suite descriptors, language manifests, and runner paths |
| `make build` | Compile the HTTP servers into `builds/` |
| `make bench` | Build, seed the database, and repeat the pinned HTTP benchmark on Linux |
| `make rss` | Repeat Linux RSS measurements |
| `make builds` | Repeat isolated clean/no-op/source-edit build measurements |
| `make wasm` | Repeat the Linux WASM host-call benchmark |
| `make targets` | Compile the shared-kernel cross-target matrix; requires TinyGo/target support |
| `make pocketbase POCKETBASE=/path/to/pocketbase` | Capture PocketBase v0.40.6 behavior and check the ports |
| `make score` | Recalculate the score from the retained reference measurements |
| `make evidence-check` | Verify reference sources, binary hashes, samples, and publication index |
| `make clean` | Remove generated builds and caches |

The bootstrap script selects GNU Make (`gmake`) on macOS. For manual Make commands there, use `gmake` if your default Make is incompatible.

The portable suite does not repeat timed performance experiments. Those need controlled CPU conditions, and the pinned HTTP/RSS/WASM runners require Linux (`taskset` and `/proc`). [The reproduction guide](docs/BENCHMARKS.md) explains the individual experiments and optional tools.

## Results and audit

The original measurement campaign is retained in [`results/2026-10-24-23_11_32/`](results/2026-10-24-23_11_32/), including all 120,000 compressed HTTP samples, source snapshots, raw summaries, and scoring inputs. Its JSON keeps the original recorded path identifiers; the audit runner resolves these to the current layout and verifies the original bytes. Moving the repository does not change the measured evidence.

New tests and measurements create their own timestamped directories and never replace this reference campaign. `results/evidence-manifest.json` indexes the published source and retained reference evidence. Each new portable test run has its own `run.json` with log hashes. Refreshing the publication index is an explicit maintainer action: `make evidence-write` after reviewing changes.

The fixed workload uses a local benchmark credential and one SQLite connection. It is a bounded experiment, and its scores are not a production performance guarantee. The rule ports implement the documented subset of PocketBase filters. Read [the locked scoring rules](docs/PREREGISTRATION.md) and [the full results](docs/DECISIONS_MO_RESULTS.md) before interpreting the ranking.
