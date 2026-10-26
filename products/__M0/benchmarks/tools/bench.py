#!/usr/bin/env python3
"""Same standard-library request benchmark for either M0 server."""
import argparse
import csv
import concurrent.futures
import gzip
import http.client
import math
import statistics
import threading
import time
from pathlib import Path
from urllib.parse import urlsplit


def percentile(samples, p):
    ordered = sorted(samples)
    return ordered[min(len(ordered) - 1, math.ceil(p * len(ordered)) - 1)]


_worker = threading.local()


def request(endpoint):
    connection = getattr(_worker, "connection", None)
    if connection is None:
        connection = http.client.HTTPConnection(endpoint.netloc, timeout=5)
        _worker.connection = connection
    start = time.perf_counter_ns()
    try:
        connection.request("GET", endpoint.path, headers={"X-Feluka-Session": "reader:20000"})
        response = connection.getresponse()
        body = response.read()
        timing = response.getheader("Server-Timing", "")
        app_ms = float(timing.split("dur=", 1)[1]) if "dur=" in timing else float("nan")
        return (time.perf_counter_ns() - start) / 1e6, app_ms, len(body), response.status
    except (OSError, http.client.HTTPException):
        connection.close()
        _worker.connection = None
        return (time.perf_counter_ns() - start) / 1e6, float("nan"), 0, 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("base_url", help="e.g. http://127.0.0.1:38100")
    parser.add_argument("--requests", type=int, default=10_000)
    parser.add_argument("--warmup", type=int, default=1_000)
    parser.add_argument("--concurrency", type=int, default=1)
    parser.add_argument("--order-id", type=int, default=42)
    parser.add_argument("--samples-out", type=Path)
    args = parser.parse_args()
    endpoint = urlsplit(f"{args.base_url.rstrip('/')}/orders/{args.order_id}")
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.concurrency) as pool:
        list(pool.map(lambda _: request(endpoint), range(args.warmup)))
        wall_started = time.perf_counter()
        results = list(pool.map(lambda _: request(endpoint), range(args.requests)))
        wall_elapsed = time.perf_counter() - wall_started
    if args.samples_out:
        args.samples_out.parent.mkdir(parents=True, exist_ok=True)
        with gzip.open(args.samples_out, "wt", newline="") as stream:
            writer = csv.writer(stream)
            writer.writerow(("client_ms", "app_ms", "response_bytes", "status"))
            writer.writerows(results)
    client = [r[0] for r in results]
    app = [r[1] for r in results if not math.isnan(r[1])]
    statuses = {status: sum(1 for row in results if row[3] == status) for status in sorted({r[3] for r in results})}
    sizes = sorted({r[2] for r in results})
    print(f"requests={len(results)} concurrency={args.concurrency} status_counts={statuses} body_bytes={sizes}")
    for name, values in (("app_ms", app), ("client_ms", client)):
        print(f"{name}: min={min(values):.4f} avg={statistics.fmean(values):.4f} p50={percentile(values,.50):.4f} p95={percentile(values,.95):.4f} p99={percentile(values,.99):.4f} p99.9={percentile(values,.999):.4f} max={max(values):.4f}")
    print(f"client_rps={len(results)/wall_elapsed:.1f} wall_seconds={wall_elapsed:.3f}")


if __name__ == "__main__":
    main()
