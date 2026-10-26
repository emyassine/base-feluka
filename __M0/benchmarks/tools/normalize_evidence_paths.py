#!/usr/bin/env python3
"""Replace machine-local workspace and temporary paths in published JSON evidence."""
import argparse
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESULTS = ROOT / "results"
ROOT_PREFIX = str(ROOT)
TEMP_PATH = re.compile(r"/tmp/feluka-m0-[^/\s\"']+")


def portable_text(value):
    value = value.replace("/tmp/feluka-m0-tinygo-root/usr/local/lib/tinygo/bin/tinygo", "<TINYGO_EXECUTABLE>")
    value = value.replace("/tmp/feluka-m0-tinygo-root", "<TINYGO_ROOT>")
    value = value.replace(ROOT_PREFIX, "<M0_ROOT>")
    return TEMP_PATH.sub("<M0_TEMP>", value)


def transform(value):
    if isinstance(value, str):
        return portable_text(value)
    if isinstance(value, list):
        return [transform(item) for item in value]
    if isinstance(value, dict):
        return {key: transform(item) for key, item in value.items()}
    return value


def find_local_paths(value, path="$", found=None):
    if found is None:
        found = []
    if isinstance(value, str):
        if ROOT_PREFIX in value or "/tmp/feluka-m0-" in value:
            found.append(path)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            find_local_paths(item, f"{path}[{index}]", found)
    elif isinstance(value, dict):
        for key, item in value.items():
            find_local_paths(item, f"{path}.{key}", found)
    return found


def evidence_json_files():
    return sorted(
        path for path in RESULTS.rglob("*.json")
        if path.name not in {"m0-score.json", "evidence-manifest.json"}
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    modes = parser.add_mutually_exclusive_group(required=True)
    modes.add_argument("--write", action="store_true", help="normalize JSON path strings in place")
    modes.add_argument("--check", action="store_true", help="fail if machine-local paths remain")
    args = parser.parse_args()
    changed = []
    problems = []
    for path in evidence_json_files():
        data = json.loads(path.read_text())
        if args.write:
            normalized = transform(data)
            if isinstance(normalized, dict):
                normalized["publication_path_policy"] = "Workspace and temporary paths are replaced with placeholders; measured values, hashes, commands, and outputs are otherwise retained."
            if normalized != data:
                path.write_text(json.dumps(normalized, indent=2) + "\n")
                changed.append(path.relative_to(ROOT).as_posix())
        else:
            problems.extend(f"{path.relative_to(ROOT)}:{location}" for location in find_local_paths(data))
    if problems:
        print("Machine-local paths remain in evidence:", file=sys.stderr)
        print("\n".join(f"- {problem}" for problem in problems), file=sys.stderr)
        return 1
    if args.write:
        print(f"Normalized {len(changed)} JSON evidence files: " + (", ".join(changed) if changed else "no changes"))
    else:
        print("No machine-local workspace or temporary paths in evidence JSON.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
