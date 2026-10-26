#!/usr/bin/env python3
"""Create or verify the repository-relative M0 evidence SHA-256 manifest."""
import argparse
import hashlib
import json
import sys
import re
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "results/evidence-manifest.json"
EXCLUDED_PARTS = {"target", "__pycache__", ".git"}
EXCLUDED_FILES = {"evidence-manifest.json", ".DS_Store"}


def digest(path):
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(chunk)
    return value.hexdigest()


def included_files():
    files = []
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        relative = path.relative_to(ROOT)
        if EXCLUDED_PARTS.intersection(relative.parts) or relative.name in EXCLUDED_FILES:
            continue
        if relative.parts[0] == "results" and len(relative.parts) > 1 and relative.parts[1] != "2026-10-24-23_11_32" and re.fullmatch(r"\d{4}-\d{2}-\d{2}-\d{2}_\d{2}_\d{2}(?:-\d{2})?", relative.parts[1]):
            continue
        if relative.parts[0] == "results" and len(relative.parts) == 2 and relative.suffix == ".html" and re.fullmatch(r"\d{4}-\d{2}-\d{2}-\d{2}_\d{2}_\d{2}(?:-\d{2})?\.html", relative.name) and relative.stem != "2026-10-24-23_11_32":
            continue
        if relative.parts[0] == "builds" and relative.as_posix() not in {"builds/.gitignore", "builds/README.md"}:
            continue
        if relative.parts[0] == "data" and path.suffix in {".sqlite", ".sqlite-shm", ".sqlite-wal"}:
            continue
        if path.suffix == ".test":
            continue
        if path.suffix in {".pyc", ".pyo"}:
            continue
        files.append(relative)
    return sorted(set(files), key=lambda path: path.as_posix())


def build_manifest():
    entries = {}
    for relative in included_files():
        path = (ROOT / relative).resolve()
        entries[relative.as_posix()] = {
            "sha256": digest(path),
            "bytes": path.stat().st_size,
        }
    return {
        "created_utc": datetime.now(timezone.utc).isoformat(),
        "purpose": "SHA-256 index for final Feluka M0 source, decision and evidence artifacts. Hashes detect changes; this file is not digitally signed.",
        "files": entries,
    }


def verify_manifest():
    if not MANIFEST.is_file():
        raise SystemExit(f"manifest not found: {MANIFEST}")
    stored = json.loads(MANIFEST.read_text())
    expected = stored.get("files", {})
    actual_paths = {path.as_posix() for path in included_files()}
    errors = []
    for name, record in expected.items():
        path = (ROOT / name).resolve()
        if not path.is_file():
            errors.append(f"missing: {name}")
            continue
        if path.stat().st_size != record["bytes"] or digest(path) != record["sha256"]:
            errors.append(f"changed: {name}")
    for name in sorted(actual_paths - set(expected)):
        errors.append(f"unmanifested: {name}")
    if errors:
        print("Evidence manifest verification failed:", file=sys.stderr)
        print("\n".join(f"- {error}" for error in errors), file=sys.stderr)
        return 1
    print(f"Verified {len(expected)} manifest entries; no unmanifested files.")
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true", help="regenerate the manifest after intentional changes")
    mode.add_argument("--check", action="store_true", help="verify hashes and detect unmanifested files")
    args = parser.parse_args()
    if args.check:
        raise SystemExit(verify_manifest())
    MANIFEST.write_text(json.dumps(build_manifest(), indent=2) + "\n")
    print(f"Wrote {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
