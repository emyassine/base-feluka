#!/usr/bin/env python3
"""Run portable M0 unit/conformance checks and retain a timestamped audit trail."""
import datetime
import hashlib
import json
import os
import platform
import shlex
import subprocess
import sys
import time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from results_dir import new_run_dir, write_benchmark_report

ROOT = Path(__file__).resolve().parents[2]
RESULTS = ROOT / "results"


def version(command):
    env = os.environ.copy()
    env["GOTOOLCHAIN"] = "go1.27.1"
    result = subprocess.run(command, cwd=ROOT, env=env, text=True, capture_output=True)
    return (result.stdout or result.stderr).strip().splitlines()[0] if result.returncode == 0 else "unavailable"


def main():
    suite_started = time.perf_counter()
    output = new_run_dir(ROOT)

    commands = [
        ("go-unit", ["go", "test", "-mod=readonly", "./..."], ROOT / "benchmarks/01-http-performance/go"),
        ("go-port-conformance", ["go", "test", "-mod=readonly", "./..."], ROOT / "benchmarks/06-port-effort/go"),
        ("rust-server-unit", ["cargo", "test", "--locked", "--manifest-path", "benchmarks/01-http-performance/rust/Cargo.toml"], ROOT),
        ("rust-kernel-unit", ["cargo", "test", "--locked", "--manifest-path", "benchmarks/01-http-performance/rust/kernel/Cargo.toml"], ROOT),
        ("rust-pocketbase-conformance", ["cargo", "test", "--locked", "--manifest-path", "benchmarks/07-pocketbase-compatibility/rust/Cargo.toml"], ROOT),
        ("rust-port-conformance", ["cargo", "test", "--locked", "--manifest-path", "benchmarks/06-port-effort/rust/Cargo.toml"], ROOT),
        ("python-syntax", [sys.executable, "-m", "compileall", "-q", "benchmarks"], ROOT),
        ("benchmark-descriptors", [sys.executable, "benchmarks/tools/catalog.py", "validate"], ROOT),
        ("benchmark-report-format", [sys.executable, "benchmarks/tools/report_smoke.py"], ROOT),
        ("score-recalculation", [sys.executable, "benchmarks/tools/score_m0.py", "--output-dir", (Path("results") / output.name).as_posix()], ROOT),
        ("measurement-source-audit", [sys.executable, "benchmarks/tools/verify_measurement_sources.py", "--results-dir", "results/2026-10-24-23_11_32"], ROOT),
        ("published-evidence-manifest", [sys.executable, "benchmarks/tools/evidence_manifest.py", "--check"], ROOT),
    ]
    report = {
        "started_local": datetime.datetime.now().astimezone().isoformat(),
        "host": platform.platform(),
        "python": platform.python_version(),
        "go": version(["go", "version"]),
        "rustc": version(["rustc", "--version"]),
        "results_directory": output.relative_to(ROOT).as_posix(),
        "commands": [],
    }
    failures = 0
    command_env = os.environ.copy()
    command_env["GOTOOLCHAIN"] = "go1.27.1"
    for name, command, cwd in commands:
        log_path = output / f"{name}.log"
        print(f"[{name}] {shlex.join(command)}", flush=True)
        print(f"  log: {log_path.relative_to(ROOT)}", flush=True)
        started = time.perf_counter()
        with log_path.open("w") as log:
            process = subprocess.Popen(command, cwd=cwd, env=command_env, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            for line in process.stdout:
                log.write(line)
                log.flush()
                if name != "score-recalculation":
                    print(line, end="", flush=True)
            exit_code = process.wait()
        elapsed = time.perf_counter() - started
        digest = hashlib.sha256(log_path.read_bytes()).hexdigest()
        entry = {"name": name, "command": command, "cwd": cwd.relative_to(ROOT).as_posix(), "exit_code": exit_code, "elapsed_seconds": round(elapsed, 3), "log": log_path.name, "log_sha256": digest}
        report["commands"].append(entry)
        if name == "score-recalculation":
            if exit_code:
                print(log_path.read_text(), flush=True)
            else:
                totals = json.loads((output / "m0-score.json").read_text())["weighted_total_0_to_100"]
                print(f"  Rust: {totals['rust']:.2f}; Go: {totals['go']:.2f}", flush=True)
        print(f"[{name}] {'PASS' if exit_code == 0 else 'FAIL'} ({elapsed:.2f}s)", flush=True)
        failures += exit_code != 0
    report["finished_local"] = datetime.datetime.now().astimezone().isoformat()
    report["status"] = "failed" if failures else "passed"
    report["elapsed_seconds"] = round(time.perf_counter() - suite_started, 3)
    (output / "run.json").write_text(json.dumps(report, indent=2) + "\n")
    html_report = write_benchmark_report(output, {
        "schema_version": 1,
        "benchmark_id": "08-portable-validation",
        "title": "Portable validation",
        "status": report["status"],
        "generated_at": report["finished_local"],
        "summary": f"{len(commands) - failures} of {len(commands)} checks passed in {report['elapsed_seconds']:.2f} seconds.",
        "decision": None,
        "summary_cards": [
            {"label": "Checks passed", "value": f"{len(commands) - failures} / {len(commands)}", "note": "unit, conformance and audit checks"},
            {"label": "Failures", "value": failures, "note": "all checks must pass"},
            {"label": "Duration", "value": f"{report['elapsed_seconds']:.2f} s", "note": "total suite runtime"},
        ],
        "sections": [{
            "title": "Validation steps",
            "type": "checks",
            "columns": ["Check", "Status", "Duration", "Log"],
            "rows": [[item["name"], "Passed" if item["exit_code"] == 0 else "Failed", f"{item['elapsed_seconds']:.2f} s", item["log"]] for item in report["commands"]],
        }],
        "limitations": [],
    })
    print(f"Suite {report['status']}: {len(commands) - failures}/{len(commands)} checks in {report['elapsed_seconds']:.2f}s", flush=True)
    print(f"Test evidence: {output.relative_to(ROOT)}/run.json", flush=True)
    print(f"HTML report: {html_report.relative_to(ROOT)}", flush=True)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
