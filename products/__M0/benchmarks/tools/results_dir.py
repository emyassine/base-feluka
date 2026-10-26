"""Timestamped result directory helpers shared by M0 measurement runners."""
from datetime import datetime
import html
import json
import re
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def new_run_dir(root: Path, group: str | None = None) -> Path:
    """Create results/YYYY-MM-DD-HH_MM_SS[/group], unique to the second."""
    base = root / "results"
    stamp = datetime.now().astimezone().strftime("%Y-%m-%d-%H_%M_%S")
    path = base / stamp
    suffix = 1
    while path.exists():
        path = base / f"{stamp}-{suffix:02d}"
        suffix += 1
    if group:
        path = path / group
    path.mkdir(parents=True)
    return path


def write_html_report(run_dir: Path, title: str | None = None) -> Path:
    """Write a presentation-style, self-contained report beside a timestamped run."""
    run_dir = run_dir.resolve()
    standard_report = run_dir / "benchmark-report.json"
    if standard_report.is_file():
        from benchmark_html import render_report

        return render_report(run_dir, json.loads(standard_report.read_text()))
    stamp = run_dir.name
    result_root = run_dir.parent
    report_path = result_root / f"{stamp}.html"
    title = title or f"Feluka M0 results — {stamp}"
    files = sorted(path for path in run_dir.rglob("*") if path.is_file())
    json_data = {}
    for path in files:
        if path.suffix.lower() == ".json":
            try:
                json_data[path.name] = json.loads(path.read_text())
            except (UnicodeDecodeError, json.JSONDecodeError):
                pass

    def esc(value):
        return html.escape(str(value))

    def card(label, value, note=""):
        return (f'<article class="stat-card"><div class="stat-label">{esc(label)}</div>'
                f'<div class="stat-value">{esc(value)}</div><div class="stat-note">{esc(note)}</div></article>')

    def table(headers, rows):
        head = "".join(f"<th>{esc(item)}</th>" for item in headers)
        body = "".join("<tr>" + "".join(f"<td>{esc(value)}</td>" for value in row) + "</tr>" for row in rows)
        return f'<div class="table-wrap"><table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table></div>'

    def bar_chart(title_text, items, suffix=""):
        if not items:
            return ""
        maximum = max(float(value) for _, value in items) or 1
        bars = "".join(
            f'<div class="bar-row"><div class="bar-name">{esc(name)}</div>'
            f'<div class="bar-track"><div class="bar-fill" style="width:{max(2, float(value) / maximum * 100):.2f}%"></div></div>'
            f'<div class="bar-number">{esc(f"{value:g}{suffix}")}</div></div>'
            for name, value in items
        )
        return f'<section class="panel"><div class="panel-head"><div><div class="eyebrow">COMPARISON</div><h2>{esc(title_text)}</h2></div></div>{bars}</section>'

    panels = []
    stats = []
    summary_text = "Run artifacts and measurements"
    score = json_data.get("m0-score.json")
    if score:
        totals = score.get("weighted_total_0_to_100", {})
        rust_score, go_score = totals.get("rust"), totals.get("go")
        stats.extend([card("Rust score", f"{rust_score:.2f}" if isinstance(rust_score, (int, float)) else "—", "out of 100"),
                      card("Go score", f"{go_score:.2f}" if isinstance(go_score, (int, float)) else "—", "out of 100"),
                      card("Scoring criteria", len(score.get("category_scores_0_to_100", {})), "weighted categories")])
        categories = score.get("category_scores_0_to_100", {})
        if categories:
            rows = [(name.replace("_", " ").title(), f'{values.get("rust", 0):.1f}', f'{values.get("go", 0):.1f}') for name, values in categories.items()]
            panels.append('<section class="panel"><div class="eyebrow">DECISION SCORE</div><h2>Category breakdown</h2>' + table(["Category", "Rust", "Go"], rows) + "</section>")
            panels.append(bar_chart("Weighted score by language", [("Rust", rust_score or 0), ("Go", go_score or 0)], "/100"))
            summary_text = "Pre-registered comparison score"

    run = json_data.get("run.json")
    if run:
        commands = run.get("commands", [])
        passed = sum(command.get("exit_code") == 0 for command in commands)
        failed = len(commands) - passed
        elapsed = run.get("elapsed_seconds", 0)
        stats.extend([card("Checks passed", f"{passed} / {len(commands)}", "portable checks"),
                      card("Failures", failed, "" if failed else "all checks passed"),
                      card("Duration", f"{elapsed:.1f} s" if isinstance(elapsed, (int, float)) else elapsed, "total runtime")])
        panels.append('<section class="panel"><div class="eyebrow">CHECKS</div><h2>Execution summary</h2>' + table(
            ["Check", "Status", "Duration", "Log"],
            [(item.get("name", ""), "Passed" if item.get("exit_code") == 0 else "Failed", f'{item.get("elapsed_seconds", 0):g} s', item.get("log", "")) for item in commands]
        ) + "</section>")
        summary_text = f'{run.get("status", "completed").title()} · {passed} of {len(commands)} checks passed'

    suite = json_data.get("suite.json")
    if suite and isinstance(suite.get("runs"), list):
        runs = suite["runs"]
        def find_metric(output, metric, key):
            match = re.search(rf"{metric}:.*?\b{key}=([0-9.]+)", output)
            return float(match.group(1)) if match else None
        groups = {}
        for item in runs:
            runtime = item.get("runtime", "unknown")
            concurrency = item.get("concurrency", "?")
            output = item.get("output", "")
            group_key = (runtime, concurrency)
            bucket = groups.setdefault(group_key, {"app": [], "client": []})
            for metric, target in (("app_ms", "app"), ("client_ms", "client")):
                value = find_metric(output, metric, "p50")
                if value is not None:
                    bucket[target].append(value)
        rows = []
        for (runtime, concurrency), bucket in sorted(groups.items(), key=lambda item: (item[0][1], item[0][0])):
            app = statistics.median(bucket["app"]) if bucket["app"] else None
            client = statistics.median(bucket["client"]) if bucket["client"] else None
            rows.append((runtime.title(), concurrency, f"{app:.3f} ms" if app is not None else "—", f"{client:.3f} ms" if client is not None else "—"))
        if rows:
            request_count = sum(item.get("measured_requests", 0) for item in runs)
            stats.extend([card("HTTP runs", len(runs), f"{request_count:,} measured requests"), card("Runtimes", len({item.get('runtime') for item in runs}), "Go and Rust")])
            panels.append('<section class="panel"><div class="eyebrow">HTTP LATENCY</div><h2>Median response time</h2>' + table(["Runtime", "Concurrency", "App p50", "Client p50"], rows) + "</section>")
            base = [((runtime.title() + f" · c={concurrency}"), statistics.median(bucket["app"])) for (runtime, concurrency), bucket in groups.items() if bucket["app"]]
            panels.append(bar_chart("Application p50 latency", base, " ms"))
            summary_text = "HTTP performance measurements"

    memory = json_data.get("memory-repeat-suite.json")
    if memory:
        groups = {}
        for item in memory.get("runs", []):
            groups.setdefault(item.get("runtime", "unknown"), []).append(item)
        rows = []
        chart = []
        for runtime, items in sorted(groups.items()):
            median_rss = statistics.median(item.get("rss_median_kib", 0) for item in items)
            maximum_rss = max(item.get("rss_max_sampled_kib", 0) for item in items)
            rows.append((runtime.title(), len(items), f"{median_rss / 1024:.2f} MiB", f"{maximum_rss / 1024:.2f} MiB"))
            chart.append((runtime.title(), median_rss / 1024))
        stats.append(card("RSS samples", len(memory.get("runs", [])), "alternating server runs"))
        panels.append('<section class="panel"><div class="eyebrow">MEMORY</div><h2>Resident memory</h2>' + table(["Runtime", "Runs", "Median RSS", "Peak sampled RSS"], rows) + "</section>")
        panels.append(bar_chart("Median RSS by runtime", chart, " MiB"))
        summary_text = "Memory footprint measurements"

    builds = json_data.get("final-build-metrics.json")
    if builds:
        rows, chart = [], []
        for runtime in ("rust", "go"):
            items = builds.get(runtime, [])
            if not items:
                continue
            clean = statistics.median(item["clean"]["elapsed_ms"] for item in items) / 1000
            noop = statistics.median(item["noop"]["elapsed_ms"] for item in items) / 1000
            edit = statistics.median(item["edit_rebuild"]["elapsed_ms"] for item in items) / 1000
            rows.append((runtime.title(), len(items), f"{clean:.2f} s", f"{noop:.2f} s", f"{edit:.2f} s"))
            chart.append((runtime.title() + " clean", clean))
        stats.append(card("Build repetitions", sum(len(builds.get(runtime, [])) for runtime in ("rust", "go")), "per runtime and build type"))
        panels.append('<section class="panel"><div class="eyebrow">BUILD TIME</div><h2>Median build duration</h2>' + table(["Runtime", "Repetitions", "Clean", "No-op", "Edited source"], rows) + "</section>")
        panels.append(bar_chart("Clean build duration", chart, " s"))
        summary_text = "Compiler and rebuild measurements"

    wasm = json_data.get("wasm-host-final-suite.json")
    if wasm:
        groups = {}
        for item in wasm.get("runs", []):
            p50 = item.get("result", {}).get("ns_per_call", {}).get("p50")
            if p50 is not None:
                groups.setdefault(item.get("runtime", "unknown"), []).append(p50)
        if groups:
            rows = [(runtime.title(), len(values), f"{statistics.median(values):,.1f} ns", f"{statistics.median(values) / 1000:.3f} µs") for runtime, values in sorted(groups.items())]
            chart = [(runtime.title(), statistics.median(values)) for runtime, values in groups.items()]
            stats.append(card("Measured calls", f'{sum(item.get("result", {}).get("measured_calls", 0) for item in wasm.get("runs", [])):,}', "across all host runs"))
            panels.append('<section class="panel"><div class="eyebrow">WASM HOST CALLS</div><h2>Median call latency</h2>' + table(["Runtime", "Runs", "p50", "p50 in microseconds"], rows) + "</section>")
            panels.append(bar_chart("Host callback p50", chart, " ns"))
            summary_text = "WASM host-call performance"

    targets = json_data.get("target-build-suite.json")
    if targets:
        rows = []
        chart = []
        for runtime in ("rust", "go", "tinygo"):
            items = targets.get(runtime, [])
            good = sum(item.get("ok", item.get("exit_code") == 0) for item in items)
            if items:
                rows.append((runtime.upper() if runtime == "tinygo" else runtime.title(), good, len(items), f"{good / len(items) * 100:.0f}%"))
                chart.append((runtime, good / len(items) * 100))
        stats.append(card("Target checks", f"{sum(row[1] for row in rows)} / {sum(row[2] for row in rows)}", "successful builds"))
        panels.append('<section class="panel"><div class="eyebrow">PORTABILITY</div><h2>Build matrix</h2>' + table(["Toolchain", "Passed", "Targets", "Success rate"], rows) + "</section>")
        panels.append(bar_chart("Target success rate", chart, "%"))
        summary_text = "Cross-target build coverage"

    pocketbase = json_data.get("pocketbase-suite-run.json")
    if pocketbase:
        commands = pocketbase.get("commands", [])
        good = sum(item.get("exit_code") == 0 for item in commands)
        stats.extend([card("Compatibility checks", f"{good} / {len(commands)}", "PocketBase oracle and ports"), card("Result", "Passed" if pocketbase.get("passed") else "Failed", "compatibility suite")])
        panels.append('<section class="panel"><div class="eyebrow">COMPATIBILITY</div><h2>PocketBase differential checks</h2>' + table(["Command", "Status", "Working directory"], [(" ".join(item.get("command", [])), "Passed" if item.get("exit_code") == 0 else "Failed", item.get("cwd", "")) for item in commands]) + "</section>")
        summary_text = "PocketBase compatibility results"

    if not stats:
        stats = [card("Files", len(files), "run artifacts"), card("JSON reports", len(json_data), "measurement summaries")]
    if score and not run:
        summary_text = "Reference campaign · HTTP, build, memory, WASM, targets and compatibility evidence"

    status = "Complete"
    status_class = "complete"
    if run:
        status = run.get("status", "complete").title()
        status_class = "failed" if run.get("status") == "failed" else "complete"
    elif pocketbase:
        status = "Passed" if pocketbase.get("passed") else "Failed"
        status_class = "complete" if pocketbase.get("passed") else "failed"

    decision_html = ""
    if score:
        gates = score.get("hard_gates", {})
        rust_score = score.get("weighted_total_0_to_100", {}).get("rust", 0)
        go_score = score.get("weighted_total_0_to_100", {}).get("go", 0)
        gate_count = sum(bool(value) for value in gates.values())
        decision_passed = bool(gates) and gate_count == len(gates)
        decision_name = "Rust" if decision_passed and rust_score >= go_score else "No selection"
        if decision_name == "Rust":
            rationale = (f"Rust is selected by the preregistered rule: it passes the required target and parity gates, "
                         f"and scores {rust_score:.2f}/100 versus Go at {go_score:.2f}/100 "
                         f"(a {rust_score - go_score:.2f}-point lead). Go is faster on this HTTP workload and clean build. "
                         "This decides the M0 host-language comparison; it does not certify a complete production application.")
        else:
            rationale = f"The required gates are not all satisfied ({gate_count}/{len(gates)} passed); the preregistered rule does not select a language."
        decision_html = (f'<section class="decision"><div class="decision-top"><div><div class="eyebrow">PREREGISTERED OUTCOME</div>'
                         f'<h2>Decision: {esc(decision_name)}</h2></div><span class="fi-badge {"success" if decision_passed else "warning"}">{"Selected" if decision_passed else "Review required"}</span></div>'
                         f'<p>{esc(rationale)}</p><div class="decision-foot">Hard gates: {gate_count} of {len(gates)} passed · Weighted score: Rust {rust_score:.2f} / Go {go_score:.2f}</div></section>')

    artifact_tiles = []
    technical = []
    for path in files:
        relative = path.relative_to(run_dir).as_posix()
        link = f"{html.escape(stamp)}/{html.escape(relative)}"
        size = path.stat().st_size
        artifact_tiles.append(f'<a class="artifact" href="{link}" download><span class="file-mark">{esc(path.suffix[1:].upper() or "FILE")}</span><span><strong>{esc(relative)}</strong><small>{size:,} bytes</small></span><span class="download">↗</span></a>')
        if path.suffix.lower() == ".json":
            try:
                body = html.escape(json.dumps(json.loads(path.read_text()), indent=2, ensure_ascii=False))
            except (UnicodeDecodeError, json.JSONDecodeError):
                body = html.escape(path.read_text(errors="replace"))
            technical.append(f'<details><summary>{esc(relative)} <a href="{link}" download>download raw JSON</a></summary><pre>{body}</pre></details>')
        elif path.suffix.lower() in {".log", ".txt"}:
            body = html.escape(path.read_text(errors="replace"))
            technical.append(f'<details><summary>{esc(relative)} <a href="{link}" download>download</a></summary><pre>{body}</pre></details>')

    section_panels = "".join(panels) or '<section class="panel empty"><h2>No measurements to summarize yet</h2><p>Download the run artifacts below to inspect this result.</p></section>'
    artifact_html = "".join(artifact_tiles) or '<p class="muted">No files were produced.</p>'
    technical_html = "".join(technical) or '<p class="muted">This run has no inline JSON or log files.</p>'
    cards_html = "".join(stats)
    document = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title><style>
