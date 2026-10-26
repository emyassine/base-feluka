#!/usr/bin/env python3
"""Capture PocketBase behavior and run the differential suites with a saved log."""
import datetime
import json
import os
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "benchmarks/tools"))
from results_dir import new_run_dir, write_html_report


def run(command, cwd):
    print("$", " ".join(map(str, command)), flush=True)
    result = subprocess.run(command, cwd=cwd, text=True, capture_output=True)
    if result.stdout:
        print(result.stdout, end="", flush=True)
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr, flush=True)
    return {
        "command": list(map(str, command)),
        "cwd": str(cwd),
        "exit_code": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
    }


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: python3 benchmarks/07-pocketbase-compatibility/run_suite.py /path/to/pocketbase-v0.40.6")
    binary = Path(sys.argv[1]).resolve()
    output_dir = new_run_dir(ROOT)
    output_file = output_dir / "pocketbase-suite-run.json"
    os.environ["M0_POCKETBASE_REFERENCE"] = str(output_dir / "pocketbase-reference.json")
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    commands = [
        ([sys.executable, str(ROOT / "benchmarks/07-pocketbase-compatibility/capture_reference.py"), str(binary), "--output", str(output_dir / "pocketbase-reference.json")], ROOT),
        (["cargo", "test", "--locked", "--manifest-path", "benchmarks/07-pocketbase-compatibility/rust/Cargo.toml"], ROOT),
        (["cargo", "test", "--locked", "--manifest-path", "benchmarks/06-port-effort/rust/Cargo.toml"], ROOT),
        (["go", "test", "./..."], ROOT / "benchmarks/06-port-effort/go"),
    ]
    results = []
    for command, cwd in commands:
        result = run(command, cwd)
        results.append(result)
        if result["exit_code"]:
            output_file.write_text(json.dumps({
                "started_utc": started,
                "pocketbase_binary": str(binary),
                "commands": results,
                "passed": False,
            }, indent=2) + "\n")
            write_html_report(output_dir, "PocketBase compatibility results")
            raise SystemExit(result["exit_code"])
    output_file.write_text(json.dumps({
        "started_utc": started,
        "pocketbase_binary": str(binary),
        "commands": results,
        "passed": True,
    }, indent=2) + "\n")
    report = write_html_report(output_dir, "PocketBase compatibility results")
    print(f"HTML report: {report}", flush=True)
    print("PocketBase capture and Rust/Go differential suites passed.", flush=True)


if __name__ == "__main__":
    main()
