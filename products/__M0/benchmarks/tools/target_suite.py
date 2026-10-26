#!/usr/bin/env python3
"""Build the shared Feluka kernel for the M0 target matrix."""
import datetime
import json
import os
import platform
import subprocess
from pathlib import Path
from results_dir import new_run_dir, write_html_report


ROOT = Path(__file__).resolve().parents[2]
RUST_TARGETS = [
    "x86_64-unknown-linux-gnu",
    "aarch64-unknown-linux-gnu",
    "x86_64-pc-windows-gnu",
    "aarch64-apple-darwin",
    "x86_64-apple-darwin",
    "aarch64-apple-ios",
    "aarch64-apple-ios-sim",
    "aarch64-linux-android",
    "wasm32-unknown-unknown",
    "wasm32-wasip1",
    "aarch64-unknown-none",
    "thumbv7em-none-eabi",
]
GO_TARGETS = [
    ("linux", "amd64"), ("linux", "arm64"), ("windows", "amd64"),
    ("darwin", "amd64"), ("darwin", "arm64"), ("android", "arm64"),
    ("js", "wasm"), ("wasip1", "wasm"), ("ios", "arm64"),
]


def run(command, cwd, env=None):
    result = subprocess.run(command, cwd=cwd, env=env, text=True, capture_output=True)
    return {
        "command": command,
        "exit_code": result.returncode,
        "ok": result.returncode == 0,
        "stdout": result.stdout[-2000:],
        "stderr": result.stderr[-3000:],
    }


def main():
    tinygo = os.environ.get("TINYGO", "tinygo")
    results = {
        "started_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "host": platform.platform(),
        "purpose": "Compile equivalent authorization kernels for server, desktop, mobile, web/WASI and no_std/TinyGo target classes.",
        "tool_versions": {
            "rustc": subprocess.run(["rustc", "--version"], text=True, capture_output=True, check=True).stdout.strip(),
            "go": subprocess.run(["go", "version"], text=True, capture_output=True, check=True).stdout.strip(),
            "tinygo": subprocess.run([tinygo, "version"], text=True, capture_output=True, check=True).stdout.strip(),
        },
        "rust": [],
        "go": [],
        "tinygo": [],
    }
    temp = ROOT / "builds/targets"
    temp.mkdir(parents=True, exist_ok=True)
    for target in RUST_TARGETS:
        entry = run(
            ["cargo", "build", "--locked", "--manifest-path", str(ROOT / "benchmarks/01-http-performance/rust/kernel/Cargo.toml"), "--target", target],
            ROOT,
        )
        entry["target"] = target
        results["rust"].append(entry)
        print("Rust", target, "PASS" if entry["ok"] else "FAIL", flush=True)

    for goos, goarch in GO_TARGETS:
        output = temp / f"go-{goos}-{goarch}.test"
        env = os.environ.copy()
        env.update(GOOS=goos, GOARCH=goarch, CGO_ENABLED="0")
        entry = run(["go", "test", "-c", "-o", str(output), "./kernel"], ROOT / "benchmarks/01-http-performance/go", env)
        entry["target"] = f"{goos}/{goarch}"
        if entry["ok"]:
            entry["artifact_bytes"] = output.stat().st_size
        results["go"].append(entry)
        print("Go", entry["target"], "PASS" if entry["ok"] else "FAIL", flush=True)

    for target in ("wasi", "wasm", "feather-m4"):
        suffix = ".wasm" if target in ("wasi", "wasm") else ".elf"
        output = temp / f"tinygo-{target}{suffix}"
        entry = run([tinygo, "build", "-target", target, "-o", str(output), "./tinygo-smoke"], ROOT / "benchmarks/01-http-performance/go")
        entry["target"] = target
        if entry["ok"]:
            entry["artifact_bytes"] = output.stat().st_size
        results["tinygo"].append(entry)
        print("TinyGo", target, "PASS" if entry["ok"] else "FAIL", flush=True)


    output_dir = new_run_dir(ROOT)
    path = output_dir / "target-build-suite.json"
    path.write_text(json.dumps(results, indent=2) + "\n")
    print(f"saved {path} and {write_html_report(output_dir, 'Target build matrix')}")


if __name__ == "__main__":
    main()