:root{{--page:#f3f4f6;--surface:#fff;--surface-soft:#f9fafb;--ink:#111827;--muted:#6b7280;--line:#e5e7eb;--brand:#4f46e5;--brand-soft:#eef2ff;--green:#15803d;--red:#b91c1c;--shadow:0 1px 3px #10182812,0 1px 2px #1018280a}}
*{{box-sizing:border-box}}html{{scroll-behavior:smooth}}body{{margin:0;background:var(--page);color:var(--ink);font:14px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}}
a{{color:inherit;text-decoration:none}}.layout{{min-height:100vh}}.content{{min-height:100vh}}.topbar{{height:58px;background:#ffffffd9;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 max(24px,calc((100vw - 1440px)/2 + 34px));position:sticky;top:0;z-index:1;backdrop-filter:blur(12px)}}
.crumbs{{color:var(--muted);font-size:13px;-webkit-user-select:none;user-select:none}}.crumbs .brand-prefix{{color:#9ca3af;font-weight:400}}.crumbs b{{color:#374151;font-weight:700}}.top-right{{display:flex;align-items:center;gap:12px;color:var(--muted);font-size:12px}}
main{{max-width:1440px;margin:0 auto;padding:30px 34px 56px}}.page-head{{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:24px}}.eyebrow{{color:var(--muted);font-size:10px;font-weight:750;letter-spacing:.11em;text-transform:uppercase}}h1{{margin:4px 0 5px;font-size:25px;line-height:1.2;letter-spacing:-.035em}}.subtitle{{color:var(--muted);margin:0}}.head-actions{{display:flex;gap:9px;align-items:center}}.button{{border:1px solid var(--line);border-radius:7px;background:var(--surface);padding:8px 12px;font-size:12px;font-weight:650;box-shadow:var(--shadow)}}
.fi-badge{{display:inline-flex;min-width:24px;align-items:center;justify-content:center;gap:4px;border-radius:6px;padding:3px 8px;font-size:12px;line-height:1.4;font-weight:500;white-space:nowrap;background:#f9fafb;color:#4b5563;box-shadow:inset 0 0 0 1px #6b72801a;-webkit-user-select:none;user-select:none}}.fi-badge.success{{background:#f0fdf4;color:#15803d;box-shadow:inset 0 0 0 1px #16a34a26}}.fi-badge.warning{{background:#fffbeb;color:#b45309;box-shadow:inset 0 0 0 1px #d9770626}}.fi-badge.danger{{background:#fef2f2;color:#b91c1c;box-shadow:inset 0 0 0 1px #dc262626}}.fi-badge.primary{{background:#eef2ff;color:#4338ca;box-shadow:inset 0 0 0 1px #4f46e526}}.run-pill{{display:inline-flex;align-items:center;gap:5px;border-radius:6px;padding:3px 8px;font-size:12px;line-height:1.4;font-weight:500;white-space:nowrap;background:#f0fdf4;color:#15803d;box-shadow:inset 0 0 0 1px #16a34a26;-webkit-user-select:none;user-select:none}}.run-pill.failed{{background:#fef2f2;color:#b91c1c;box-shadow:inset 0 0 0 1px #dc262626}}.stats{{display:grid;grid-template-columns:1fr;gap:10px;margin:0 0 22px}}.stat-card,.panel{{background:var(--surface);border:1px solid var(--line);border-radius:9px;box-shadow:var(--shadow)}}.stat-card{{padding:17px 18px;min-height:111px}}.stat-label{{font-size:12px;color:var(--muted);font-weight:550}}.stat-value{{font-size:25px;font-weight:720;letter-spacing:-.04em;margin:5px 0 1px}}.stat-note{{font-size:11px;color:#9ca3af}}
.decision{{border:1px solid #d1fae5;border-left:4px solid #10b981;background:#fff;border-radius:8px;padding:19px 21px;margin:0 0 22px;box-shadow:var(--shadow)}}.decision-top{{display:flex;justify-content:space-between;align-items:center;gap:14px}}.decision h2{{font-size:19px;letter-spacing:-.025em;margin:2px 0 0}}.decision p{{font-size:13px;color:#4b5563;max-width:1000px;margin:13px 0 10px}}.decision-foot{{border-top:1px solid #ecfdf5;padding-top:9px;color:#6b7280;font-size:11px;font-variant-numeric:tabular-nums}}
.panel-grid{{display:grid;grid-template-columns:1fr;gap:17px;align-items:start}}.panel{{padding:20px;min-width:0}}.panel h2{{font-size:16px;letter-spacing:-.02em;margin:3px 0 16px}}.panel-head{{display:flex;justify-content:space-between;align-items:flex-start}}.table-wrap{{overflow:auto}}table{{width:100%;border-collapse:collapse;text-align:left;font-size:12px}}th{{background:var(--surface-soft);color:#6b7280;font-size:10px;letter-spacing:.06em;text-transform:uppercase;font-weight:700}}td,th{{padding:10px 11px;border-bottom:1px solid #f0f1f3;white-space:nowrap}}tbody tr:last-child td{{border-bottom:0}}tbody tr:hover{{background:#fafafa}}.bar-row{{display:grid;grid-template-columns:minmax(90px,150px) 1fr minmax(70px,100px);gap:12px;align-items:center;margin:15px 0}}.bar-name,.bar-number{{font-size:12px;color:#4b5563}}.bar-number{{text-align:right;font-variant-numeric:tabular-nums;font-weight:650}}.bar-track{{height:9px;background:#eef0f4;border-radius:99px;overflow:hidden}}.bar-fill{{height:100%;border-radius:99px;background:linear-gradient(90deg,#818cf8,#4f46e5)}}.full{{grid-column:1/-1}}.artifact-grid{{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}}.artifact{{display:flex;align-items:center;gap:11px;border:1px solid var(--line);border-radius:7px;padding:11px;background:#fff;min-width:0}}.artifact:hover{{border-color:#a5b4fc;background:#fafaff}}.file-mark{{display:grid;place-items:center;width:32px;height:36px;border-radius:5px;background:var(--brand-soft);color:var(--brand);font-size:8px;font-weight:800;flex:none;-webkit-user-select:none;user-select:none}}.artifact strong,.artifact small{{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}.artifact strong{{font-size:11px}}.artifact small{{color:#9ca3af;font-size:10px;margin-top:2px}}.download{{margin-left:auto;color:var(--brand);font-size:17px}}.audit details{{border:1px solid var(--line);border-radius:7px;background:#fff;margin:8px 0;padding:12px 14px}}.audit summary{{cursor:pointer;color:#374151;font-weight:650;font-size:12px}}.audit summary a{{float:right;color:var(--brand);font-size:11px;font-weight:500}}pre{{max-height:560px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;background:#111827;color:#e5e7eb;border-radius:7px;padding:15px;font:11px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace}}.muted{{color:var(--muted)}}.section-title{{font-size:16px;margin:28px 0 12px;letter-spacing:-.02em}}.footer{{border-top:1px solid var(--line);margin-top:30px;padding-top:14px;color:#9ca3af;font-size:11px;display:flex;justify-content:space-between}}
@media(max-width:1000px){{main{{padding:24px}}.artifact-grid{{grid-template-columns:repeat(2,minmax(0,1fr))}}.full{{grid-column:auto}}}}@media(max-width:700px){{.artifact-grid{{grid-template-columns:1fr}}.topbar{{height:48px;padding:0 16px}}main{{padding:20px 15px 40px}}.page-head{{display:block}}.head-actions{{margin-top:14px}}.stats{{grid-template-columns:1fr;gap:9px}}.stat-card{{padding:13px;min-height:96px}}.stat-value{{font-size:21px}}.bar-row{{grid-template-columns:85px 1fr 75px;gap:8px}}}}
</style></head><body><div class="layout"><div class="content"><div class="topbar"><div class="crumbs"><span class="brand-prefix">Feluka-M0/</span><b>Benchmarks</b></div><div class="top-right">{html.escape(stamp)}</div></div>
<main id="overview"><div class="page-head"><div><div class="eyebrow">BENCHMARK RUN · {len(files)} FILES</div><h1>{html.escape(title)}</h1><p class="subtitle">{html.escape(summary_text)} · {html.escape(stamp)}</p></div><div class="head-actions"><span class="run-pill {status_class}">● &nbsp;{html.escape(status)}</span><a class="button" href="{html.escape(stamp)}/">Open result files ↗</a></div></div>
<section class="stats">{cards_html}</section>{decision_html}<h2 class="section-title" id="measurements">Measurements</h2><div class="panel-grid">{section_panels}</div>
<section id="artifacts"><h2 class="section-title">Run artifacts</h2><div class="artifact-grid">{artifact_html}</div></section>
<section id="audit" class="audit"><h2 class="section-title">Technical details</h2><p class="muted">Raw JSON and logs used for this presentation. Expand a file to inspect it inline, or download it from the artifact list.</p>{technical_html}</section>
<div class="footer"><span>Feluka M0 · report generated from this run’s evidence</span><span>Raw data is preserved alongside this report</span></div></main></div></div></body></html>"""
    report_path.write_text(document, encoding="utf-8")
    return report_path


def write_benchmark_report(run_dir: Path, report: dict) -> Path:
    """Save the stable presentation contract and render it with the generic template."""
    required = {"schema_version", "benchmark_id", "title", "status", "summary_cards", "sections"}
    missing = required.difference(report)
    if missing:
        raise ValueError(f"benchmark report is missing required fields: {', '.join(sorted(missing))}")
    if report["schema_version"] != 1:
        raise ValueError("unsupported benchmark report schema version")
    descriptor_path = next((ROOT / "benchmarks").glob(f"{report['benchmark_id']}/benchmark.json"), None)
    if descriptor_path is None:
        raise ValueError(f"no benchmark descriptor found for {report['benchmark_id']!r}")
    descriptor = json.loads(descriptor_path.read_text())
    report.setdefault("title", descriptor["title"])
    run_dir.mkdir(parents=True, exist_ok=True)
    report_path = run_dir / "benchmark-report.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    from benchmark_html import render_report

    return render_report(run_dir, report)
