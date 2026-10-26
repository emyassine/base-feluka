#!/usr/bin/env python3
"""Discover and validate numbered, descriptor-driven benchmark suites."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BENCHMARKS = ROOT / "benchmarks"


def discover():
    suites = []
    for folder in sorted(BENCHMARKS.iterdir()):
        if not folder.is_dir() or not re.match(r"^\d{2}-", folder.name):
            continue
        descriptor_path = folder / "benchmark.json"
        if descriptor_path.is_file():
            suites.append((folder, json.loads(descriptor_path.read_text())))
    return suites


def validate():
    errors = []
    suites = discover()
    if not suites:
        errors.append("no numbered benchmark suites found")
    seen = set()
    for folder, descriptor in suites:
        label = folder.name
        required = ("schema_version", "id", "title", "description", "languages", "metrics", "result_file")
        for key in required:
            if key not in descriptor:
                errors.append(f"{label}: missing descriptor field {key!r}")
        if descriptor.get("schema_version") != 1:
            errors.append(f"{label}: unsupported descriptor schema version")
        if descriptor.get("id") != folder.name:
            errors.append(f"{label}: id must match directory name {folder.name!r}")
        if descriptor.get("id") in seen:
            errors.append(f"{label}: duplicate benchmark id")
        seen.add(descriptor.get("id"))
        schema = descriptor.get("$schema")
        if schema and not (folder / schema).is_file():
            errors.append(f"{label}: descriptor schema does not exist: {schema}")
        languages = descriptor.get("languages", [])
        if not isinstance(languages, list) or not languages:
            errors.append(f"{label}: languages must be a non-empty array")
            continue
        for language in languages:
            manifest_path = folder / language / "implementation.json"
            if not manifest_path.is_file():
                errors.append(f"{label}: missing {language}/implementation.json")
                continue
            try:
                manifest = json.loads(manifest_path.read_text())
                implementation_schema = manifest.get("$schema")
                if implementation_schema and not (manifest_path.parent / implementation_schema).is_file():
                    errors.append(f"{label}/{language}: implementation schema does not exist: {implementation_schema}")
                source_path = (manifest_path.parent / manifest["source"]).resolve()
                if not source_path.exists():
                    errors.append(f"{label}/{language}: source path does not exist: {manifest['source']}")
                if manifest.get("language") != language:
                    errors.append(f"{label}/{language}: language field does not match directory")
            except (KeyError, json.JSONDecodeError) as error:
                errors.append(f"{label}/{language}: invalid implementation descriptor ({error})")
        runner = descriptor.get("runner")
        if runner and not (BENCHMARKS / runner).is_file():
            errors.append(f"{label}: runner does not exist: {runner}")
        schema = descriptor.get("report_format")
        if schema and not (folder / schema).is_file():
            errors.append(f"{label}: report format does not exist: {schema}")
        if not isinstance(descriptor.get("metrics"), list) or not descriptor.get("metrics"):
            errors.append(f"{label}: declare at least one metric")
    if errors:
        print("Benchmark catalog validation failed:", file=sys.stderr)
        print("\n".join(f"- {error}" for error in errors), file=sys.stderr)
        return 1
    print(f"Validated {len(suites)} benchmark descriptors and {sum(len(d['languages']) for _, d in suites)} implementation manifests.")
    return 0


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in {"list", "validate"}:
        raise SystemExit("usage: python3 benchmarks/tools/catalog.py list|validate")
    if sys.argv[1] == "validate":
        raise SystemExit(validate())
    for folder, descriptor in discover():
        langs = ", ".join(descriptor.get("languages", []))
        print(f"{descriptor['id']:<34} {descriptor['title']} [{langs}]")


if __name__ == "__main__":
    main()
