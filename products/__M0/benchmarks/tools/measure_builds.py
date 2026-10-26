#!/usr/bin/env python3
"""Measure repeated isolated clean builds and rebuilds after harmless source edits."""
import datetime
import hashlib
import json
import os
import platform
import shutil
import subprocess
import tempfile
import time
from pathlib import Path
from results_dir import new_run_dir, write_benchmark_report


ROOT = Path(__file__).resolve().parents[2]
GO_SOURCE = ROOT / "benchmarks/01-http-performance/go/main.go"
RUST_SOURCE = ROOT / "benchmarks/01-http-performance/rust/src/main.rs"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def timed(command, cwd, env):
    start = time.perf_counter()
    result = subprocess.run(command, cwd=cwd, env=env, text=True, capture_output=True)
    return {
        "command": command,
        "elapsed_ms": (time.perf_counter() - start) * 1000,
        "exit_code": result.returncode,
        "stdout": result.stdout[-1000:],
        "stderr": result.stderr[-3000:],
    }


def go_env(cache):
    env = os.environ.copy()
    env.update(GOOS="linux", GOARCH="amd64", CGO_ENABLED="1", GOCACHE=str(cache))
    return env


def rust_env(target):
    env = os.environ.copy()
    env.update(CARGO_TARGET_DIR=str(target), LIBSQLITE3_SYS_USE_PKG_CONFIG="1")
    return env


