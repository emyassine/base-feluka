#!/usr/bin/env python3
"""Recalculate the pre-registered M0 score from committed evidence files."""
import csv
import gzip
import hashlib
import json
import math
import re
import statistics
import argparse
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from results_dir import new_run_dir, write_benchmark_report


ROOT = Path(__file__).resolve().parents[2]
RESULTS = ROOT / "results/2026-10-24-23_11_32"
LANGUAGES = ("rust", "go")
WEIGHTS = {
    "target_coverage": 20,
    "port_effort_copyability": 20,
    "null_error_safety": 15,
    "http_latency": 15,
    "build_loop": 10,
    "wasm": 10,
    "operational_footprint": 10,
}


def read_result(name):
    return json.loads((RESULTS / name).read_text())


def sha256(path):
    checksum = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            checksum.update(chunk)
    return checksum.hexdigest()


def median(values):
    return statistics.median(values)


def ratio_score(best, candidate):
    """Apply the preregistered inverse-ratio formula and its zero-value rule."""
    if best == 0:
        return 100.0 if candidate == 0 else 0.0
    return 100.0 * best / candidate


def nearest_rank(values, percentile):
    return sorted(values)[math.ceil(percentile * len(values)) - 1]


def app_stat(http, language, concurrency, name):
    values = []
    for run in http["runs"]:
        if run["runtime"] != language or run["concurrency"] != concurrency:
            continue
        match = re.search(rf"\b{name}=([0-9.]+)", run["output"])
        if not match:
            raise ValueError(f"missing {name} in run output: {run['output']}")
        values.append(float(match.group(1)))
    if len(values) != 3:
        raise ValueError(f"expected 3 {language} c={concurrency} runs for {name}; got {len(values)}")
    return median(values)


def client_stats(http, language):
    runs = [run for run in http["runs"] if run["runtime"] == language and run["concurrency"] == 1]
    per_run = []
    for run in runs:
        sample_path = RESULTS / "samples" / Path(run["sample_file"]).name
        if sha256(sample_path) != run["sample_sha256"]:
            raise ValueError(f"sample hash mismatch: {run['sample_file']}")
        with gzip.open(sample_path, "rt", newline="") as handle:
            rows = list(csv.DictReader(handle))
        expected_rows = run["measured_requests"]
        if len(rows) != expected_rows or any(row["status"] != "200" for row in rows):
            raise ValueError(f"invalid status or row count in {run['sample_file']}")
        if len({row["response_bytes"] for row in rows}) != 1:
            raise ValueError(f"inconsistent response sizes in {run['sample_file']}")
        client_ms = [float(row["client_ms"]) for row in rows]
        per_run.append({
            "p50": nearest_rank(client_ms, 0.50),
            "p99": nearest_rank(client_ms, 0.99),
            "p99_9": nearest_rank(client_ms, 0.999),
        })
    if len(per_run) != 3:
        raise ValueError(f"expected 3 client c=1 runs for {language}; got {len(per_run)}")
    return {key: median([run[key] for run in per_run]) for key in ("p50", "p99", "p99_9")}


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--output-dir", type=Path, help="write recalculated score JSON into this run directory")
args = parser.parse_args()

http = read_result("suite.json")
memory = read_result("memory-repeat-suite.json")
wasm = read_result("wasm-host-final-suite.json")
builds = read_result("final-build-metrics.json")
targets = read_result("target-build-suite.json")
port_task = read_result("port-effort.json")
pocketbase_run = read_result("pocketbase-suite-run.json")

# HTTP category: the preregistered score uses the Server-Timing app duration.
app_latency = {
    language: {metric: app_stat(http, language, 1, metric) for metric in ("p50", "p99")}
    for language in LANGUAGES
}
client_latency = {language: client_stats(http, language) for language in LANGUAGES}
http_scores = {
    language: 50 * max(0, 1 - values["p50"] / 1.0)
    + 50 * max(0, 1 - values["p99"] / 5.0)
    for language, values in app_latency.items()
}

# Build results are measured three times; binary sizes come from those exact outputs.
build_ms = {
    language: {
        phase: median([run[phase]["elapsed_ms"] for run in builds[language]])
        for phase in ("clean", "noop", "edit_rebuild")
    }
    for language in LANGUAGES
}
binary_bytes = {
    language: int(median([run["clean"]["binary_bytes"] for run in builds[language]]))
    for language in LANGUAGES
}
build_scores = {
    language: statistics.mean([
        ratio_score(min(build_ms[candidate]["clean"] for candidate in LANGUAGES), build_ms[language]["clean"]),
        ratio_score(min(build_ms[candidate]["edit_rebuild"] for candidate in LANGUAGES), build_ms[language]["edit_rebuild"]),
    ])
    for language in LANGUAGES
}

