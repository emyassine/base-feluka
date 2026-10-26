# Feluka M0 — Rust / Go comparison

| Field | Value |
| --- | --- |
| Status | M0 complete against the C1 criteria; Rust selected as the host language |
| Measurement date | 24 October 2026 (UTC) |
| Scenario | Session + SQL ACL + three SQLite reads + HTML rendering of a 20-line order |
| Protocol | [`BENCHMARKS.md`](BENCHMARKS.md) |
| 12-run log | [`results/2026-10-24-23_11_32/run-log.txt`](../results/2026-10-24-23_11_32/run-log.txt) |
| Machine-readable benchmark manifest | [`results/2026-10-24-23_11_32/suite.json`](../results/2026-10-24-23_11_32/suite.json) |
| 120,000 compressed individual measurements | [`results/2026-10-24-23_11_32/samples/`](../results/2026-10-24-23_11_32/samples/) |

## Executive result — final preregistered measurements

The weights were locked in [`PREREGISTRATION.md`](PREREGISTRATION.md) at 23:05 UTC, before the final measurement runs. Only runs after that time are used below. The calculated results and scoring inputs are in [`m0-score.json`](../results/2026-10-24-23_11_32/m0-score.json); [`benchmarks/tools/score_m0.py`](../benchmarks/tools/score_m0.py) recalculates them from the retained evidence without changing the weights.

| Criterion | Weight | Rust | Go |
| --- | ---: | ---: | ---: |
| Coverage of the five target classes | 20% | 100 | 100 |
| Port effort and iterations | 20% | 100 | 58.15 |
| Missing-value and error safety | 15% | 60 | 60 |
| HTTP p50/p99 latency | 15% | 80.91 | 85.01 |
| Clean/edit build loop | 10% | 29.54 | 100 |
| WASM call | 10% | 100 | 1.77 |
| Binary/RSS footprint | 10% | 100 | 36.55 |
| **Weighted score** | **100%** | **84.09** | **67.21** |

**M0 decision: Rust.** Both candidates passed the five required target classes and the port tests; both also passed the serial HTTP and WASM thresholds. Under the decision rule fixed in advance, Rust meets the conditions for retaining the recommendation. Its weighted score is 16.88 points higher. Go retains the measured advantage on this HTTP path and on build time. This decides the host language for the Feluka scope described in `DECISIONS.md`; it does not certify the performance of a complete application.

### Final HTTP latency

Median of three alternating runs, each with 10,000 measured requests after 1,000 warmup requests. These values are measured inside the handler, not at the client socket.

| Concurrency | Measurement | Go | Rust |
| --- | --- | ---: | ---: |
| 1 | p50 | **0.211 ms** | 0.278 ms |
|  | p95 | 0.354 ms | 0.408 ms |
|  | p99 | **0.444 ms** | 0.519 ms |
|  | p99.9 | 0.932 ms | 2.299 ms |
|  | Client throughput | **1,552.7 req/s** | 1,377.5 req/s |
| 8 | p50 | **0.205 ms** | 1.708 ms |
|  | p95 | **0.354 ms** | 2.466 ms |
|  | p99 | **0.598 ms** | 3.169 ms |
|  | p99.9 | **1.539 ms** | 3.606 ms |
|  | Client throughput | **3,109 req/s** | 2,833 req/s |

Both languages meet the C1 threshold in at least one configuration (concurrency 1). At concurrency 8, Rust p50 exceeds 1 ms, while its p99 remains below 5 ms. Every run returned status 200 and exactly 1,459 response bytes.

Client-request p50/p99, calculated from the same keep-alive samples, also meet the C1 threshold at concurrency 1: Go **0.568 / 1.270 ms** and Rust **0.633 / 1.590 ms**. The latency score uses `Server-Timing`, as specified by the benchmark README (application processing duration); the C1 check also passes on client measurements. Median client p99.9 is 7.412 ms for Go and 7.651 ms for Rust, with network/client-side spikes visible in these distributions.

### Operational results and build loop

Build values are medians of three post-registration measurements. Clean builds used empty project build caches; the edit rebuild inserted and then removed a real source-file comment.

