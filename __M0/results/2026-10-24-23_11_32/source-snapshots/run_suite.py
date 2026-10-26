#!/usr/bin/env python3
"""Run the pinned, alternating M0 HTTP benchmark suite and save its evidence."""
import datetime
import hashlib
import json
import os
import platform
import signal
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parent
BINARIES = {
    "go": ROOT / "bin" / "feluka-m0-go",
    "rust": ROOT / "rust" / "target" / "release" / "feluka-m0-rust",
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
    for name, binary in BINARIES.items():
        if not binary.is_file():
            raise SystemExit(f"missing {name} binary: {binary}; build it using README.md")
    database = ROOT / "data" / "orders.sqlite"
    if not database.is_file():
        raise SystemExit(f"missing database: {database}; create it using seed.py")

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
        "bench.py", "run_suite.py", "seed.py", "go/main.go", "go/go.mod", "go/go.sum",
        "rust/src/main.rs", "rust/Cargo.toml", "rust/Cargo.lock",
        "bin/feluka-m0-go", "rust/target/release/feluka-m0-rust",
    ):
        results["sha256"][relative] = sha256(ROOT / relative)
    readable_log = []
    repetitions = {}
    results_dir = ROOT / "results"
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
                "taskset", "-c", "0,1,3-7", sys.executable, str(ROOT / "bench.py"), base_url,
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
    print(f"saved {results_dir / 'suite.json'} and {results_dir / 'run-log.txt'}", flush=True)


if __name__ == "__main__":
    main()
