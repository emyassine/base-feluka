"""Generic renderer for the versioned Feluka benchmark report format."""
import html
import json
from pathlib import Path


def render_report(run_dir: Path, report: dict) -> Path:
    run_dir = run_dir.resolve()
    stamp = run_dir.name
    output = run_dir.parent / f"{stamp}.html"

    def esc(value):
        return html.escape(str(value))

    def cell(value):
        if isinstance(value, str):
            tone = {"passed": "success", "failed": "danger", "incomplete": "warning", "selected": "success", "review required": "warning"}.get(value.lower())
            if tone:
                return f'<span class="badge {tone}">{esc(value)}</span>'
        return esc(value)

    def fmt_metric(value, metric):
        if isinstance(value, bool):
            return esc(value)
        if isinstance(value, int):
            return f"{value:,}"
        if isinstance(value, float):
            decimals = int(metric.get("decimals", 2))
            return f"{value:,.{decimals}f}"
        return esc(value)

    cards = "".join(
        f'<article class="stat"><div>{esc(item.get("label", "Metric"))}</div>'
        f'<strong>{esc(item.get("value", "—"))}</strong><small>{esc(item.get("note", ""))}</small></article>'
        for item in report.get("summary_cards", [])
    )
    decision = report.get("decision")
    decision_html = ""
    if decision:
        tone = decision.get("tone", "primary")
        decision_html = (
            f'<section class="decision"><div class="decision-head"><h2>{esc(decision.get("title", "Decision"))}</h2>'
            f'<span class="badge {esc(tone)}">{esc(tone.title())}</span></div>'
            f'<p>{esc(decision.get("detail", ""))}</p></section>'
        )

    section_guides = {
        "comparison": "Read across each row to compare implementations. The unit is shown below the metric name. The highlighted value is best according to the metric rule (lower or higher); a tie can highlight more than one implementation.",
        "table": "Each row is one recorded result. Read the column headings first; units and status meanings are included in the headings or values.",
        "checks": "Each row is one required check. Passed means the check succeeded; Failed means it did not. A failed required check can prevent a language from being selected.",
        "text": "This note explains the scope, interpretation, or limitations of the results above.",
    }
    sections = []
    for section in report.get("sections", []):
        title = esc(section.get("title", "Results"))
        kind = section.get("type")
        description = esc(section.get("description") or section_guides.get(kind, ""))
        content = ""
        if kind == "comparison":
            metrics = section.get("metrics", [])
            languages = []
            for metric in metrics:
                for language in metric.get("values", {}):
                    if language not in languages:
                        languages.append(language)
            has_weights = any(metric.get("weight") is not None for metric in metrics)
            weight_header = (
                '<th><span class="tooltip-trigger" tabindex="0" '
                'data-tooltip="Weight is this criterion’s share of the final 100-point score. The shares add up to 100% and were fixed before final measurements. Contribution = category score × weight ÷ 100. The preregistration records the chosen shares but does not give a separate rationale for why each criterion received its relative share." '
                'aria-label="How criterion weights work">Weight<span class="tooltip-mark" aria-hidden="true">i</span></span></th>'
                if has_weights else ""
            )
            headers = "<th>Metric</th>" + weight_header + "".join(f"<th>{esc(language)}</th>" for language in languages)
            rows = []
            for metric in metrics:
                values = metric.get("values", {})
                numeric = [(language, value) for language, value in values.items() if isinstance(value, (int, float))]
                preferred = metric.get("better", "lower")
                winners = set()
                if numeric:
                    best_value = (max if preferred == "higher" else min)(value for _, value in numeric)
                    winners = {language for language, value in numeric if value == best_value}
                label = metric.get("label", metric.get("id", "Metric"))
                explanation = metric.get("explanation", "")
                if explanation:
                    metric_label = (
                        f'<span class="tooltip-trigger" tabindex="0" data-tooltip="{esc(explanation)}" '
                        f'aria-label="Details for {esc(label)}"><strong>{esc(label)}</strong>'
                        '<span class="tooltip-mark" aria-hidden="true">i</span></span>'
                    )
                else:
                    metric_label = f'<strong>{esc(label)}</strong>'
                row = f'<td>{metric_label}<small class="subtext">{esc(metric.get("unit", ""))}</small></td>'
                if has_weights:
                    weight = metric.get("weight")
                    weight_explanation = metric.get("weight_explanation", "")
                    if weight is not None and weight_explanation:
                        weight_label = (
                            f'<span class="tooltip-trigger" tabindex="0" data-tooltip="{esc(weight_explanation)}" '
                            f'aria-label="Why {esc(weight)} percent weight"><strong>{esc(weight)}%</strong>'
                            '<span class="tooltip-mark" aria-hidden="true">i</span></span>'
                        )
                    else:
                        weight_label = esc(weight) + "%" if weight is not None else "—"
                    row += f'<td>{weight_label}'
                    row += '<small class="subtext">of total</small></td>' if weight is not None else "</td>"
                for language in languages:
                    value = values.get(language)
                    rendered = fmt_metric(value, metric) if value is not None else "—"
                    if language in winners and len(numeric) > 1:
                        rendered = f'<span class="winner">{rendered}<small>best</small></span>'
                    row += f"<td>{rendered}</td>"
                rows.append(f"<tr>{row}</tr>")
            table_html = f'<div class="table-wrap"><table><thead><tr>{headers}</tr></thead><tbody>{"".join(rows)}</tbody></table></div>'
            content = table_html
        elif kind in {"table", "checks"}:
            columns = section.get("columns", [])
            rows = section.get("rows", [])
            header_html = "".join(f"<th>{esc(column)}</th>" for column in columns)
            row_html = "".join("<tr>" + "".join(f"<td>{cell(value)}</td>" for value in row) + "</tr>" for row in rows)
            content = f'<div class="table-wrap"><table><thead><tr>{header_html}</tr></thead><tbody>{row_html}</tbody></table></div>'
        elif kind == "text":
            content = f'<p class="prose">{esc(section.get("text", ""))}</p>'
        sections.append(f'<section class="panel"><div class="eyebrow">{esc(kind or "RESULTS")}</div><h2>{title}</h2>{f"<p class=description>{description}</p>" if description else ""}{content}</section>')

    artifact_tiles = []
    raw_files = []
    for path in sorted(p for p in run_dir.rglob("*") if p.is_file() and p.name != "benchmark-report.json"):
        relative = path.relative_to(run_dir).as_posix()
        href = f"{esc(stamp)}/{esc(relative)}"
        artifact_tiles.append(f'<a class="artifact" href="{href}" download><span class="file-icon">{esc(path.suffix[1:].upper() or "FILE")}</span><span><b>{esc(relative)}</b><small>{path.stat().st_size:,} bytes</small></span></a>')
        if path.suffix.lower() in {".json", ".log", ".txt"}:
            try:
                body = html.escape(json.dumps(json.loads(path.read_text()), indent=2, ensure_ascii=False)) if path.suffix.lower() == ".json" else html.escape(path.read_text(errors="replace"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                body = html.escape(path.read_text(errors="replace"))
            raw_files.append(f'<details><summary>{esc(relative)} <a href="{href}" download>download</a></summary><pre>{body}</pre></details>')

    limitations = "".join(f"<li>{esc(item)}</li>" for item in report.get("limitations", []))
    limitations_html = f'<section class="panel explanation limits-panel"><h2>Limits of this result</h2><ul>{limitations}</ul></section>' if limitations else ""
    status = report.get("status", "informational")
    badge_tone = {"passed": "success", "failed": "danger", "incomplete": "warning"}.get(status, "primary")
    tooltip_script = """(() => {
  const tooltip = document.createElement('div');
  tooltip.className = 'custom-tooltip';
  tooltip.id = 'metric-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  document.body.append(tooltip);
  let active = null;
  const hide = () => {
    if (!active) return;
    active.removeAttribute('aria-describedby');
    active = null;
    tooltip.style.visibility = 'hidden';
  };
  const show = (target) => {
    const text = target?.dataset.tooltip;
    if (!text) return;
    active = target;
    target.setAttribute('aria-describedby', tooltip.id);
    tooltip.textContent = text;
    tooltip.style.visibility = 'hidden';
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    requestAnimationFrame(() => {
      if (active !== target) return;
      const anchor = target.getBoundingClientRect();
      const box = tooltip.getBoundingClientRect();
      const left = Math.max(12, Math.min(anchor.left, innerWidth - box.width - 12));
      const above = anchor.top - box.height - 8;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${above >= 8 ? above : Math.min(innerHeight - box.height - 8, anchor.bottom + 8)}px`;
      tooltip.style.visibility = 'visible';
    });
  };
  document.addEventListener('pointerover', (event) => {
    const target = event.target.closest?.('.tooltip-trigger');
    if (target && target !== active) show(target);
  });
  document.addEventListener('pointerout', (event) => {
    if (active && !active.contains(event.relatedTarget)) hide();
  });
  document.addEventListener('focusin', (event) => {
    const target = event.target.closest?.('.tooltip-trigger');
    if (target) show(target);
  });
  document.addEventListener('focusout', (event) => {
    if (active && !active.contains(event.relatedTarget)) hide();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hide();
  });
})();
"""
    document = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(report.get('title', 'Benchmark results'))}</title><style>
:root{{--page:#f3f4f6;--surface:#fff;--ink:#111827;--muted:#6b7280;--line:#e5e7eb;--primary:#4f46e5;--success:#15803d;--danger:#b91c1c;--warning:#b45309;--shadow:0 1px 3px #10182812}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--page);color:var(--ink);font:14px/1.5 Inter,ui-sans-serif,system-ui,sans-serif}}a{{color:inherit;text-decoration:none}}.topbar{{height:58px;background:#fff;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 max(24px,calc((100vw - 1320px)/2))}}.topbar span{{color:var(--muted);font-size:12px}}.brand{{display:flex;align-items:baseline;font-size:14px;letter-spacing:-.02em;-webkit-user-select:none;user-select:none}}.brand span{{color:#9ca3af;font-weight:400}}.brand strong{{color:#111827;font-weight:700}}main{{max-width:1320px;padding:30px 24px 54px;margin:auto}}.head{{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:22px}}.eyebrow{{color:var(--muted);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;-webkit-user-select:none;user-select:none}}h1{{font-size:25px;letter-spacing:-.035em;margin:4px 0}}.subtitle,.description,.prose{{color:var(--muted)}}.badge{{display:inline-flex;align-items:center;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:500;background:#f9fafb;color:#4b5563;box-shadow:inset 0 0 0 1px #6b72801a;white-space:nowrap;-webkit-user-select:none;user-select:none}}.badge.success{{background:#f0fdf4;color:var(--success);box-shadow:inset 0 0 0 1px #16a34a26}}.badge.danger{{background:#fef2f2;color:var(--danger);box-shadow:inset 0 0 0 1px #dc262626}}.badge.warning{{background:#fffbeb;color:var(--warning);box-shadow:inset 0 0 0 1px #d9770626}}.badge.primary{{background:#eef2ff;color:var(--primary);box-shadow:inset 0 0 0 1px #4f46e526}}
.cards{{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:14px;margin-bottom:18px}}.stat,.panel,.decision{{background:var(--surface);border:1px solid var(--line);border-radius:8px;box-shadow:var(--shadow)}}.stat{{padding:16px;min-height:100px}}.stat div{{font-size:12px;color:var(--muted)}}.stat strong{{display:block;font-size:24px;letter-spacing:-.03em;margin:4px 0}}.stat small{{font-size:11px;color:#9ca3af}}.decision{{border-left:4px solid var(--primary);padding:17px 20px;margin:0 0 20px}}.decision-head{{display:flex;align-items:center;justify-content:space-between;gap:14px}}.decision h2{{font-size:19px;margin:0;letter-spacing:-.02em}}.decision p{{margin:9px 0 0;color:#4b5563;max-width:1050px}}.grid{{display:grid;grid-template-columns:1fr;gap:15px;align-items:start}}.panel{{padding:19px;min-width:0}}.explanation{{margin:0 0 16px}}.limits-panel{{margin-top:20px}}.explanation ul{{margin:8px 0 0;padding-left:20px;color:var(--muted)}}.panel h2{{font-size:16px;letter-spacing:-.02em;margin:4px 0 14px}}.table-wrap{{overflow:auto}}table{{width:100%;border-collapse:collapse;text-align:left;font-size:12px}}.tooltip-trigger{{display:inline-flex;align-items:center;gap:6px;cursor:help;border-radius:3px;outline:none}}.tooltip-trigger:focus-visible{{box-shadow:0 0 0 3px #c7d2fe}}.tooltip-mark{{display:inline-grid;place-items:center;width:15px;height:15px;border-radius:50%;background:#eef2ff;color:#4f46e5;font-size:10px;font-weight:700;-webkit-user-select:none;user-select:none}}.custom-tooltip{{position:fixed;z-index:1000;width:max-content;max-width:min(460px,calc(100vw - 24px));max-height:min(65vh,560px);overflow:auto;white-space:pre-line;padding:12px 14px;border:1px solid #374151;border-radius:8px;background:#111827;color:#f9fafb;box-shadow:0 12px 32px #11182740;font-size:12px;line-height:1.55;visibility:hidden;pointer-events:none}}th{{background:#f9fafb;color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:.05em}}td,th{{padding:10px;border-bottom:1px solid #f0f1f3;white-space:nowrap}}tbody tr:last-child td{{border:0}}.subtext{{display:block;color:#9ca3af;font-size:10px;font-weight:400}}.winner{{font-weight:700;color:#166534}}.winner small{{margin-left:5px;border-radius:5px;padding:2px 5px;background:#f0fdf4;font-size:9px;font-weight:500;-webkit-user-select:none;user-select:none}}.section-title{{font-size:16px;margin:27px 0 11px}}.artifacts{{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}}.artifact{{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);border-radius:7px;padding:10px;min-width:0}}.artifact:hover{{border-color:#a5b4fc}}.artifact b,.artifact small{{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}.artifact b{{font-size:11px}}.artifact small{{font-size:10px;color:#9ca3af}}.file-icon{{width:29px;height:34px;border-radius:5px;background:#eef2ff;color:var(--primary);display:grid;place-items:center;font-size:8px;font-weight:700;flex:none;-webkit-user-select:none;user-select:none}}details{{background:white;border:1px solid var(--line);border-radius:7px;padding:11px 13px;margin:7px 0}}summary{{cursor:pointer;font-weight:600;font-size:12px}}summary a{{float:right;color:var(--primary);font-weight:400}}pre{{max-height:520px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;background:#111827;color:#e5e7eb;border-radius:6px;padding:14px;font:11px/1.5 ui-monospace,monospace}}footer{{border-top:1px solid var(--line);margin-top:27px;padding-top:13px;color:#9ca3af;font-size:11px}}@media(max-width:1000px){{.artifacts{{grid-template-columns:repeat(2,minmax(0,1fr))}}}}@media(max-width:800px){{main{{padding:22px 15px}}.grid{{grid-template-columns:1fr}}.artifacts{{grid-template-columns:1fr}}.head{{display:block}}.head>.badge{{display:inline-flex;margin-top:10px}}.topbar{{padding:0 15px}}}}
</style></head><body><div class="topbar"><div class="brand"><span>Feluka-M0/</span><strong>Benchmarks</strong></div><span>{esc(stamp)}</span></div><main><header class="head"><div><div class="eyebrow">BENCHMARK REPORT</div><h1>{esc(report.get('title', 'Benchmark results'))}</h1><p class="subtitle">{esc(report.get('summary', ''))}</p></div><span class="badge {badge_tone}">{esc(status.title())}</span></header><section class="panel explanation"><h2>How to read this report</h2><p class="description">The report is one page, with every result shown in order from top to bottom. Start with the decision and summary values, then read each section description before its table. Units and weights appear in their own columns. In score tables, focus a metric name with the mouse or keyboard to see its inputs and calculation. Highlighted values are best for that metric; raw files are linked at the bottom for verification.</p></section><section class="cards">{cards}</section>{decision_html}<div class="grid">{"".join(sections)}</div>{limitations_html}<section><h2 class="section-title">Run artifacts</h2><div class="artifacts">{"".join(artifact_tiles) or '<p>No files.</p>'}</div></section><section><h2 class="section-title">Audit data</h2>{"".join(raw_files) or '<p>No JSON or logs were included.</p>'}</section><footer>Generated from the benchmark report contract · raw measurements are retained beside this page.</footer></main><script>{tooltip_script}</script></body></html>"""
    output.write_text(document, encoding="utf-8")
    return output