| Measurement | Go | Rust |
| --- | ---: | ---: |
| Clean release build | **25.904 s** | 59.565 s |
| No-change build (informational) | **307 ms** | **181 ms** |
| Release rebuild after source edit | **1.273 s** | 8.164 s |
| Release binary | 6,307,360 bytes | **2,161,944 bytes** |
| Median process RSS, c=8 workload | 15,560 KiB | **6,040 KiB** |
| Median sampled maximum RSS | 15,624 KiB | **6,048 KiB** |

RSS was sampled in `/proc/PID/status` every 5 ms during warmup and 10,000 requests, over three alternating runs. The interval can miss shorter peaks. Rust used about 61.2% less median RSS in this experiment. These final values replace exploratory figures previously shown in this report.

### WASM, port, and safety

The same C guest module and eight pre-instantiated modules per runtime were used. Each repetition warmed up with 100,000 calls, measured 1,000,000 calls, and invoked a host callback for every call:

| Runtime | p50 | p95 | p99 | M0 threshold |
| --- | ---: | ---: | ---: | --- |
| Go / wazero | 3.9024 µs | 4.8543 µs | 5.7635 µs | pass |
| Rust / Wasmtime | 69 ns | 115.8 ns | 120.3 ns | pass |

This remains a microbenchmark of two different engines' APIs and callbacks. Detailed results are in `results/2026-10-24-23_11_32/wasm-host-final-suite.json`.

The port task used ten shared vectors tied to the PocketBase v0.40.6 REST oracle, plus tests for operator precedence, parentheses, and fail-closed handling of unknown or malformed syntax. Rust: 223 implementation lines, one edit/test iteration to green, and zero unexpected failing test runs after implementation began. Go: 270 lines, two iterations, and one failing test run with two assertions corrected. Both suites finish green. The languages were implemented as one paired task: source timestamps indicate about 99 seconds from the testable baseline to both implementations first passing, but do not support an honest per-language time split. The score therefore gives both the same elapsed-time subscore; all other submeasures are language-specific. The measured inputs and timing caveat are recorded in [`port-effort.json`](../results/2026-10-24-23_11_32/port-effort.json).

For safety, both Rust and Go explicitly represent missing values and parser errors, and both fail closed on invalid rules. In this task the compiler does not force callers to consume these results: each language scores 3 of 5 properties, or 60/100. This experiment shows no comparative advantage on that criterion.

## M0 criteria summary

| C1 criterion | Result |
| --- | --- |
| p50 < 1 ms and p99 < 5 ms for at least one candidate | Pass: Go and Rust, concurrency 1 |
| Correct WASM call under 100 µs | Pass: both |
| Shared kernel builds for all required profiles in at least one language | Pass: Rust, 5/5 classes; Go/TinyGo, 5/5 classes |
| Black-box tests pass for the ported component | Pass: Rust prototype and matched Rust/Go ports |
| Build and agent iteration metrics recorded | Pass, with the paired-time estimate caveat stated above |
| D-0004, D-0019, D-0022, and D-0026 | Closed based on this M0 result |

This closure follows the C1 wording: one record-rules component must pass black-box tests. It does not claim that the full PocketBase filter language is implemented. The smoke suite compiles a shared kernel; it does not execute it on every system or link complete applications with native SDKs. No game engine was integrated or tested; that was not an M0 exit criterion.

## Measurement protocol

### Workload and equal work

The two programs are [`benchmarks/01-http-performance/go/main.go`](../benchmarks/01-http-performance/go/main.go) and [`benchmarks/01-http-performance/rust/src/main.rs`](../benchmarks/01-http-performance/rust/src/main.rs). They use the same read-only SQLite file, the same three prepared/cached queries, at most one SQLite connection, and build the same **1,459-byte** complete HTML response for `/orders/42`.

1. Read and verify the demo session header `X-Feluka-Session: reader:20000`.
2. Read the order ID.
3. Load the order with its SQL scope restriction: `customer_id <= ?`.
4. Read its 20 order lines, sorted by position.
5. Read the customer.
6. Render the complete HTML document.

The deterministic database contains 10,000 customers, 40,000 orders, and 800,000 order lines: **850,000 rows** total. It is **38,465,536 bytes**. SHA-256: `3e6ba442a84324ad3ec18656c0d0eaffbc62c880a954682fa5de4328994d5b7d`.

The token is a fixed benchmark value with no production security. The test measures no TLS, reverse proxy, compression, or real authentication. Both authorized responses are 1,459 bytes; the HTTP responses were verified byte-for-byte identical before the run. Both servers return `401` without the session header.

### Timing and statistics