# Target classes and required triples follow the locked definition in PREREGISTRATION.md.
rust_ok = {entry["target"] for entry in targets["rust"] if entry["ok"]}
go_ok = {entry["target"] for entry in targets["go"] if entry["ok"]}
tinygo_ok = {entry["target"] for entry in targets["tinygo"] if entry["ok"]}
required_targets = {
    "rust": {
        "server_linux_x86_64": ["x86_64-unknown-linux-gnu"],
        "browser_wasm": ["wasm32-unknown-unknown"],
        "desktop": ["x86_64-unknown-linux-gnu", "x86_64-pc-windows-gnu", "x86_64-apple-darwin", "aarch64-apple-darwin"],
        "mobile_android": ["aarch64-linux-android"],
        "no_std_bare_metal": ["aarch64-unknown-none", "thumbv7em-none-eabi"],
    },
    "go": {
        "server_linux_x86_64": ["linux/amd64"],
        "browser_wasm": ["js/wasm"],
        "desktop": ["linux/amd64", "windows/amd64", "darwin/amd64", "darwin/arm64"],
        "mobile_android": ["android/arm64"],
        "tinygo_mcu": ["feather-m4"],
    },
}
target_classes = {
    "rust": {
        name: all(target in rust_ok for target in required)
        for name, required in required_targets["rust"].items()
    },
    "go": {
        name: all(target in (tinygo_ok if name == "tinygo_mcu" else go_ok) for target in required)
        for name, required in required_targets["go"].items()
    },
}
target_scores = {
    language: 100 * sum(classes.values()) / len(classes)
    for language, classes in target_classes.items()
}

# Matched port measurements and source LOC are maintained as explicit evidence inputs.
effort = {"paired_elapsed_seconds_estimate": port_task["paired_elapsed_seconds_estimate"],
          "timing_method": port_task["timing_method"]}
for language in LANGUAGES:
    source_record = port_task[language]
    measured_source = source_record["implementation_source"].replace("port-effort/", "06-port-effort/")
    source_path = ROOT / "benchmarks" / measured_source
    effort[language] = {
        **source_record,
        "implementation_source": measured_source,
        "implementation_source_lines": len(source_path.read_text().splitlines()),
        "implementation_source_sha256": sha256(source_path),
    }
effort_subscores = {
    "paired_elapsed_seconds_estimate": {language: 100.0 for language in LANGUAGES},
    "implementation_source_lines": {
        language: ratio_score(min(effort[candidate]["implementation_source_lines"] for candidate in LANGUAGES), effort[language]["implementation_source_lines"])
        for language in LANGUAGES
    },
    "edit_test_iterations_to_first_green": {
        language: ratio_score(min(effort[candidate]["edit_test_iterations_to_first_green"] for candidate in LANGUAGES), effort[language]["edit_test_iterations_to_first_green"])
        for language in LANGUAGES
    },
    "unexpected_failing_test_runs": {
        language: ratio_score(min(effort[candidate]["unexpected_failing_test_runs"] for candidate in LANGUAGES), effort[language]["unexpected_failing_test_runs"])
        for language in LANGUAGES
    },
}
effort_scores = {
    language: statistics.mean([scores[language] for scores in effort_subscores.values()])
    for language in LANGUAGES
}

safety_properties = port_task["safety_properties"]
safety_scores = {
    language: 100 * sum(properties[language] for properties in safety_properties.values()) / len(safety_properties)
    for language in LANGUAGES
}

wasm_runs = {
    language: [run["result"] for run in wasm["runs"] if run["runtime"] == language]
    for language in LANGUAGES
}
wasm_p50_ns = {language: median([run["ns_per_call"]["p50"] for run in wasm_runs[language]]) for language in LANGUAGES}
wasm_correct = {
    language: bool(wasm_runs[language]) and all(
        run["host_callback_per_call"] and run["checksum"] == run["measured_calls"]
        for run in wasm_runs[language]
    )
    for language in LANGUAGES
}
wasm_scores = {
    language: ratio_score(min(wasm_p50_ns.values()), wasm_p50_ns[language])
    if wasm_correct[language] and wasm_p50_ns[language] < 100_000 else 0.0
    for language in LANGUAGES
}

