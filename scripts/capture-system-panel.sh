#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_path="${1:-/tmp/feluqa-system-panel.png}"
mobile_output_path="${output_path%.*}.mobile.png"
dark_output_path="${output_path%.*}.dark.png"
users_output_path="${output_path%.*}.users.png"
users_dark_output_path="${output_path%.*}.users.dark.png"
temporary_dir="$(mktemp -d "${TMPDIR:-/tmp}/feluqa-panel-capture.XXXXXX")"
server_pid=""

cleanup() {
    if [[ -n "$server_pid" ]]; then
        kill "$server_pid" 2>/dev/null || true
        wait "$server_pid" 2>/dev/null || true
    fi
    rm -rf "$temporary_dir"
}
trap cleanup EXIT INT TERM

mkdir -p "$(dirname "$output_path")" "$temporary_dir/site/assets/feluqa"
(
    cd "$repo_root/_crates"
    FELUQA_UI_CAPTURE="$temporary_dir/site/index.html" \
        FELUQA_UI_USERS_CAPTURE="$temporary_dir/site/users.html" \
        cargo test -p numerimondes --bin numerimondes \
        core_setup_login_csrf_panels_and_logout_work_over_http
)

cp "$repo_root/_crates/feluqa-panel/assets/filament-theme.css" "$temporary_dir/site/assets/feluqa/theme.css"
cp "$repo_root/_crates/feluqa-panel/assets/filament-panel.css" "$temporary_dir/site/assets/feluqa/panel.css"
cp "$repo_root/_crates/feluqa-panel/assets/filament.js" "$temporary_dir/site/assets/feluqa/panel.js"
cp "$repo_root/_crates/feluqa-panel/assets/feluqa-shell.js" "$temporary_dir/site/assets/feluqa/shell.js"
cp "$repo_root/_crates/feluqa-panel/assets/feluqa-notifications.js" "$temporary_dir/site/assets/feluqa/notifications.js"
cp "$repo_root/_crates/feluqa-panel/assets/feluqa-live.js" "$temporary_dir/site/assets/feluqa-live.js"
python3 - "$temporary_dir/site/index.html" "$temporary_dir/site/mobile.html" "$temporary_dir/site/dark.html" "$temporary_dir/site/users.html" "$temporary_dir/site/users-dark.html" <<'PY'
from pathlib import Path
import sys

source = Path(sys.argv[1]).read_text()
mobile_css = '''<style>@media(max-width:63.999rem){#fi-main-sidebar{display:flex!important;position:fixed!important;inset:0 auto 0 0!important;width:min(20rem,85vw)!important;max-width:85vw!important;transform:none!important;translate:0!important;z-index:60!important;box-shadow:0 12px 32px #0003!important}#fi-main-sidebar .fi-sidebar-item-label[hidden],#fi-main-sidebar .fi-sidebar-group-label[hidden],#fi-main-sidebar .fi-sidebar-header-logo-ctn[hidden],#fi-main-sidebar .fi-sidebar-header-controls[hidden],#fi-main-sidebar .fi-user-menu-trigger-text[hidden]{display:initial!important}#fi-main-sidebar .fi-sidebar-header-logo-ctn[hidden],#fi-main-sidebar .fi-sidebar-header-controls[hidden]{display:block!important}.fi-sidebar-close-overlay{display:none!important}.fi-app-shell .fi-main-ctn{margin-inline-start:0!important}}</style>'''
mobile = source.replace("<head>", "<head><script>localStorage.setItem('feluqa:theme', 'light');</script>", 1)
mobile = mobile.replace("</head>", mobile_css + "</head>", 1)
mobile = mobile.replace('id="fi-main-sidebar" class="fi-sidebar fi-main-sidebar"', 'id="fi-main-sidebar" class="fi-sidebar fi-main-sidebar fi-sidebar-open" data-sidebar-open="true"', 1)
Path(sys.argv[2]).write_text(mobile)
Path(sys.argv[3]).write_text(source.replace("<head>", "<head><script>localStorage.setItem('feluqa:theme', 'dark');</script>", 1))
users = Path(sys.argv[4]).read_text()
Path(sys.argv[5]).write_text(users.replace("<head>", "<head><script>localStorage.setItem('feluqa:theme', 'dark');</script>", 1))
PY

python3 -u -m http.server 0 --bind 127.0.0.1 --directory "$temporary_dir/site" \
    >"$temporary_dir/http.log" 2>&1 &
server_pid="$!"
for _ in {1..100}; do
    if grep -q 'Serving HTTP on' "$temporary_dir/http.log"; then
        break
    fi
    sleep 0.05
done
port="$(sed -n 's/.*port \([0-9][0-9]*\).*/\1/p' "$temporary_dir/http.log" | head -n 1)"
if [[ -z "$port" ]]; then
    cat "$temporary_dir/http.log" >&2
    exit 1
fi

firefox --headless --screenshot "$output_path" --window-size 1600,1000 \
    "http://127.0.0.1:$port/"
printf 'Panel screenshot: %s\n' "$output_path"
firefox --headless --screenshot "$dark_output_path" --window-size 1600,1000 \
    "http://127.0.0.1:$port/dark.html"
printf 'Dark panel screenshot: %s\n' "$dark_output_path"
firefox --headless --screenshot "$mobile_output_path" --window-size 390,844 \
    "http://127.0.0.1:$port/mobile.html"
printf 'Mobile drawer screenshot: %s\n' "$mobile_output_path"
firefox --headless --screenshot "$users_output_path" --window-size 1600,1000 \
    "http://127.0.0.1:$port/users.html"
printf 'Users screenshot: %s\n' "$users_output_path"
firefox --headless --screenshot "$users_dark_output_path" --window-size 1600,1000 \
    "http://127.0.0.1:$port/users-dark.html"
printf 'Dark users screenshot: %s\n' "$users_dark_output_path"