`Server-Timing: app;dur=...` starts in the handler, before session validation and ID parsing. It includes ACL evaluation, SQLite connection wait, queries, rendering, and ordinary header preparation. It stops before network writes and before adding the `Server-Timing` header. Client time is measured separately by the keep-alive HTTP benchmark.

Each run includes 1,000 warmup requests and 10,000 measured requests. The benchmark maintains one HTTP/1.1 connection per worker and uses the same client code. Percentiles use nearest rank: rank `ceil(p × N)` after ascending sort. `Server-Timing` values are rounded to the nearest microsecond (`0.001 ms`).

Servers run sequentially and are pinned to logical CPU 2. The load generator is pinned to logical CPUs 0, 1, and 3–7. The suite alternates runtimes to limit order bias:

- Concurrency 1: Go, Rust, Rust, Go, Go, Rust.
- Concurrency 8: Rust, Go, Go, Rust, Rust, Go.

The complete order, executed commands, and raw output are in `results/2026-10-24-23_11_32/suite.json` and `results/2026-10-24-23_11_32/run-log.txt`.

### Results by repetition

All times are milliseconds measured in the handler; throughput is completed requests per second as observed by the keep-alive client. All twelve runs returned only status 200 and exactly 1,459 response bytes. The following values come from the final `suite.json`, grouped by runtime while preserving the recorded alternating order.

#### Concurrency 1

| Runtime | Run | p50 | p95 | p99 | p99.9 | Mean | Client throughput |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Go | 1 | 0.224 | 0.354 | 0.444 | 0.932 | 0.243 | 1,532.0 |
| Rust | 1 | 0.273 | 0.401 | 0.504 | 1.422 | 0.296 | 1,403.3 |
| Rust | 2 | 0.279 | 0.431 | 0.545 | 2.299 | 0.309 | 1,323.3 |
| Go | 2 | 0.211 | 0.356 | 0.470 | 1.477 | 0.236 | 1,552.7 |
| Go | 3 | 0.210 | 0.321 | 0.442 | 0.839 | 0.228 | 1,607.2 |
| Rust | 3 | 0.278 | 0.408 | 0.519 | 3.044 | 0.299 | 1,377.5 |
| **Go median** |  | **0.211** | **0.354** | **0.444** | **0.932** | **0.236** | **1,552.7** |
| **Rust median** |  | **0.278** | **0.408** | **0.519** | **2.299** | **0.299** | **1,377.5** |

#### Concurrency 8

| Runtime | Run | p50 | p95 | p99 | p99.9 | Mean | Client throughput |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Rust | 1 | 1.708 | 2.471 | 3.169 | 3.451 | 1.652 | 2,833.0 |
| Go | 1 | 0.205 | 0.352 | 0.538 | 1.539 | 0.234 | 3,109.0 |
| Go | 2 | 0.212 | 0.366 | 0.723 | 2.364 | 0.249 | 2,969.6 |
| Rust | 2 | 1.642 | 2.466 | 3.169 | 8.408 | 1.637 | 2,805.0 |
| Rust | 3 | 1.743 | 2.387 | 2.895 | 3.606 | 1.684 | 2,888.5 |
| Go | 3 | 0.204 | 0.354 | 0.598 | 1.424 | 0.235 | 3,141.2 |
| **Go median** |  | **0.205** | **0.354** | **0.598** | **1.539** | **0.235** | **3,109.0** |
| **Rust median** |  | **1.708** | **2.466** | **3.169** | **3.606** | **1.652** | **2,833.0** |

## Environment and artifacts

| Item | Value |
| --- | --- |
| CPU | Intel Core i5-1145G7, 4 cores / 8 threads, 2.60 GHz |
| CPU 2 governor | `powersave`; frequency not locked |
| OS / kernel | Debian 13, Linux 6.12.111-amd64, glibc 2.41, x86_64 |
| Go | go1.27.1 linux/amd64 |
| Rust | rustc 1.99.0 (b940084d7 2026-09-28) |
| Python | 3.13.5 |
| Shared SQLite | 3.46.1, dynamically linked system `libsqlite3.so.0` |
| Go server | `net/http`, `database/sql`, `go-sqlite3` 1.14.33; one-connection pool, prepared queries |
| Rust server | Axum 0.8.9, Tokio 1.54.1, SQLx 0.8.6; one-connection pool, SQLx query cache |
| Database size | 38,465,536 bytes |
| Go binary | 6,307,360 bytes |
| Rust binary | 2,161,944 bytes |

