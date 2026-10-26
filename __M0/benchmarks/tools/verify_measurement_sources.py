#!/usr/bin/env python3
"""Verify that retained source files match the final HTTP/build evidence hashes."""
import hashlib
import argparse
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESULTS = ROOT / "results/2026-10-24-23_11_32"


def sha256(path):
    checksum = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            checksum.update(chunk)
    return checksum.hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--results-dir", type=Path, default=RESULTS)
    results = parser.parse_args().results_dir
    suite = json.loads((results / "suite.json").read_text())
    build = json.loads((RESULTS / "final-build-metrics.json").read_text())
    recorded = suite["sha256"]
    mappings = {
        "bench.py": "results/2026-10-24-23_11_32/source-snapshots/bench.py",
        "run_suite.py": "results/2026-10-24-23_11_32/source-snapshots/run_suite.py",
        "seed.py": "results/2026-10-24-23_11_32/source-snapshots/seed.py",
        "go/main.go": "benchmarks/01-http-performance/go/main.go",
        "go/go.mod": "benchmarks/01-http-performance/go/go.mod",
        "go/go.sum": "benchmarks/01-http-performance/go/go.sum",
        "rust/src/main.rs": "benchmarks/01-http-performance/rust/src/main.rs",
        "rust/Cargo.toml": "benchmarks/01-http-performance/rust/Cargo.toml",
        "rust/Cargo.lock": "benchmarks/01-http-performance/rust/Cargo.lock",
    }
    problems = []
    for evidence_name, relative in mappings.items():
        path = ROOT / relative
        actual = sha256(path) if path.is_file() else "<missing>"
        if actual != recorded[evidence_name]:
            problems.append(f"{evidence_name}: expected {recorded[evidence_name]}, got {actual}")

    binary_map = {
        "bin/feluka-m0-go": ("go", "Go"),
        "rust/target/release/feluka-m0-rust": ("rust", "Rust"),
    }
    for evidence_name, (language, display) in binary_map.items():
        hashes = {run["clean"]["binary_sha256"] for run in build[language]}
        if hashes != {recorded[evidence_name]}:
            problems.append(f"{display} binary hash in HTTP and build evidence does not match")

    database = ROOT / "builds/data/orders.sqlite"
    if database.is_file() and sha256(database) != suite["database_sha256"]:
        problems.append("generated SQLite database does not match the HTTP run hash")

    for run in suite["runs"]:
        sample = results / "samples" / Path(run["sample_file"]).name
        if not sample.is_file() or sha256(sample) != run["sample_sha256"]:
            problems.append(f"missing or changed HTTP sample: {run['sample_file']}")

    if problems:
        print("Measurement source audit failed:", file=sys.stderr)
        print("\n".join(f"- {problem}" for problem in problems), file=sys.stderr)
        return 1
    print("Verified measured HTTP harness/source hashes, final binary hashes, and all 12 sample hashes.")
    if not database.is_file():
        print(f"The generated database is not checked in; its expected SHA-256 remains recorded in {results / 'suite.json'}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
