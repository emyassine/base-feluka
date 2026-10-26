#!/usr/bin/env python3
"""Repeat the M0 RSS sample with the same pinned HTTP workload."""
import datetime
import json
import os
import platform
import re
import signal
import statistics
import subprocess
import sys
import threading
import time
import urllib.request
from pathlib import Path
from results_dir import new_run_dir, write_benchmark_report


ROOT = Path(__file__).resolve().parents[2]
BINARIES = {
    "go": ROOT / "builds/bin" / "feluka-m0-go",
    "rust": ROOT / "builds/cargo" / "release" / "feluka-m0-rust",
}
PORTS = {"go": 38200, "rust": 38201}
ORDER = ["go", "rust", "rust", "go", "go", "rust"]


def main():
    results = {
        "started_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "host": platform.platform(),
        "protocol": "Three alternating 10,000-request runs per runtime, concurrency 8, 1,000 warmup requests; server pinned CPU 2; load generator pinned CPUs 0,1,3-7; VmRSS sampled every 5 ms from process start through benchmark.",
        "runs": [],
    }
    database = ROOT / "builds/data" / "orders.sqlite"
    for index, runtime in enumerate(ORDER, start=1):
        port = PORTS[runtime]
        env = os.environ.copy()
        env.update(M0_DB=str(database), M0_ADDR=f"127.0.0.1:{port}")
        server = subprocess.Popen(
            ["taskset", "-c", "2", str(BINARIES[runtime])],
            cwd=ROOT,
            env=env,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        stop = threading.Event()
        rss_samples = []

        def sample_rss():
            status_file = Path(f"/proc/{server.pid}/status")
            while not stop.is_set():
                try:
                    match = re.search(r"^VmRSS:\s+(\d+)\s+kB", status_file.read_text(), re.M)
                    if match:
                        rss_samples.append(int(match.group(1)))
                except (FileNotFoundError, ProcessLookupError):
                    pass
                stop.wait(0.005)

        sampler = threading.Thread(target=sample_rss, daemon=True)
        sampler.start()
        try:
            deadline = time.monotonic() + 10
            while time.monotonic() < deadline:
                if server.poll() is not None:
                    raise RuntimeError(f"{runtime} server exited with {server.returncode}")
                try:
                    with urllib.request.urlopen(f"http://127.0.0.1:{port}/healthz", timeout=0.25) as response:
                        if response.status == 200:
                            break
                except OSError:
                    time.sleep(0.05)
            else:
                raise TimeoutError(f"{runtime} server did not become ready")

            command = [
                "taskset", "-c", "0,1,3-7", sys.executable, str(ROOT / "benchmarks/tools/bench.py"),
                f"http://127.0.0.1:{port}", "--requests", "10000", "--warmup", "1000",
                "--concurrency", "8",
            ]
            run = subprocess.run(command, cwd=ROOT, env=env, text=True, capture_output=True, check=True)
            results["runs"].append({
                "index": index,
                "runtime": runtime,
                "requests": 10000,
                "warmup": 1000,
                "concurrency": 8,
                "rss_samples_kib": rss_samples.copy(),
                "rss_median_kib": sorted(rss_samples)[len(rss_samples) // 2],
                "rss_max_sampled_kib": max(rss_samples),
                "benchmark_output": run.stdout.strip(),
                "command": command,
            })
            print(f"[{index}] {runtime} RSS samples={len(rss_samples)} "
                  f"median={results['runs'][-1]['rss_median_kib']} KiB "
                  f"max={results['runs'][-1]['rss_max_sampled_kib']} KiB", flush=True)
            print(run.stdout.strip(), flush=True)
        finally:
            stop.set()
            sampler.join(timeout=1)
            if server.poll() is None:
                server.send_signal(signal.SIGINT)
                try:
                    server.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    server.kill()
                    server.wait()

    output_dir = new_run_dir(ROOT)
    output = output_dir / "memory-repeat-suite.json"
    output.write_text(json.dumps(results, indent=2) + "\n")
    grouped = {runtime: [run for run in results["runs"] if run["runtime"] == runtime] for runtime in ("go", "rust")}
    comparisons = []
    for key, label in (("rss_median_kib", "Median sampled RSS"), ("rss_max_sampled_kib", "Peak sampled RSS")):
        values = {runtime.title(): statistics.median(run[key] for run in runs) / 1024 for runtime, runs in grouped.items() if runs}
        comparisons.append({"label": label, "unit": "MiB", "decimals": 2, "better": "lower", "values": values})
    rows = [[run["runtime"].title(), run["index"], run["requests"], run["concurrency"], f"{run['rss_median_kib'] / 1024:.2f}", f"{run['rss_max_sampled_kib'] / 1024:.2f}", len(run["rss_samples_kib"])] for run in results["runs"]]
    html_report = write_benchmark_report(output_dir, {
        "schema_version": 1,
        "benchmark_id": "02-memory-footprint",
        "title": "Memory footprint",
        "status": "passed",
        "generated_at": results["started_utc"],
        "summary": results["protocol"],
        "decision": None,
        "summary_cards": [
            {"label": "Server runs", "value": len(results["runs"]), "note": "alternating Go/Rust order"},
            {"label": "Requests per run", "value": "10,000", "note": "plus 1,000 warmup requests"},
            {"label": "RSS sampling", "value": "5 ms", "note": "from process start to exit"},
        ],
        "sections": [
            {"title": "Memory comparison", "type": "comparison", "metrics": comparisons},
            {"title": "Individual runs", "type": "table", "columns": ["Runtime", "Run", "Requests", "Concurrency", "Median RSS (MiB)", "Peak RSS (MiB)", "Samples"], "rows": rows},
        ],
        "limitations": ["RSS is sampled from Linux procfs and can miss short-lived peaks between samples."],
    })
    print(f"saved {output} and {html_report}", flush=True)


if __name__ == "__main__":
    main()
