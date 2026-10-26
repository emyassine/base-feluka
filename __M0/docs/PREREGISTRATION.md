# Feluka M0 measurement preregistration

Locked 2026-10-24 23:05 UTC, before the final remeasurement suite. Earlier exploratory artifacts that remain under `results/2026-10-24-23_11_32/` are not used in the final weighted comparison; only runs started after this file's lock time enter the final score. The final report is `DECISIONS_MO_RESULTS.md`.

## Fixed weights

| Criterion | Weight |
| --- | ---: |
| Target coverage | 20% |
| Port effort and copyability | 20% |
| Null and error safety | 15% |
| HTTP p50/p99 | 15% |
| Clean and edit-build loop | 10% |
| WebAssembly module/runtime | 10% |
| Operational footprint | 10% |

Weights sum to 100%. No weight or scoring rule changes after the final suite starts. The result is a decision aid; hard C1 gates still take precedence over a weighted total.

## Scoring rules, fixed before final measurement

Each category is scored from 0 to 100, then multiplied by its weight.

1. **Target coverage:** five equally weighted classes, one point unit (20/5) each: server Linux x86_64; browser WebAssembly; desktop (Linux, Windows x86_64 and macOS x86_64/AArch64 compile); mobile Android AArch64; and bare-metal `no_std` Rust / TinyGo MCU Go. A class scores only when the shared authorization kernel compiles for every target named in that class. Apple iOS library builds are reported separately and are not required for the mobile class.
2. **Port effort/copyability:** implement the same frozen PocketBase rule subset in clean Rust and Go comparison packages against the same saved black-box cases and SQL rows. The four submeasures are wall time from first testable baseline to first green differential suite, implementation source lines, implementation/edit iterations, and non-intentional failing test runs. Each submeasure scores `100 * min(Rust, Go) / candidate`; the category is their arithmetic mean. If either port does not reach parity, that implementation scores zero. The existing Rust prototype is reference material only and is excluded from this timed task.
3. **Null/error safety:** five binary properties, 20 points each: missing data is represented explicitly; the compiler enforces handling of missing data; errors use explicit return values; the compiler enforces error handling; and malformed/unknown rules fail closed in the shared conformance tests. Source evidence and tests are cited for each property.
4. **HTTP latency:** use the median of three alternating 10k-request series at concurrency 1. Score using the `Server-Timing` application duration: `50 * max(0, 1 - p50_ms / 1.0) + 50 * max(0, 1 - p99_ms / 5.0)`. Client request latency is also retained and checked against the C1 threshold. C1 requires at least one implementation to meet both thresholds.
5. **Build loop:** clean release build and a real source edit followed by release rebuild, each measured three times with dependency package caches available and isolated project build caches. Each submeasure scores `100 * min(Rust, Go) / candidate`; category is their mean. No-op build is reported separately and does not substitute for an edit build.
6. **WASM:** first require correct owner/public/deny behavior and p50 call latency below 100 µs. If correct, score `100 * min(Rust, Go) / candidate_p50_ns`; otherwise zero. Each host calls the same Wasm module with a host callback for every call. Host-runtime/API differences remain an explicit caveat.
7. **Operational footprint:** release binary bytes and median process RSS under the same request profile. Each score is `100 * min(Rust, Go) / candidate`; category is their mean. Smaller scores better reflect the documented server process only, not a complete app.

## Fixed execution protocol

- HTTP suite: same benchmark binaries, source revisions, database, host, CPU pinning, client, request count, warmup, order alternation, and concurrency settings as `benchmarks/tools/run_suite.py`; 3 repetitions per runtime at concurrency 1 and 8. The concurrency-1 median feeds the fixed latency score.
- RSS: `benchmarks/tools/memory_suite.py`, three alternated repetitions per runtime, same 10,000 requests and concurrency 8.
- WASM: same `guest.c`, guest bytes verified equal, eight-instance pool, 100,000 warmup calls and 1,000,000 measured calls; three alternating host runs.
- Builds: isolated target directories for cold/edit builds; preserve full commands, versions and source hashes.
- Port task: frozen cases first; start clock at first implementation edit after test baseline exists. Count a coding iteration as one edit-and-run cycle; count test failures only after implementation begins, not the intentional red baseline.
- Target matrix: record actual compiler/build commands and outcomes; a type-check is not called a linked executable. Host SDK/linker gaps are reported as failures for that target class, not inferred successes.

## Decision rule

Record the weighted results and the hard-gate pass/fail table. Preserve Rust as the decision only if it passes required scope targets and black-box parity; choose Go only if the scope is explicitly narrowed to profiles Go can satisfy and its measured score/port effort makes the choice better. Otherwise D-0004 remains open and the report states the missing evidence.

### Scoring clarifications fixed before calculation

- For a submeasure whose best observed value is zero (failed test runs), the zero-valued candidate scores 100 and any positive value scores 0; this avoids division by zero and preserves the intended penalty.
- The two language ports were authored as one paired task, so a reliable per-language wall-time split was not captured. The paired interval is estimated at 99 seconds from the recorded test-baseline and implementation source timestamps; both languages receive that same elapsed-time subscore. LOC, edit/test iteration count, and unexpected failing runs remain language-specific. This limitation is retained in the score artifact.
- Target coverage applies to the five named profile classes above. Go iOS cross-compilation is recorded but is not part of the preregistered Android mobile class; Apple builds are not claimed as end-to-end application links.

## Recorded outcome (added after the locked run)

The scoring rules and weights above were not changed after the final run began. The resulting scores are **Rust 84.09/100** and **Go 67.21/100**; the calculation inputs and individual category scores are in `results/2026-10-24-23_11_32/m0-score.json`, and the complete measurement report is `DECISIONS_MO_RESULTS.md`.

All C1 exit criteria passed. At concurrency 1 both languages meet the handler and client request p50/p99 thresholds; both WASM hosts return correct owner/public/deny results below 100 µs; both pass all five preregistered target classes; the Rust prototype and the matched Rust/Go ports pass their captured PocketBase v0.40.6 black-box suites; and build plus iteration evidence is recorded. D-0004, D-0019, D-0022, and D-0026 were closed using this result.

This outcome is limited to the measured scenario and frozen record-rule subset. It does not claim complete PocketBase filter grammar, native Apple application linking, game-engine integration, or production performance certification. The paired port-task duration is an approximate 99-second interval from source timestamps and is scored equally for both candidates because no per-language timer was recorded.