Versions are locked by `go.sum` and `Cargo.lock`. Both executables link the same system SQLite 3.46.1 library; they do not each compile a different SQLite version.

SHA-256 hashes of the measured executables:

| Artifact | SHA-256 |
| --- | --- |
| Go `feluka-m0-go` | `77b16cc5122dd295d02d079840d1f51b23a19de705e86d643516f510d9675877` |
| Rust `feluka-m0-rust` | `d89afcfb0282a741c38c35fb8a2f771e5917f3a8751b79a3357535f4e2ff9df4` |
| SQLite database | `3e6ba442a84324ad3ec18656c0d0eaffbc62c880a954682fa5de4328994d5b7d` |

The JSON manifest also records hashes for the source, manifests, lockfiles, and measurement scripts used in this run. The repository was at commit `c20678d62364a0ddb78af81c27a4a6e6b3742a7a`; these M0 files were uncommitted working files, so their hashes identify the exact measured sources.

### Verifying the results

The evidence manifest hashes the published source, lockfiles, runners, and retained reference results and samples. New test runs record their own log hashes in `run.json`. Generated databases and executables are excluded from Git; their measured SHA-256 hashes and sizes are retained in the HTTP and build result records. The twelve compressed CSVs retain all **120,000 measured rows** (client duration, server duration, response bytes, status); their percentiles were recalculated from the CSVs and match the recorded summaries. The run log preserves readable commands and summaries.

| Measurement artifact | SHA-256 |
| --- | --- |
| `results/2026-10-24-23_11_32/suite.json` | `086ef7bf798e1ee2c127391c8f75f33ab5f1c590e61fd7102c4bd204a2da31f1` |
| `results/2026-10-24-23_11_32/run-log.txt` | `7962eab79006286bad3b2990180f671de3bb1a302b1f349881db27f2a701c097` |

These hashes detect changes and support recalculation. The exact HTTP harness and seed sources are retained as snapshots under `results/2026-10-24-23_11_32/source-snapshots/`; their hashes match the recorded suite. `make evidence-check` checks those snapshots against the run, verifies measured server and binary hashes, recalculates the twelve sample hashes, checks the published-file manifest, and rejects workstation-specific paths. This is a traceable local record, not a signed artifact or an independent laboratory audit. Generated binaries and the SQLite database are intentionally excluded from the publishable tree; the measurements retain their hashes and sizes.

## Reproduction

From the repository root, after `./benchmarks/bootstrap.sh install` has installed the pinned toolchains and host dependencies:

```sh
./benchmarks/bootstrap.sh all
./benchmarks/bootstrap.sh bench
```

`benchmarks/tools/run_suite.py` runs the same twelve series and writes a new machine manifest and log. To compare a new run with this report, check the source, binary, and database hashes in the manifest. A change to any of these hashes defines a different experiment.

## Scope of conclusions and remaining work

The handler timing excludes HTTP parsing, routing before the handler, response serialization and writing, TLS, proxy, and compression. This is not an FPM or production benchmark. The single SQLite connection is fixed to keep both configurations equal; a realistic read pool remains to be measured. The `powersave` governor and unlocked frequency make results dependent on this machine and its thermal state.

### Build loop

Final values are medians of three repetitions from 24 October 2026. Clean builds used isolated, empty project caches while package caches were already available. The edit build inserted and removed a comment in the actual source file, then verified that the original bytes were restored. The measured binaries were the stripped release binaries used by the HTTP benchmark.

| Measurement | Go | Rust |
| --- | ---: | ---: |
| Clean build | 25.904 s | 59.565 s |
| No-change build | 307 ms | 181 ms |
| Rebuild after source edit | 1.273 s | 8.164 s |
| Binary size | 6,307,360 bytes | 2,161,944 bytes |

Complete output, commands, versions, and hashes are in [`final-build-metrics.json`](../results/2026-10-24-23_11_32/final-build-metrics.json). Earlier exploratory measurements remain in `results/2026-10-24-23_11_32/exploratory/build-metrics.json`; they are not used in the M0 score.

### Sampled RSS

`VmRSS` was read from `/proc/PID/status` every 5 ms during warmup and 10,000 requests at concurrency 8, with the same CPU pinning. Three alternating runs per runtime:

