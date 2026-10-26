#!/usr/bin/env python3
"""Run the matched Go/Rust port conformance suite and retain a timestamped report."""
import json
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "benchmarks/tools"))
from results_dir import new_run_dir, write_benchmark_report


def main():
    out = new_run_dir(ROOT)
    commands = [
        ("Go", ["go", "test", "-mod=readonly", "./..."], ROOT / "benchmarks/06-port-effort/go", "go-port.log"),
        ("Rust", ["cargo", "test", "--locked", "--manifest-path", "benchmarks/06-port-effort/rust/Cargo.toml"], ROOT, "rust-port.log"),
    ]
    rows = []
    failures = 0
    for language, command, cwd, log_name in commands:
        started = time.perf_counter()
        result = subprocess.run(command, cwd=cwd, env=os.environ.copy(), text=True, capture_output=True)
        elapsed = time.perf_counter() - started
        output = (result.stdout or "") + (result.stderr or "")
        (out / log_name).write_text(output)
        passed = result.returncode == 0
        failures += not passed
        rows.append([language, "Passed" if passed else f"Failed ({result.returncode})", f"{elapsed:.2f} s", log_name])
        print(f"{language}: {'PASS' if passed else 'FAIL'} ({elapsed:.2f}s)", flush=True)
    status = "failed" if failures else "passed"
    (out / "port-suite.json").write_text(json.dumps({"status": status, "checks": rows}, indent=2) + "\n")
    report = {
        "schema_version": 1,
        "benchmark_id": "06-port-effort",
        "title": "Matched Go/Rust port conformance",
        "status": status,
        "summary": f"{len(rows) - failures} of {len(rows)} implementation suites passed against the shared frozen vectors.",
        "decision": None,
        "summary_cards": [
            {"label": "Implementations passed", "value": f"{len(rows) - failures} / {len(rows)}", "note": "same shared vector set"},
            {"label": "Result", "value": status.title(), "note": "conformance checks"},
        ],
        "sections": [{"title": "Language conformance", "type": "checks", "columns": ["Language", "Status", "Duration", "Log"], "rows": rows}],
        "limitations": [],
    }
    html_path = write_benchmark_report(out, report)
    print(f"Report: {html_path}", flush=True)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
