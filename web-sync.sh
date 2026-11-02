#!/bin/bash
#
# Web Sync Deploy
#
# Fast, private, context-aware deployment script using rsync.
# Designed as an alternative to git push for production environments.
#
# Features:
# - SSH / SFTP deployment
# - Respects .gitignore exclusions
# - Multiple deployment instances
# - Context-aware post-deployment (WebKernel, Laravel, Static)
# - Optimized transfers with rsync
#
# Author: El Moumen Yassine
# License: MPL-2.0
#
# Usage:
#   ./web-sync.sh
#
# Configuration:
#   Edit web-sync.config before first use
#

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/web-sync.config"
GITIGNORE_FILE="$SCRIPT_DIR/.gitignore"

create_default_config() {
cat > "$CONFIG_FILE" << 'EOF'
# ============================================================
# Web Sync Deploy – Configuration File
# ============================================================
# This file defines the remote server and deployment instances.
# Each instance maps a local deployment name to:
#
#   /remote/path:context
#
# Available contexts:
#   - webkernel : WebKernel-based applications
#   - laravel   : Standard Laravel applications
#   - static    : Static websites (HTML/CSS/JS only)
#
# Example:
#   ["Production"]="/var/www/app:webkernel"
#   SOURCE_DIRS["Production"]="docs-output/site-1"
# ============================================================

# Remote server hostname or IP
SERVER="your-server.com"

# SSH user used for deployment
USER="your-username"

# Optional remote chown in owner:group form. Set RSYNC_REMOTE_SUDO=true when
# the SSH user needs sudo rsync to apply it.
REMOTE_CHOWN=""
REMOTE_DIR_MODE="755"
REMOTE_FILE_MODE="644"
RSYNC_REMOTE_SUDO="false"
REMOTE_STAGING_ROOT="$HOME/.web-sync-staging"

# ------------------------------------------------------------
# Deployment instances
# ------------------------------------------------------------
# Format:
#   ["InstanceName"]="/absolute/remote/path:context"
# ------------------------------------------------------------

declare -A INSTANCES=(
  ["Production"]="/var/www/production:webkernel"
  ["Staging"]="/var/www/staging:webkernel"
  ["Static"]="/var/www/static:static"
)

# Optional per-instance local source. Omit an entry to be prompted at runtime.
declare -A SOURCE_DIRS=()

# Passwords are disabled unless UNSAFE_MODE=true. Prefer SSH keys and
# passwordless sudo for rsync. Configured passwords require sshpass.
UNSAFE_MODE=false
SSH_PASSWORD=""
SUDO_PASSWORD=""

# ------------------------------------------------------------
# Deployment methods
# ------------------------------------------------------------
# ssh  : Recommended (rsync + post-deploy tasks)
# sftp : Basic transfer only (no context-aware actions)
# ------------------------------------------------------------

METHODS=("ssh" "sftp")

# ============================================================
# End of configuration
# ============================================================
EOF

  echo "Default configuration created at $CONFIG_FILE"
  echo "Edit this file with your server and paths, then run the script again."
  exit 0
}

build_rsync_excludes() {
  local context="$1"
  local -a excludes=(--exclude=.git)

  case $context in
    webkernel|laravel)
      excludes+=(--exclude=.env --exclude=bootstrap/cache/)
      ;;
  esac

  if [[ -f "$GITIGNORE_FILE" ]]; then
    while IFS= read -r line || [[ -n "$line" ]]; do
      line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
      [[ -z "$line" || "$line" =~ ^# ]] && continue
      excludes+=(--exclude="$line")
    done < "$GITIGNORE_FILE"
  fi

  RSYNC_EXCLUDES=("${excludes[@]}")
}

RSYNC_EXCLUDES=()

run_post_deploy() {
  local host="$1"
  local target="$2"
  local context="$3"

  case $context in
    webkernel)
      echo ""
      echo "Running WebKernel post-deployment tasks..."
      ssh "$host" "cd $target && composer update --no-dev --optimize-autoloader && php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan view:cache"
      ;;
    laravel)
      echo ""
      echo "Running Laravel post-deployment tasks..."
      ssh "$host" "cd $target && composer update --no-dev --optimize-autoloader && php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan view:cache"
      ;;
    static)
      echo ""
      echo "Static site deployed, no post-deployment tasks needed"
      ;;
  esac
}

[[ ! -f "$CONFIG_FILE" ]] && create_default_config

source "$CONFIG_FILE"

if [[ "${UNSAFE_MODE:-false}" != "true" ]]; then
  SSH_PASSWORD=""
  SUDO_PASSWORD=""
fi

echo ""
echo ""
echo "WEB SYNC (•) DEPLOY"
echo "Fast Private Alternative to Git Push"
echo "Intelligent sync with gitignore respect, excludes .git,"
echo "optimized transfers, and interactive deployment"
echo ""
echo "<rsync optimization> <gitignore> <interactive> <secure>"
echo "<Deploy> <Backup> <Sync> <Transfer> <Production Ready>"
echo "<WebKernel> <Laravel> <Static> <Context Aware> <Permissions>"
echo ""
echo ""
echo "Server: $SERVER"
echo "User: $USER"
echo ""

