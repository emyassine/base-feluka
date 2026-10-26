# Benchmark suite

Feluka M0 is a small, reusable benchmark harness. Numbered folders are its benchmark catalog; each folder has a `benchmark.json` descriptor and language-specific folders (`go/`, `rust/`, and optional additional implementations) with `implementation.json` manifests. Use `make benchmark-list` to browse the catalog and `make benchmark-check` to validate it.

## Add a benchmark without changing the HTML renderer

1. Create `benchmarks/NN-short-name/benchmark.json` using an existing descriptor as a starting point. It follows `benchmark-descriptor.schema.json`; declare its stable ID, purpose, languages, metrics, and runner.
2. Add one folder per implementation, such as `go/` and `rust/`. Put implementation metadata in `implementation.json` following `implementation.schema.json`; source paths are relative to that manifest. New implementation code can live directly in those folders.
3. Write raw results under `results/<timestamp>/`. Keep the original JSON/log evidence there.
4. Write `benchmark-report.json` in the run directory using the version 1 report format in `report-format.schema.json`, then call `write_benchmark_report()` from `benchmarks/tools/results_dir.py`.
5. Run `make benchmark-check`. It validates all descriptors and runs a synthetic report through the HTML renderer. The template handles summary cards, decision callouts, comparisons, tables, checks, text sections, artifacts, and audit data. A new benchmark does not require edits to its HTML template.

`benchmark-report.json` contains presentation data, not replacement measurements. Keep raw outputs beside it so the report can always be audited. A `decision` is optional and should appear only when that benchmark's descriptor or locked decision rule justifies one.

| Directory/file | Contents |
| --- | --- |
| `01-http-performance/` | Go/Rust HTTP servers, shared kernels, and TinyGo smoke entry point |
| `02-memory-footprint/` | RSS experiment descriptor using the HTTP implementations |
| `03-build-performance/` | Clean/no-op/edit build experiment descriptor using the HTTP implementations |
| `04-wasm-host-calls/` | Go/Rust hosts and their shared WASM guest |
| `05-target-coverage/` | Cross-target matrix descriptor using the shared kernels |
| `06-port-effort/` | Matched Go/Rust rule implementations, vectors, and conformance tests |
| `07-pocketbase-compatibility/` | Rust prototype, PocketBase oracle capture, and Go/Rust differential checks |
| `08-portable-validation/` | Portable test runner; saves timestamped logs and a standard HTML report |
| `09-language-decision/` | Pre-registered scoring and decision descriptor |
| `tools/` | Shared measurement support, generic HTML renderer, catalog validation, and evidence audits |
| `bootstrap.sh` | Install/check prerequisites and invoke the suite |

The HTTP and WASM sources are physically inside their numbered suites. The memory, build, and target experiments refer to the HTTP implementations instead of copying them. The PocketBase suite reuses the matched Go port and stores its Rust prototype beside the oracle runner. Build products go to the root `builds/` directory.
