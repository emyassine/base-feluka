# Reproducing the M0 experiments

## Benchmark catalog

The numbered directories in `benchmarks/` are the test catalog. Each has a `benchmark.json` descriptor plus a folder for every implementation language. See [the benchmark authoring guide](../benchmarks/README.md) and the versioned [report format](../benchmarks/report-format.schema.json). Add a new numbered suite and emit `benchmark-report.json` in that format; the shared renderer builds the report without a suite-specific HTML change. Run `make benchmark-check` to validate descriptors and implementation paths.

Run all commands from the checkout root. `make all` installs/checks required native dependencies and runs the portable conformance suites. Each measurement command below creates a separate `results/<timestamp>/` directory and a readable sibling report at `results/<timestamp>.html`. The report has expandable JSON and logs with links to downloadable artifacts. Raw files remain the audit and scoring inputs. Normal commands reuse the compiler cache in `builds/`; `make builds` intentionally uses isolated caches to measure clean builds.

## HTTP and SQLite

`make bench` builds both release servers, seeds the same deterministic SQLite database in `builds/data/orders.sqlite`, and runs twelve alternating series: three runs per runtime at concurrency 1 and three at concurrency 8. Each series warms 1,000 requests and measures 10,000 requests. The harness saves compressed per-request CSVs, summaries, tool versions, source/binary/database hashes, and a readable run log.

The workload performs a benchmark session check, SQL row scope, three SQLite reads, and renders the same 1,459-byte HTML response. Go uses system SQLite via CGO; Rust uses system SQLite via pkg-config. The pinned protocol requires Linux, CPU 2 for the server, and CPUs 0,1,3–7 for the client. Use a host with those available CPUs; review affinity and power settings before interpreting new timings. This protocol is kept consistent with the retained campaign, rather than silently substituting a different scheduling policy.

`make build` only builds. To start a server manually from the checkout root:

```sh
make build seed
M0_DB=builds/data/orders.sqlite ./builds/bin/feluka-m0-go
# In a separate terminal, start Rust instead if desired:
M0_DB=builds/data/orders.sqlite M0_ADDR=127.0.0.1:38101 ./builds/cargo/release/feluka-m0-rust
```

The default addresses are loopback ports 38100 (Go) and 38101 (Rust). The fixed request credential is `X-Feluka-Session: reader:20000`. It is a local benchmark fixture.

## Memory and compilation

`make rss` samples `/proc/PID/status` every 5 ms during the same warmup and 10,000-request concurrency-8 workload, with three alternating runs per runtime. Shorter memory peaks can be missed by sampling.

`make builds` repeats clean, no-change, and source-edit builds three times, alternating runtimes. It uses isolated compiler/project caches while preserving package download caches, restores source bytes after each edit, and records commands, errors, durations, and binary hashes/sizes. It takes several minutes because it deliberately recompiles dependencies. Its output is not part of the normal `make all` loop.

## WASM

`make wasm` builds Go/wazero and Rust/Wasmtime hosts for the same checked-in guest. It measures eight pre-instantiated modules, 100,000 warmup calls, then 1,000,000 calls with a host callback on every call, over three alternating repetitions. The runner pins CPU 2 and requires Linux. Runtime APIs and marshaling are part of the measured difference.

## Shared target matrix

Install TinyGo 0.42.0 separately and set `TINYGO=/path/to/tinygo` if it is not on PATH. Install the Rust target standard libraries:

```sh
rustup target add --toolchain 1.99.0 \
  x86_64-unknown-linux-gnu aarch64-unknown-linux-gnu \
  x86_64-pc-windows-gnu x86_64-apple-darwin aarch64-apple-darwin \
  aarch64-apple-ios aarch64-apple-ios-sim aarch64-linux-android \
  wasm32-unknown-unknown wasm32-wasip1 aarch64-unknown-none thumbv7em-none-eabi
make targets
```

The runner compiles the shared kernel for server, desktop, browser/WASI, Android, and bare-metal/TinyGo classes. Native Apple linking requires Apple SDKs; an unsupported target is recorded as a failure, not reported as a pass. Go test binaries and TinyGo artifacts remain in `builds/targets/`; Cargo target artifacts are in `builds/cargo/<target>/`. Compilation establishes kernel portability, not complete client application or game-engine parity.

## PocketBase oracle

Download the official PocketBase **v0.40.6** executable for your host from its official release, then run:

```sh
make pocketbase POCKETBASE=/absolute/path/to/pocketbase
```

The runner starts an isolated local PocketBase instance with disposable data, captures ten REST cases, and runs the Rust prototype and matched Rust/Go ports against the capture. The supported filter subset is documented in the decision report. The ordinary portable suite uses the retained capture and needs no external PocketBase binary.

## Evidence maintenance

`make score` calculates the fixed preregistered score from the retained reference campaign. `make evidence-check` verifies its sources, binary hashes, all twelve CSV hashes, and the publication index. Source snapshots preserve the measured HTTP harness exactly; recorded path names may differ from the reorganized checkout layout.

To adopt a new campaign, review the new measurements, report its environment and differences, and update the reference input paths and decision report explicitly. Never regenerate hashes merely to make a changed measurement input pass an audit. `make evidence-write` refreshes the publication index after reviewed source/documentation changes; it does not turn a new result into the reference campaign.