if [[ ${#INSTANCES[@]} -eq 0 ]]; then
  echo "No instances configured"
  exit 1
fi

echo "Available instances:"
declare -a instance_names
declare -a instance_paths
declare -a instance_contexts
i=1
for name in "${!INSTANCES[@]}"; do
  IFS=':' read -r path context <<< "${INSTANCES[$name]}"
  echo "$i) $name -> $path [$context]"
  instance_names[$i]=$name
  instance_paths[$i]=$path
  instance_contexts[$i]=$context
  ((i++))
done
echo ""

read -p "Choose instance [1-${#instance_names[@]}]: " choice

if [[ ! "$choice" =~ ^[0-9]+$ ]] || [[ $choice -lt 1 ]] || [[ $choice -gt ${#instance_names[@]} ]]; then
  echo "Invalid choice"
  exit 1
fi

INSTANCE=${instance_names[$choice]}
TARGET=${instance_paths[$choice]}
CONTEXT=${instance_contexts[$choice]}

source_input="${SOURCE_DIRS[$INSTANCE]:-}"
if [[ -z "$source_input" ]]; then
  echo "Choose a local source directory to sync (relative to this script or absolute)."
  read -r -p "Source directory [.] : " source_input
  source_input="${source_input:-.}"
fi
if [[ "$source_input" = /* ]]; then SOURCE="$source_input"; else SOURCE="$SCRIPT_DIR/$source_input"; fi
if [[ ! -d "$SOURCE" ]]; then echo "Source directory does not exist: $SOURCE"; exit 1; fi
SOURCE="$(cd -- "$SOURCE" && pwd)/"

echo ""
echo "Available methods:"
for i in "${!METHODS[@]}"; do
  echo "$((i+1))) ${METHODS[$i]}"
done
echo ""

read -p "Choose method [1-${#METHODS[@]}]: " method_choice

if [[ ! "$method_choice" =~ ^[0-9]+$ ]] || [[ $method_choice -lt 1 ]] || [[ $method_choice -gt ${#METHODS[@]} ]]; then
  echo "Invalid choice"
  exit 1
fi

METHOD=${METHODS[$((method_choice-1))]}
HOST="$USER@$SERVER"

if [[ -n "$SSH_PASSWORD" ]]; then
  command -v sshpass >/dev/null || { echo "SSH_PASSWORD requires sshpass"; exit 1; }
  export SSHPASS="$SSH_PASSWORD"
  ssh() { command sshpass -e ssh "$@"; }
  rsync() { command sshpass -e rsync -e "sshpass -e ssh" "$@"; }
fi

echo ""
echo "Deploying $SOURCE to $INSTANCE [$CONTEXT] via $METHOD..."
echo ""

case $METHOD in
  ssh)
    build_rsync_excludes "$CONTEXT"
    if [[ -n "${REMOTE_CHOWN:-}" ]]; then
      if [[ ! "${REMOTE_CHOWN}" =~ ^[^:]+:[^:]+$ ]]; then
        echo "REMOTE_CHOWN must use owner:group form, for example yassine:www-data"
        exit 1
      fi
      if [[ "${RSYNC_REMOTE_SUDO:-false}" != "true" ]]; then
        echo "REMOTE_CHOWN requires RSYNC_REMOTE_SUDO=true"
        exit 1
      fi
    fi
    if [[ "${RSYNC_REMOTE_SUDO:-false}" == "true" ]]; then
      stage_instance="${INSTANCE//[^A-Za-z0-9_.-]/_}"
      remote_stage="${REMOTE_STAGING_ROOT%/}/$stage_instance"
      printf -v remote_stage_q '%q' "$remote_stage"
      printf -v remote_target_q '%q' "$TARGET"
      ssh "$HOST" "mkdir -p -- $remote_stage_q"
      rsync -avz --progress --no-perms --no-owner --no-group "${RSYNC_EXCLUDES[@]}" "$SOURCE" "$HOST:$remote_stage/"

      printf -v remote_chmod_arg '%q' "D${REMOTE_DIR_MODE:-755},F${REMOTE_FILE_MODE:-644}"
      publish_command="sudo rsync -av --ignore-times --chmod=$remote_chmod_arg"
      if [[ -n "${REMOTE_CHOWN:-}" ]]; then
        printf -v remote_chown_arg '%q' "--chown=$REMOTE_CHOWN"
        publish_command+=" $remote_chown_arg"
      fi
      publish_command+=" -- $remote_stage_q/ $remote_target_q/"
      ssh -tt "$HOST" "$publish_command"
      ssh "$HOST" "rm -rf -- $remote_stage_q"
    else
      rsync_options=(--chmod="D${REMOTE_DIR_MODE:-755},F${REMOTE_FILE_MODE:-644}")
      rsync_identity_options=(--no-owner --no-group)
      rsync -avz --progress "${rsync_identity_options[@]}" "${rsync_options[@]}" "${RSYNC_EXCLUDES[@]}" "$SOURCE" "$HOST:$TARGET/"
    fi

    run_post_deploy "$HOST" "$TARGET" "$CONTEXT"
    ;;
  sftp)
    if [[ -n "${REMOTE_CHOWN:-}" || "${RSYNC_REMOTE_SUDO:-false}" == "true" ]]; then
      echo "SFTP cannot apply REMOTE_CHOWN, remote sudo, or configured permissions. Select SSH (rsync) instead."
      exit 1
    fi
    echo "WARNING: SFTP does not support context-aware deployment"
    echo "Use SSH method for WebKernel/Laravel projects"
    echo ""
    read -p "Continue anyway? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
      echo "Deployment cancelled"
      exit 0
    fi
    sftp "$HOST" <<EOF
cd $TARGET
put -r ${SOURCE%/}/*
EOF
    ;;
  *)
    echo "Unknown method: $METHOD"
    exit 1
    ;;
esac

echo ""
echo "Deployment completed successfully"
echo ""
exit 0