rss = {
    language: {
        "median_kib": median([run["rss_median_kib"] for run in memory["runs"] if run["runtime"] == language]),
        "median_sampled_max_kib": median([run["rss_max_sampled_kib"] for run in memory["runs"] if run["runtime"] == language]),
    }
    for language in LANGUAGES
}
footprint_scores = {
    language: statistics.mean([
        ratio_score(min(binary_bytes.values()), binary_bytes[language]),
        ratio_score(min(rss[candidate]["median_kib"] for candidate in LANGUAGES), rss[language]["median_kib"]),
    ])
    for language in LANGUAGES
}

categories = {
    "target_coverage": target_scores,
    "port_effort_copyability": effort_scores,
    "null_error_safety": safety_scores,
    "http_latency": http_scores,
    "build_loop": build_scores,
    "wasm": wasm_scores,
    "operational_footprint": footprint_scores,
}
totals = {
    language: sum(WEIGHTS[category] * categories[category][language] / 100 for category in WEIGHTS)
    for language in LANGUAGES
}
evidence_files = [
    "suite.json", "memory-repeat-suite.json", "wasm-host-final-suite.json",
    "final-build-metrics.json", "target-build-suite.json", "port-effort.json",
    "pocketbase-reference.json", "pocketbase-suite-run.json",
]

artifact = {
    "preregistration": "docs/PREREGISTRATION.md (locked 2026-10-24 23:05 UTC)",
    "weights_percent": WEIGHTS,
    "category_scores_0_to_100": categories,
    "weighted_total_0_to_100": totals,
    "inputs": {
        "http_concurrency_1_median_server_ms": app_latency,
        "http_concurrency_1_median_client_request_ms": client_latency,
        "http_score_formula": "50*max(0,1-p50/1ms)+50*max(0,1-p99/5ms)",
        "build_median_ms": build_ms,
        "wasm_call_p50_ns": wasm_p50_ns,
        "binary_bytes_from_clean_build_artifacts": binary_bytes,
        "rss": rss,
        "port_effort_and_derived_source_lines": effort,
        "port_effort_subscores": effort_subscores,
        "safety_properties": safety_properties,
        "required_target_classes": target_classes,
        "target_exceptions": [
            {"target": entry["target"], "exit_code": entry["exit_code"], "stderr": entry["stderr"]}
            for entry in targets["go"] if not entry["ok"]
        ],
    },
    "evidence_sha256": {
        name: sha256(RESULTS / name)
        for name in evidence_files
    },
    "hard_gates": {
        "at_least_one_http_p50_under_1ms_and_p99_under_5ms": any(values["p50"] < 1 and values["p99"] < 5 for values in app_latency.values()),
        "client_request_p50_under_1ms_and_p99_under_5ms": any(values["p50"] < 1 and values["p99"] < 5 for values in client_latency.values()),
        "correct_wasm_call_under_100us": all(wasm_correct.values()) and all(value < 100_000 for value in wasm_p50_ns.values()),
        "shared_kernel_builds_all_required_classes": any(all(classes.values()) for classes in target_classes.values()),
        "black_box_port_suite_passes": pocketbase_run["passed"] and all(command["exit_code"] == 0 for command in pocketbase_run["commands"]),
        "build_and_iteration_metrics_recorded": all(builds[language] and effort[language]["edit_test_iterations_to_first_green"] > 0 for language in LANGUAGES),
    },
    "interpretation": "Weighted score is a decision aid. The locked rule retains Rust when it passes the required targets and black-box parity; Go is eligible only if product scope is narrowed to profiles it satisfies. Full PocketBase filter grammar and game SDK execution are outside M0 exit scope.",
}
destination = args.output_dir.resolve() if args.output_dir else new_run_dir(ROOT)
destination.mkdir(parents=True, exist_ok=True)
(destination / "m0-score.json").write_text(json.dumps(artifact, indent=2) + "\n")
gates = artifact["hard_gates"]
gates_passed = sum(bool(value) for value in gates.values())
rust_total = artifact["weighted_total_0_to_100"]["rust"]
go_total = artifact["weighted_total_0_to_100"]["go"]
categories = artifact["category_scores_0_to_100"]
inputs = artifact["inputs"]
weights = artifact["weights_percent"]

def weighted_contribution(category, language):
    return categories[category][language] * weights[category] / 100

def show_weight(category):
    return f"Weight in final score: {weights[category]}%."