| Runtime | Median of per-run median RSS | Median of sampled maxima | Per-run median RSS |
| --- | ---: | ---: | --- |
| Go | 15,560 KiB | 15,624 KiB | 16,996 / 15,560 / 15,224 KiB |
| Rust | 6,040 KiB | 6,048 KiB | 6,032 / 6,092 / 6,040 KiB |

Rust used 61.2% less median RSS in this test. Sampling can miss shorter peaks. Final artifact: [`memory-repeat-suite.json`](../results/2026-10-24-23_11_32/memory-repeat-suite.json).

### Shared targets

The post-preregistration runner result is [`target-build-suite.json`](../results/2026-10-24-23_11_32/target-build-suite.json). Each class compiled the same authorization kernel without runtime-specific dependencies:

| M0 class | Rust | Go / TinyGo |
| --- | --- | --- |
| Linux x86_64 server | pass | pass |
| Browser WebAssembly | pass | pass |
| Desktop: Linux, Windows x86_64, macOS x86_64/AArch64 | pass | pass |
| Android AArch64 mobile | pass | pass |
| Rust `no_std` bare metal / TinyGo Feather M4 MCU | pass | pass |

Rust builds cover 12 target triples; the kernel uses `cargo build` for each target. Go compiles 8/9 test binaries; `ios/arm64` fails on this Linux host because cgo requires an Apple toolchain. That result is recorded and is outside the Android mobile class fixed in advance. TinyGo 0.42.0 builds WASI, wasm, and Feather M4. These compile the kernel/package; they are not full applications linked and run with native SDKs. No game engine was integrated or tested; it is not a C1 exit criterion.

### WebAssembly module

The same C guest, eight pre-instantiated modules, 100,000 warmup calls, then 1,000,000 measured calls, with a host callback on every call, over three alternating repetitions:

| Host | Median p50 | Median p95 | Median p99 |
| --- | ---: | ---: | ---: |
| Go / wazero | 3,902.4 ns | 4,854.3 ns | 5,763.5 ns |
| Rust / Wasmtime | 69 ns | 115.8 ns | 120.3 ns |

Both hosts return the correct owner/public/deny results and meet the 100 µs threshold. Rust/Wasmtime has a much lower p50 in this microbenchmark; this also measures the different runtimes' call APIs, marshaling, and callbacks. Full data is in [`wasm-host-final-suite.json`](../results/2026-10-24-23_11_32/wasm-host-final-suite.json).

### PocketBase port and limits of the conclusion

The [`benchmarks/07-pocketbase-compatibility/run_suite.py`](../benchmarks/07-pocketbase-compatibility/run_suite.py) runner recaptures behavior from the official PocketBase v0.40.6 binary, then runs the seven Rust prototype tests and both matched ports in one command. Ten REST cases cover locked/public/filter rules, read/list/create/delete, denials, superuser behavior, comparisons, `&&`, `||`, and parentheses. Both Rust and Go ports read the same JSON vectors and captured responses; all tests pass.

The port implements a bounded subset: `owner_id` and `status` fields, request auth/body references, equality/inequality, `&&`, `||`, parentheses, superuser bypass, list filtering, and REST status codes. The Rust prototype also lowers this subset to parameterized SQL, and a SQLite test verifies that its results match the in-memory evaluator. This lowerer is not connected to the M0 HTTP server.

The full PocketBase filter language (relations, numeric operators, modifiers, and date macros) is not implemented. This does not block C1, which requires a record-rules component validated against black-box tests, but it means this prototype must not be presented as a general PocketBase replacement. The reference is the [PocketBase documentation](https://pocketbase.io/docs/api-rules-and-filters/) and the binary is the [official v0.40.6 release](https://github.com/benchmarks/pocketbase/benchmarks/pocketbase/releases/tag/v0.40.6).

The preregistered score closes M0 and selects the host language: Rust, 84.09 to Go's 67.21. Go remains faster on the measured handler and build loop. Rust's advantages here come from the matched port, compilation of the kernel for the required targets, this runtime's WASM call, binary size, and RSS. This ranking is bounded to this workload, rule subset, and small compiled kernels.

A SHA-256 manifest of the reports, source, and measured outputs is in [`evidence-manifest.json`](../results/evidence-manifest.json). The complete reusable command surface and audit procedure are documented in [`README.md`](../README.md) and its `Makefile`.
