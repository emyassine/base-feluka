#!/usr/bin/env python3
"""Capture the PocketBase record-rule REST oracle into a timestamped result directory."""
import argparse
import hashlib
import json
import pathlib
import secrets
import signal
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request


ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "benchmarks/tools"))
from results_dir import new_run_dir

BASE = "http://127.0.0.1:38110"
EMAILS = {"admin": "m0@example.test", "alice": "alice@example.test", "bob": "bob@example.test"}
PASSWORD = secrets.token_urlsafe(32)


def request(method, path, payload=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = token
    body = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(BASE + path, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            raw = response.read()
            return response.status, json.loads(raw) if raw else None
    except urllib.error.HTTPError as exc:
        raw = exc.read()
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            parsed = {"message": raw.decode(errors="replace")}
        return exc.code, parsed


def require(expected, actual, context):
    if actual[0] != expected:
        raise RuntimeError(f"{context}: expected HTTP {expected}, got {actual[0]}: {actual[1]}")
    return actual[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("binary", type=pathlib.Path, help="path to official PocketBase v0.40.6 executable")
    parser.add_argument("--output", type=pathlib.Path)
    args = parser.parse_args()
    binary = args.binary.resolve()
    version = subprocess.run([str(binary), "--version"], capture_output=True, text=True, check=True).stdout.strip()
    if "0.40.6" not in version:
        raise SystemExit(f"expected PocketBase v0.40.6, got {version}")

    with tempfile.TemporaryDirectory(prefix="feluka-m0-pocketbase-") as temp:
        data = pathlib.Path(temp) / "data"
        public = pathlib.Path(temp) / "public"
        data.mkdir()
        public.mkdir()
        subprocess.run([str(binary), "superuser", "upsert", EMAILS["admin"], PASSWORD, "--dir", str(data)], capture_output=True, check=True)
        server = subprocess.Popen(
            [str(binary), "serve", "--http", "127.0.0.1:38110", "--dir", str(data), "--publicDir", str(public), "--dev=false"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        try:
            deadline = time.monotonic() + 15
            while time.monotonic() < deadline:
                if server.poll() is not None:
                    raise RuntimeError(f"PocketBase exited with status {server.returncode}")
                try:
                    status, _ = request("GET", "/api/health")
                    if status == 200:
                        break
                except (OSError, urllib.error.URLError):
                    time.sleep(0.05)
            else:
                raise TimeoutError("PocketBase did not become ready")

            admin_auth = require(200, request("POST", "/api/collections/_superusers/auth-with-password", {"identity": EMAILS["admin"], "password": PASSWORD}), "admin auth")
            admin = admin_auth["token"]
            require(200, request("POST", "/api/collections", {
                "name": "members", "type": "auth", "authRule": "",
                "fields": [{"name": "name", "type": "text"}],
                "passwordAuth": {"enabled": True, "identityFields": ["email"]},
            }, admin), "create members collection")
            require(200, request("POST", "/api/collections", {
                "name": "notes", "type": "base",
                "listRule": '@request.auth.id != "" && owner_id = @request.auth.id',
                "viewRule": '@request.auth.id != "" && owner_id = @request.auth.id && status = "active"',
                "createRule": '@request.auth.id != "" && @request.body.owner_id = @request.auth.id',
                "updateRule": '@request.auth.id != "" && owner_id = @request.auth.id',
                "deleteRule": None,
                "fields": [
                    {"name": "owner_id", "type": "text", "required": True},
                    {"name": "status", "type": "text", "required": True},
                    {"name": "title", "type": "text", "required": True},
                ],
            }, admin), "create notes collection")

            users = {}
            for name in ("alice", "bob"):
                email = EMAILS[name]
                require(200, request("POST", "/api/collections/members/records", {
                    "email": email, "password": PASSWORD, "passwordConfirm": PASSWORD, "name": name.title(),
                }, admin), f"create {name}")
                auth = require(200, request("POST", "/api/collections/members/auth-with-password", {"identity": email, "password": PASSWORD}), f"auth {name}")
                users[name] = {"id": auth["record"]["id"], "token": auth["token"]}

            record_ids = []
            for owner, state, title in (("alice", "active", "Alice active"), ("alice", "draft", "Alice draft"), ("bob", "active", "Bob active")):
                result = require(200, request("POST", "/api/collections/notes/records", {
                    "owner_id": users[owner]["id"], "status": state, "title": title,
                }, admin), "seed note")
                record_ids.append(result["id"])

            calls = [
                ("list_owner_filtered", "GET", "/api/collections/notes/records", None, users["alice"]["token"]),
                ("list_guest_empty", "GET", "/api/collections/notes/records", None, None),
                ("view_owner_active", "GET", f"/api/collections/notes/records/{record_ids[0]}", None, users["alice"]["token"]),
                ("view_owner_draft_hidden", "GET", f"/api/collections/notes/records/{record_ids[1]}", None, users["alice"]["token"]),
                ("view_other_owner_hidden", "GET", f"/api/collections/notes/records/{record_ids[2]}", None, users["alice"]["token"]),
                ("create_matching_owner", "POST", "/api/collections/notes/records", {"owner_id": users["alice"]["id"], "status": "active", "title": "allowed"}, users["alice"]["token"]),
                ("create_mismatched_owner", "POST", "/api/collections/notes/records", {"owner_id": users["bob"]["id"], "status": "active", "title": "denied"}, users["alice"]["token"]),
                ("delete_locked", "DELETE", f"/api/collections/notes/records/{record_ids[0]}", None, users["alice"]["token"]),
                ("superuser_list_bypasses_rule", "GET", "/api/collections/notes/records", None, admin),
                ("superuser_delete_bypasses_lock", "DELETE", f"/api/collections/notes/records/{record_ids[0]}", None, admin),
            ]
            cases = []
            for label, method, path, payload, token in calls:
                status, body = request(method, path, payload, token)
                cases.append({
                    "name": label,
                    "status": status,
                    "items": len(body.get("items", [])) if isinstance(body, dict) and isinstance(body.get("items"), list) else None,
                    "body_error": body.get("message") if isinstance(body, dict) else None,
                })

            output = {
                "reference": "PocketBase REST API; fresh temporary SQLite database; default auth; test-created base collection",
                "version": version,
                "release_commit": "9d281cc",
                "binary_sha256": hashlib.file_digest(binary.open("rb"), "sha256").hexdigest(),
                "collection": "notes; owner_id and status text fields; Alice/active, Alice/draft, Bob/active records; an allowed Alice/active record is added before superuser list",
                "rules": {
                    "list": '@request.auth.id != "" && owner_id = @request.auth.id',
                    "view": '@request.auth.id != "" && owner_id = @request.auth.id && status = "active"',
                    "create": '@request.auth.id != "" && @request.body.owner_id = @request.auth.id',
                    "update": '@request.auth.id != "" && owner_id = @request.auth.id',
                    "delete": None,
                },
                "credentials": "Disposable local-only credentials; not saved.",
                "cases": cases,
            }
            destination = args.output.resolve() if args.output else new_run_dir(ROOT) / "pocketbase-reference.json"
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(json.dumps(output, indent=2) + "\n")
            print(destination)
            print(json.dumps(cases, indent=2))
        finally:
            server.send_signal(signal.SIGINT)
            try:
                server.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server.kill()
                server.wait()


if __name__ == "__main__":
    main()
