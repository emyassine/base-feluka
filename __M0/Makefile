.DEFAULT_GOAL := all
PYTHON ?= python3
GO ?= go
CARGO ?= cargo
POCKETBASE ?=
TINYGO ?= tinygo
DATABASE := builds/data/orders.sqlite
TOOLS := benchmarks/tools
export GOTOOLCHAIN := go1.27.1

.PHONY: all install check test help build seed bench http rss builds wasm targets port-effort pocketbase score benchmark-list benchmark-check evidence-write evidence-check clean

all:
	./benchmarks/bootstrap.sh all

install:
	./benchmarks/bootstrap.sh install

check:
	./benchmarks/bootstrap.sh check

test:
	$(PYTHON) benchmarks/08-portable-validation/run.py

benchmark-list:
	$(PYTHON) benchmarks/tools/catalog.py list

benchmark-check:
	$(PYTHON) benchmarks/tools/catalog.py validate
	$(PYTHON) benchmarks/tools/report_smoke.py

help:
	@printf '%s\n' \
	  'all             Install missing prerequisites, run portable tests and audit retained evidence' \
	  'install         Install supported system prerequisites and pinned toolchains' \
	  'check           Check local dependencies without installing packages' \
	  'test            Run portable tests; save results/<timestamp>/run.json and logs' \
	  'benchmark-list  List numbered benchmark suites and implementations' \
	  'benchmark-check Validate descriptors/manifests and smoke-test the HTML report format' \
	  'build           Build HTTP executables into builds/' \
	  'bench / http    Repeat the pinned HTTP benchmark (Linux)' \
	  'rss             Repeat sampled RSS measurements (Linux)' \
	  'builds          Repeat clean/no-op/source-edit build measurements' \
	  'wasm            Repeat the WASM host-call benchmark (Linux)' \
	  'targets         Compile the Rust/Go/TinyGo cross-target matrix' \
	  'port-effort     Run the matched Go/Rust rule conformance suite' \
	  'pocketbase      Capture the oracle and check ports; POCKETBASE=/path/to/binary' \
	  'score           Recalculate the retained decision score' \
	  'evidence-check  Verify retained evidence and source hashes' \
	  'evidence-write  Refresh the publication index after reviewed source changes' \
	  'clean           Remove generated builds; preserve source and results'

seed:
	$(PYTHON) $(TOOLS)/seed.py ./$(DATABASE)

build:
	mkdir -p builds/bin
	cd benchmarks/01-http-performance/go && CGO_ENABLED=1 $(GO) build -mod=readonly -tags libsqlite3 -trimpath -ldflags='-s -w' -o ../../../builds/bin/feluka-m0-go .
	LIBSQLITE3_SYS_USE_PKG_CONFIG=1 $(CARGO) build --locked --release --manifest-path benchmarks/01-http-performance/rust/Cargo.toml

bench http: build seed
	$(PYTHON) $(TOOLS)/run_suite.py

rss: build seed
	$(PYTHON) $(TOOLS)/memory_suite.py

builds:
	$(PYTHON) $(TOOLS)/measure_builds.py

wasm:
	$(PYTHON) benchmarks/tools/wasm_suite.py

targets:
	TINYGO=$(TINYGO) $(PYTHON) $(TOOLS)/target_suite.py

port-effort:
	$(PYTHON) $(TOOLS)/port_suite.py

pocketbase:
	@test -n "$(POCKETBASE)" || (echo 'Set POCKETBASE=/path/to/pocketbase-v0.40.6' >&2; exit 2)
	$(PYTHON) benchmarks/07-pocketbase-compatibility/run_suite.py "$(POCKETBASE)"

score:
	$(PYTHON) $(TOOLS)/score_m0.py

evidence-write:
	$(PYTHON) $(TOOLS)/normalize_evidence_paths.py --write
	$(PYTHON) $(TOOLS)/score_m0.py --output-dir results/2026-10-24-23_11_32 >/dev/null
	$(PYTHON) $(TOOLS)/evidence_manifest.py --write

evidence-check:
	$(PYTHON) $(TOOLS)/normalize_evidence_paths.py --check
	$(PYTHON) $(TOOLS)/evidence_manifest.py --check
	$(PYTHON) $(TOOLS)/verify_measurement_sources.py

clean:
	rm -rf builds/cargo builds/bin builds/data builds/targets
	find benchmarks -type d -name __pycache__ -prune -exec rm -rf {} +