def main():
    report = {
        "started_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "host": platform.platform(),
        "repetitions": 3,
        "method": "Each clean build uses an isolated empty compiler/project cache; source-package caches remain available. Edit builds append and remove a unique comment in the actual main source file, preserving exact original bytes afterward. Build order alternates by repetition and binaries are stripped release artifacts.",
        "go": [],
        "rust": [],
    }
    original = {GO_SOURCE: GO_SOURCE.read_bytes(), RUST_SOURCE: RUST_SOURCE.read_bytes()}
    try:
        with tempfile.TemporaryDirectory(prefix="feluka-m0-builds-") as temp:
            temp = Path(temp)
            go_edit_cache = temp / "go-cache-edit"
            go_edit_cache.mkdir()
            go_edit_output = temp / "feluka-go-edit"
            go_edit_command = ["go", "build", "-tags", "libsqlite3", "-trimpath", "-ldflags", "-s -w", "-o", str(go_edit_output), "."]
            go_edit_env = go_env(go_edit_cache)
            go_edit_warm = timed(go_edit_command, ROOT / "benchmarks/01-http-performance/go", go_edit_env)
            if go_edit_warm["exit_code"]:
                raise RuntimeError(f"Go edit-cache warmup failed: {go_edit_warm['stderr']}")

            rust_edit_target = temp / "rust-target-edit"
            rust_edit_target.mkdir()
            rust_edit_output = rust_edit_target / "release/feluka-m0-rust"
            rust_edit_command = ["cargo", "build", "--locked", "--release", "--manifest-path", str(ROOT / "benchmarks/01-http-performance/rust/Cargo.toml")]
            rust_edit_env = rust_env(rust_edit_target)
            rust_edit_warm = timed(rust_edit_command, ROOT, rust_edit_env)
            if rust_edit_warm["exit_code"]:
                raise RuntimeError(f"Rust edit-cache warmup failed: {rust_edit_warm['stderr']}")

            for repetition in range(1, 4):
                order = ["go", "rust"] if repetition % 2 else ["rust", "go"]
                for runtime in order:
                    if runtime == "go":
                        cache = temp / f"go-cache-clean-{repetition}"
                        cache.mkdir()
                        output = temp / f"feluka-go-clean-{repetition}"
                        command = ["go", "build", "-tags", "libsqlite3", "-trimpath", "-ldflags", "-s -w", "-o", str(output), "."]
                        clean = timed(command, ROOT / "benchmarks/01-http-performance/go", go_env(cache))
                        if clean["exit_code"]:
                            raise RuntimeError(f"Go clean build failed: {clean['stderr']}")
                        clean["binary_bytes"] = output.stat().st_size
                        clean["binary_sha256"] = sha(output)
                        noop = timed(command, ROOT / "benchmarks/01-http-performance/go", go_env(cache))
                        if noop["exit_code"]:
                            raise RuntimeError(f"Go no-op build failed: {noop['stderr']}")
                        source = GO_SOURCE
                        source.write_bytes(original[source] + f"\n// feluka-m0-edit-{repetition}\n".encode())
                        try:
                            edited = timed(go_edit_command, ROOT / "benchmarks/01-http-performance/go", go_edit_env)
                        finally:
                            source.write_bytes(original[source])
                        if edited["exit_code"]:
                            raise RuntimeError(f"Go edit build failed: {edited['stderr']}")
                        edited["binary_bytes"] = go_edit_output.stat().st_size
                        edited["cache_warmup_ms"] = go_edit_warm["elapsed_ms"]
                        report["go"].append({"repetition": repetition, "clean": clean, "noop": noop, "edit_rebuild": edited})
                    else:
                        target = temp / f"rust-target-clean-{repetition}"
                        target.mkdir()
                        output = target / "release/feluka-m0-rust"
                        command = ["cargo", "build", "--locked", "--release", "--manifest-path", str(ROOT / "benchmarks/01-http-performance/rust/Cargo.toml")]
                        env = rust_env(target)
                        clean = timed(command, ROOT, env)
                        if clean["exit_code"]:
                            raise RuntimeError(f"Rust clean build failed: {clean['stderr']}")
                        clean["binary_bytes"] = output.stat().st_size
                        clean["binary_sha256"] = sha(output)
                        noop = timed(command, ROOT, env)
                        if noop["exit_code"]:
                            raise RuntimeError(f"Rust no-op build failed: {noop['stderr']}")
                        source = RUST_SOURCE
                        source.write_bytes(original[source] + f"\n// feluka-m0-edit-{repetition}\n".encode())
                        try:
                            edited = timed(rust_edit_command, ROOT, rust_edit_env)
                        finally:
                            source.write_bytes(original[source])
                        if edited["exit_code"]:
                            raise RuntimeError(f"Rust edit build failed: {edited['stderr']}")
                        edited["binary_bytes"] = rust_edit_output.stat().st_size
                        edited["cache_warmup_ms"] = rust_edit_warm["elapsed_ms"]
                        report["rust"].append({"repetition": repetition, "clean": clean, "noop": noop, "edit_rebuild": edited})

            (ROOT / "builds/bin").mkdir(parents=True, exist_ok=True)
            (ROOT / "builds/cargo/release").mkdir(parents=True, exist_ok=True)
            shutil.copy2(temp / "feluka-go-clean-3", ROOT / "builds/bin/feluka-m0-go")
            shutil.copy2(temp / "rust-target-clean-3/release/feluka-m0-rust", ROOT / "builds/cargo/release/feluka-m0-rust")
    finally:
        for path, content in original.items():
            if path.read_bytes() != content:
                path.write_bytes(content)

    report["source_sha256_after"] = {"benchmarks/01-http-performance/go/main.go": sha(GO_SOURCE), "benchmarks/01-http-performance/rust/src/main.rs": sha(RUST_SOURCE)}
    report["expected_source_sha256"] = {"benchmarks/01-http-performance/go/main.go": hashlib.sha256(original[GO_SOURCE]).hexdigest(), "benchmarks/01-http-performance/rust/src/main.rs": hashlib.sha256(original[RUST_SOURCE]).hexdigest()}
    if report["source_sha256_after"] != report["expected_source_sha256"]:
        raise RuntimeError("source was not restored exactly after edit builds")
    output_dir = new_run_dir(ROOT)
    destination = output_dir / "final-build-metrics.json"
    destination.write_text(json.dumps(report, indent=2) + "\n")
    comparisons = []
    rows = []
    for kind, key, label in (("clean", "elapsed_ms", "Clean build"), ("noop", "elapsed_ms", "No-op build"), ("edit_rebuild", "elapsed_ms", "Rebuild after source edit")):
        values = {runtime.title(): statistics.median(item[kind][key] for item in report[runtime]) / 1000 for runtime in ("go", "rust")}
        comparisons.append({"label": label, "unit": "s", "decimals": 2, "better": "lower", "values": values})
    for runtime in ("go", "rust"):
        for item in report[runtime]:
            rows.append([runtime.title(), item["repetition"], f"{item['clean']['elapsed_ms'] / 1000:.2f}", f"{item['noop']['elapsed_ms'] / 1000:.2f}", f"{item['edit_rebuild']['elapsed_ms'] / 1000:.2f}", item["clean"]["binary_bytes"]])
    html_report = write_benchmark_report(output_dir, {
        "schema_version": 1,
        "benchmark_id": "03-build-performance",
        "title": "Build performance",
        "status": "passed",
        "generated_at": report["started_utc"],
        "summary": report["method"],
        "decision": None,
        "summary_cards": [
            {"label": "Build repetitions", "value": report["repetitions"], "note": "per implementation and build type"},
            {"label": "Implementations", "value": "Go and Rust", "note": "same application sources"},
            {"label": "Source integrity", "value": "Verified", "note": "edited files restored byte for byte"},
        ],
        "sections": [
            {"title": "Build time comparison", "type": "comparison", "metrics": comparisons},
            {"title": "Individual repetitions", "type": "table", "columns": ["Runtime", "Repetition", "Clean (s)", "No-op (s)", "Edited-source rebuild (s)", "Binary bytes"], "rows": rows},
        ],
        "limitations": ["Build timings are from isolated local caches and the recorded host; they are not directly comparable across different machines."],
    })
    print(f"saved {destination} and {html_report}", flush=True)


if __name__ == "__main__":
    main()