http_lines = [
    "Score (0–100; higher is better). This uses median server processing time from three runs at concurrency 1, not browser/client request time.",
    "Formula: 50 × max(0, 1 − p50 / 1 ms) + 50 × max(0, 1 − p99 / 5 ms).",
]
for language in LANGUAGES:
    values = app_latency[language]
    p50_part = 50 * max(0, 1 - values["p50"] / 1.0)
    p99_part = 50 * max(0, 1 - values["p99"] / 5.0)
    http_lines.append(
        f"{language.title()}: p50 {values['p50']:.3f} ms and p99 {values['p99']:.3f} ms → "
        f"50 × {max(0, 1 - values['p50'] / 1.0):.4f} + 50 × {max(0, 1 - values['p99'] / 5.0):.4f} "
        f"= {p50_part:.2f} + {p99_part:.2f} = {http_scores[language]:.2f}/100."
    )
http_lines.append(
    f"Go scores higher on this criterion. Weighted contribution: Rust {weighted_contribution('http_latency', 'rust'):.2f} points; "
    f"Go {weighted_contribution('http_latency', 'go'):.2f} points. {show_weight('http_latency')}"
)

criterion_explanations = {
    "target_coverage": (
        "Score = required target classes passed ÷ 5 × 100. Each class counts equally; this is coverage, not a speed score.\n"
        + "\n".join(f"{language.title()}: {sum(target_classes[language].values())}/5 classes passed ({', '.join(name.replace('_', ' ') for name, passed in target_classes[language].items() if passed)})." for language in LANGUAGES)
        + f"\n{show_weight('target_coverage')}"
    ),
    "port_effort_copyability": (
        "Score is the unweighted mean of four subscores: paired elapsed-time estimate, source lines, edit/test iterations to first green, and unexpected failing test runs. For the last three, fewer is better and the score is 100 × best observed value ÷ candidate value. Both languages receive 100 for elapsed time because they were implemented in one paired task and cannot be timed separately.\n"
        + "\n".join(
            f"{language.title()}: {effort[language]['implementation_source_lines']} source lines (subscore {effort_subscores['implementation_source_lines'][language]:.2f}), "
            f"{effort[language]['edit_test_iterations_to_first_green']} iteration(s) (subscore {effort_subscores['edit_test_iterations_to_first_green'][language]:.2f}), "
            f"{effort[language]['unexpected_failing_test_runs']} unexpected failing run(s) (subscore {effort_subscores['unexpected_failing_test_runs'][language]:.2f}); "
            f"mean = {effort_scores[language]:.2f}/100."
            for language in LANGUAGES
        )
        + f"\n{show_weight('port_effort_copyability')}"
    ),
    "null_error_safety": (
        "Score = properties passed ÷ 5 × 100. The five checks cover explicit missing-value handling, whether the compiler forces that handling, explicit parser errors, whether the compiler forces error handling, and fail-closed behavior for invalid rules.\n"
        + "Both languages pass 3/5: they represent missing values and parser errors explicitly and reject malformed/unknown rules, but neither compiler forces callers to handle missing values or parser errors. That is 3 ÷ 5 × 100 = 60/100 for each.\n"
        + show_weight('null_error_safety')
    ),
    "http_latency": "\n".join(http_lines),
    "build_loop": (
        "Score is the mean of two inverse-ratio scores: clean build and source-edit rebuild. For each, score = 100 × fastest measured time ÷ this language’s time; lower build time is better. No-op build time was measured but is not included in this score.\n"
        + "\n".join(
            f"{language.title()}: clean {build_ms[language]['clean'] / 1000:.2f} s (subscore {ratio_score(min(build_ms[c]['clean'] for c in LANGUAGES), build_ms[language]['clean']):.2f}); "
            f"edit rebuild {build_ms[language]['edit_rebuild'] / 1000:.2f} s (subscore {ratio_score(min(build_ms[c]['edit_rebuild'] for c in LANGUAGES), build_ms[language]['edit_rebuild']):.2f}); "
            f"mean = {build_scores[language]:.2f}/100."
            for language in LANGUAGES
        )
        + f"\n{show_weight('build_loop')}"
    ),
    "wasm": (
        "Score = 100 × fastest p50 callback time ÷ this language’s p50 callback time. Lower time is better; the values below are nanoseconds per call. Both implementations also passed the correctness check.\n"
        + "\n".join(f"{language.title()}: {wasm_p50_ns[language]:,.1f} ns/call → {wasm_scores[language]:.2f}/100." for language in LANGUAGES)
        + f"\n{show_weight('wasm')}"
    ),
    "operational_footprint": (
        "Score is the mean of two inverse-ratio scores: release binary size and median sampled resident memory (RSS). For each, score = 100 × smallest measured value ÷ this language’s value; smaller is better. RSS is process memory, not total host memory.\n"
        + "\n".join(
            f"{language.title()}: binary {binary_bytes[language]:,} bytes (subscore {ratio_score(min(binary_bytes.values()), binary_bytes[language]):.2f}); "
            f"median RSS {rss[language]['median_kib']:,} KiB (subscore {ratio_score(min(rss[c]['median_kib'] for c in LANGUAGES), rss[language]['median_kib']):.2f}); "
            f"mean = {footprint_scores[language]:.2f}/100."
            for language in LANGUAGES
        )
        + f"\n{show_weight('operational_footprint')}"
    ),
}
criterion_labels = {
    "target_coverage": "Target coverage",
    "port_effort_copyability": "Porting effort and copyability",
    "null_error_safety": "Missing-value and error safety",
    "http_latency": "HTTP latency",
    "build_loop": "Build loop",
    "wasm": "WASM callback",
    "operational_footprint": "Runtime footprint",
}
criterion_metrics = [
    {
        "label": criterion_labels[name],
        "weight": weights[name],
        "weight_explanation": (
            f"Why {weights[name]}%? The M0 preregistration assigned this share before the final measurements, "
            f"so this criterion can add at most {weights[name]} of the total 100 points. Its contribution is "
            f"category score × {weights[name]} ÷ 100. The preregistration records the chosen weight but does not "
            "give a separate rationale for its relative size compared with the other criteria; this report preserves "
            "the fixed choice rather than inventing a post-hoc reason. See docs/PREREGISTRATION.md."
        ),
        "unit": "/100",
        "better": "higher",
        "values": {"Rust": values["rust"], "Go": values["go"]},
        "explanation": criterion_explanations[name],
    }
    for name, values in categories.items()
]
gate_rows = [[name.replace("_", " ").title(), "Passed" if value else "Failed"] for name, value in gates.items()]
decision_detail = (
    f"Rust is selected by the locked M0 rule: it passes the required target and black-box parity gates and scores "
    f"{rust_total:.2f}/100 versus Go at {go_total:.2f}/100, a {rust_total - go_total:.2f}-point lead. "
    "Go is faster in this HTTP workload and in clean builds. The result applies to the tested Feluka scope and does not certify a complete production application."
    if gates_passed == len(gates) and rust_total >= go_total
    else f"The locked decision gates are not all met ({gates_passed}/{len(gates)} passed); this score does not select a host language."
)
html_report = write_benchmark_report(destination, {
    "schema_version": 1,
    "benchmark_id": "09-language-decision",
    "title": "M0 language decision",
    "status": "passed" if gates_passed == len(gates) else "incomplete",
    "summary": "This report applies the decision rule registered before benchmarking. Hard gates determine eligibility; weighted scores rank eligible candidates.",
    "decision": {"title": "Decision: Rust" if gates_passed == len(gates) and rust_total >= go_total else "Decision: No selection", "tone": "success" if gates_passed == len(gates) and rust_total >= go_total else "warning", "detail": decision_detail},
    "summary_cards": [
        {"label": "Selected language", "value": "Rust" if gates_passed == len(gates) and rust_total >= go_total else "No selection", "note": "locked M0 decision rule"},
        {"label": "Rust score", "value": f"{rust_total:.2f} / 100", "note": "weighted total"},
        {"label": "Go score", "value": f"{go_total:.2f} / 100", "note": "weighted total"},
        {"label": "Hard gates", "value": f"{gates_passed} / {len(gates)}", "note": "all required gates must pass"},
    ],
    "sections": [
        {"title": "Weighted score", "type": "comparison", "description": "Each category score is multiplied by its registered weight, then added to produce the final score out of 100.", "metrics": [{"label": "Overall", "unit": "/100", "better": "higher", "values": {"Rust": rust_total, "Go": go_total}, "explanation": "Weighted total = sum(category score × category weight). The weights were fixed before the final measurement runs; see the score-by-criterion section for each measured input and calculation."}]},
        {"title": "Score by criterion", "type": "comparison", "description": "Each row shows a category score out of 100 and its separate weight in the final score. Hover or focus a category name for the measured inputs and exact scoring rule. These scores do not override a failed hard gate.", "metrics": criterion_metrics},
        {"title": "Prerequisite gates", "type": "checks", "description": "These are pass/fail requirements set before the measurements. Every required gate must pass before the score can select a language.", "columns": ["Gate", "Result"], "rows": gate_rows},
        {"title": "Scope and limits", "type": "text", "text": "The result covers the measured M0 scenario and frozen record-rule subset. It does not claim full PocketBase filter compatibility or certify production performance for a complete application."},
    ],
    "limitations": ["The result applies to the preregistered M0 scope and its measured workloads."],
})
print(f"HTML report: {html_report}")
print(json.dumps(artifact, indent=2))
