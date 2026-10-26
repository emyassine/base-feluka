#!/usr/bin/env python3
"""Check the versioned benchmark report contract and generic HTML output."""
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "benchmarks/tools"))
from results_dir import write_benchmark_report


def main():
    with tempfile.TemporaryDirectory(prefix="feluka-report-smoke-") as temp:
        run_dir = Path(temp) / "results" / "2026-01-02-03_04_05"
        report = {
            "schema_version": 1,
            "benchmark_id": "01-http-performance",
            "title": "Generic renderer check",
            "status": "passed",
            "summary": "A synthetic result validates the reusable presentation contract.",
            "decision": {"title": "Illustrative outcome", "detail": "Synthetic only.", "tone": "primary"},
            "summary_cards": [{"label": "Runs", "value": 2, "note": "one per language"}],
            "sections": [
                {"title": "Latency", "type": "comparison", "metrics": [{"label": "p50", "weight": 15, "weight_explanation": "It contributes 15 points at most to the total.", "unit": "ms", "better": "lower", "values": {"Go": 0.21, "Rust": 0.28}, "explanation": "Uses measured request samples; lower is faster."}]},
                {"title": "Checks", "type": "checks", "columns": ["Language", "Status"], "rows": [["Go", "Passed"], ["Rust", "Failed"]]},
            ],
            "limitations": [],
        }
        path = write_benchmark_report(run_dir, report)
        html = path.read_text()
        expected = ("Illustrative outcome", "Latency", "0.21", "badge success", "badge danger", "Run artifacts", "Audit data", "Read across each row to compare implementations", ".grid{display:grid;grid-template-columns:1fr", "Read across each row to compare implementations", 'Weight<span class=\"tooltip-mark\"', "15%", "Why 15 percent weight", "It contributes 15 points at most to the total.", "data-tooltip=\"Uses measured request samples; lower is faster.", "metric-tooltip", ".artifacts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))")
        missing = [item for item in expected if item not in html]
        if missing or "<aside" in html or "avatar" in html or ".bar-fill" in html or "class=\"chart\"" in html:
            raise SystemExit(f"generic report smoke test failed; missing={missing}")
        print("Generic report contract and presentation passed.")


if __name__ == "__main__":
    main()
