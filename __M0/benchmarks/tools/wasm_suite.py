#!/usr/bin/env python3
"""Run the fixed alternating Go/Rust M0 Wasm host-call benchmark."""
import datetime
import hashlib
import json
import os
import platform
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "benchmarks/tools"))
from results_dir import new_run_dir, write_html_report
ORDER = ["go", "rust", "rust", "go", "go", "rust"]
BINARIES = {
    "go": ROOT / "builds/bin/feluka-m0-wasm-go-host",
    "rust": ROOT / "builds/cargo/release/feluka-m0-wasm-rust-host",
}
COMMANDS = {
    "go": ["go", "build", "-trimpath", "-o", str(BINARIES["go"]), "."],
    "rust": ["cargo", "build", "--locked", "--release", "--manifest-path", str(ROOT / "benchmarks/04-wasm-host-calls/rust/Cargo.toml")],
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    BINARIES["go"].parent.mkdir(parents=True, exist_ok=True)
    suite = {
        "started_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "host": platform.platform(),
        "cpu_affinity": "2",
        "order": ORDER,
        "runs": [],
        "sha256": {},
    }
    sources = [
        "benchmarks/04-wasm-host-calls/guest.c", "benchmarks/04-wasm-host-calls/guest.wasm", "benchmarks/04-wasm-host-calls/go/main.go", "benchmarks/04-wasm-host-calls/go/go.mod",
        "benchmarks/04-wasm-host-calls/rust/src/main.rs", "benchmarks/04-wasm-host-calls/rust/Cargo.toml", "benchmarks/04-wasm-host-calls/rust/Cargo.lock",
    ]
    for relative in sources:
        suite["sha256"][relative] = digest(ROOT / relative)
    for runtime, command in COMMANDS.items():
        run = subprocess.run(command, cwd=ROOT / f"benchmarks/04-wasm-host-calls/{runtime}", text=True, capture_output=True)
        if run.returncode:
            raise RuntimeError(f"build failed for {runtime}: {run.stderr}")
        suite["builds"] = suite.get("builds", {})
        suite["builds"][runtime] = {"command": command, "stdout": run.stdout, "stderr": run.stderr, "binary_sha256": digest(BINARIES[runtime])}

    for index, runtime in enumerate(ORDER, start=1):
        command = ["taskset", "-c", "2", str(BINARIES[runtime])]
        run = subprocess.run(command, cwd=ROOT / f"benchmarks/04-wasm-host-calls/{runtime}", text=True, capture_output=True)
        if run.returncode:
            raise RuntimeError(f"run {index} failed for {runtime}: {run.stderr}")
        suite["runs"].append({"index": index, "runtime": runtime, "command": command, "result": json.loads(run.stdout), "stderr": run.stderr})
        print(f"[{index}] {runtime} {run.stdout.strip()}", flush=True)
    output_dir = new_run_dir(ROOT)
    path = output_dir / "wasm-host-final-suite.json"
    path.write_text(json.dumps(suite, indent=2) + "\n")
    print(f"saved {path} and {write_html_report(output_dir, 'WASM host benchmark')}")


if __name__ == "__main__":
    main()
