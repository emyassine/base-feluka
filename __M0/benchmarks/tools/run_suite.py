#!/usr/bin/env python3
"""Run the pinned, alternating M0 HTTP benchmark suite and save its evidence."""
import datetime
import hashlib
import json
import os
import platform
import re
import signal
import statistics
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
import argparse

from results_dir import new_run_dir, write_benchmark_report


ROOT = Path(__file__).resolve().parents[2]
BINARIES = {
    "go": ROOT / "builds/bin" / "feluka-m0-go",
    "rust": ROOT / "builds/cargo" / "release" / "feluka-m0-rust",
}
PORTS = {"go": 38100, "rust": 38101}
ORDER = [
    ("go", 1), ("rust", 1), ("rust", 1), ("go", 1), ("go", 1), ("rust", 1),
    ("rust", 8), ("go", 8), ("go", 8), ("rust", 8), ("rust", 8), ("go", 8),
]


def command_output(command):
    result = subprocess.run(command, check=True, capture_output=True, text=True)
    return result.stdout.strip()


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def wait_ready(process, url, expected_runtime):
    deadline = time.monotonic() + 10
    while time.monotonic() < deadline:
        if process.poll() is not None:
            raise RuntimeError(f"server exited early with status {process.returncode}")
        try:
            with urllib.request.urlopen(url, timeout=0.25) as response:
                body = response.read().decode("utf-8")
                if response.status == 200 and f'"runtime":"{expected_runtime}"' in body:
                    return
        except (OSError, urllib.error.URLError):
            time.sleep(0.05)
    raise TimeoutError(f"server did not become ready at {url}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, help="write this measurement to a specific directory")
    args = parser.parse_args()
    for name, binary in BINARIES.items():
        if not binary.is_file():
            raise SystemExit(f"missing {name} binary: {binary}; build it using README.md")
    database = ROOT / "builds/data" / "orders.sqlite"
    if not database.is_file():
        raise SystemExit(f"missing database: {database}; create it using make seed")

    results = {
        "started_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "host": platform.platform(),
        "python": platform.python_version(),
        "go": command_output(["go", "version"]),
        "rustc": command_output(["rustc", "--version"]),
        "sqlite": command_output(["pkg-config", "--modversion", "sqlite3"]),
        "cpu_model": next((line.split(":", 1)[1].strip() for line in Path("/proc/cpuinfo").read_text().splitlines() if line.startswith("model name")), "unknown"),
        "server_cpu_affinity": "2",
        "load_generator_cpu_affinity": "0,1,3-7",
        "cpu2_governor": Path("/sys/devices/system/cpu/cpu2/cpufreq/scaling_governor").read_text().strip() if Path("/sys/devices/system/cpu/cpu2/cpufreq/scaling_governor").exists() else "unavailable",
        "database_bytes": database.stat().st_size,
        "database_sha256": sha256(database),
        "sha256": {},
        "runs": [],
    }
    for relative in (
        "benchmarks/tools/bench.py", "benchmarks/tools/run_suite.py", "benchmarks/tools/seed.py", "benchmarks/01-http-performance/go/main.go", "benchmarks/01-http-performance/go/go.mod", "benchmarks/01-http-performance/go/go.sum",
        "benchmarks/01-http-performance/rust/src/main.rs", "benchmarks/01-http-performance/rust/Cargo.toml", "benchmarks/01-http-performance/rust/Cargo.lock",
        "builds/bin/feluka-m0-go", "builds/cargo/release/feluka-m0-rust",
    ):
        results["sha256"][relative] = sha256(ROOT / relative)
    readable_log = []
    repetitions = {}
    results_dir = args.output_dir.resolve() if args.output_dir else new_run_dir(ROOT)
    results_dir.mkdir(parents=True, exist_ok=True)
    samples_dir = results_dir / "samples"
    for index, (runtime, concurrency) in enumerate(ORDER, start=1):
        series = (runtime, concurrency)
        repetitions[series] = repetitions.get(series, 0) + 1
        repetition = repetitions[series]
        port = PORTS[runtime]
        base_url = f"http://127.0.0.1:{port}"
        env = os.environ.copy()
        env["M0_DB"] = str(database)
        env["M0_ADDR"] = f"127.0.0.1:{port}"
        server_command = ["taskset", "-c", "2", str(BINARIES[runtime])]
        server = subprocess.Popen(server_command, cwd=ROOT, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        try:
            wait_ready(server, base_url + "/healthz", runtime)
            sample_file = samples_dir / f"{runtime}-c{concurrency}-run{repetition}.csv.gz"
            benchmark_command = [
                "taskset", "-c", "0,1,3-7", sys.executable, str(ROOT / "benchmarks/tools/bench.py"), base_url,
                "--requests", "10000", "--warmup", "1000", "--concurrency", str(concurrency),
                "--samples-out", str(sample_file),
            ]
            completed = subprocess.run(benchmark_command, cwd=ROOT, env=env, capture_output=True, text=True, check=True)
            entry = {
                "index": index,
                "runtime": runtime,
                "concurrency": concurrency,
                "repetition": repetition,
                "warmup_requests": 1000,
                "measured_requests": 10000,
                "server_command": server_command,
                "benchmark_command": benchmark_command,
                "output": completed.stdout.strip(),
                "sample_file": str(sample_file.relative_to(ROOT)),
                "sample_rows": 10000,
                "sample_sha256": sha256(sample_file),
            }
            results["runs"].append(entry)
            block = f"[{index:02d}] {runtime} concurrency={concurrency}\n{entry['output']}"
            readable_log.append(block)
            print(block, flush=True)
        finally:
            if server.poll() is None:
                server.send_signal(signal.SIGINT)
                try:
                    server.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    server.kill()
                    server.wait()

    results_dir.mkdir(exist_ok=True)
    (results_dir / "suite.json").write_text(json.dumps(results, indent=2) + "\n")
    (results_dir / "run-log.txt").write_text("\n\n".join(readable_log) + "\n")
    def read_metric(output, group, metric):
        match = re.search(rf"{group}:.*?\b{metric}=([0-9.]+)", output)
        return float(match.group(1)) if match else None

    comparisons = []
    table_rows = []
    group_keys = sorted({(run["concurrency"], run["runtime"]) for run in results["runs"]})
    by_group = {}
    for concurrency, runtime in group_keys:
        matching = [run for run in results["runs"] if run["concurrency"] == concurrency and run["runtime"] == runtime]
        by_group[(concurrency, runtime)] = matching
        values = {key: statistics.median(value for run in matching if (value := read_metric(run["output"], group, key)) is not None) for group, key in (("app_ms", "p50"), ("app_ms", "p99"), ("client_ms", "p50"), ("client_ms", "p99"))}
        for run in matching:
            table_rows.append([runtime.title(), concurrency, run["repetition"], read_metric(run["output"], "app_ms", "p50"), read_metric(run["output"], "app_ms", "p99"), run["sample_rows"]])
    for concurrency in sorted({run["concurrency"] for run in results["runs"]}):
        for group, key, label in (("app_ms", "p50", "Application p50"), ("app_ms", "p99", "Application p99"), ("client_ms", "p50", "Client p50"), ("client_ms", "p99", "Client p99")):
            values = {}
            for runtime in ("go", "rust"):
                samples = [read_metric(run["output"], group, key) for run in by_group.get((concurrency, runtime), [])]
                samples = [value for value in samples if value is not None]
                if samples:
                    values[runtime.title()] = statistics.median(samples)
            if values:
                comparisons.append({"label": f"{label} · concurrency {concurrency}", "unit": "ms", "decimals": 3, "better": "lower", "values": values})
    report = write_benchmark_report(results_dir, {
        "schema_version": 1,
        "benchmark_id": "01-http-performance",
        "title": "HTTP performance",
        "status": "passed",
        "generated_at": results["started_utc"],
        "summary": "Alternating pinned request runs. Application timings are measured inside each server; client timings include network and client overhead.",
        "decision": None,
        "summary_cards": [
            {"label": "Measured requests", "value": f"{sum(run['measured_requests'] for run in results['runs']):,}", "note": f"{len(results['runs'])} alternating runs"},
            {"label": "Implementations", "value": "Go and Rust", "note": "same SQLite workload"},
            {"label": "Concurrency levels", "value": len({run['concurrency'] for run in results['runs']}), "note": "recorded separately"},
        ],
        "sections": [
            {"title": "Latency comparison", "type": "comparison", "metrics": comparisons},
            {"title": "Individual runs", "type": "table", "columns": ["Runtime", "Concurrency", "Repetition", "Application p50 (ms)", "Application p99 (ms)", "Requests"], "rows": table_rows},
        ],
        "limitations": ["This workload is pinned to a specific Linux CPU arrangement and is not a production performance guarantee."],
    })
    print(f"saved {results_dir / 'suite.json'}, {results_dir / 'run-log.txt'}, and {report}", flush=True)


if __name__ == "__main__":
    main()
