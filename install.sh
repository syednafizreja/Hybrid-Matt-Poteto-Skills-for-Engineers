#!/usr/bin/env bash
set -euo pipefail

LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-}"

if [[ -z "$TARGET_DIR" ]]; then
  echo "Usage: ./install.sh /path/to/repository"
  exit 1
fi

if [[ ! -d "$TARGET_DIR" ]]; then
  echo "Error: target directory does not exist: $TARGET_DIR"
  exit 1
fi

TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"

mkdir -p "$TARGET_DIR/.agents/skills" "$TARGET_DIR/.grok/skills"

copy_skill() {
  local skill="$1"
  local destination="$TARGET_DIR/.agents/skills/$skill"
  rm -rf "$destination"
  cp -R "$LIB_DIR/skills/$skill" "$destination"
  echo "  [copy] .agents/skills/$skill"
}

for skill_dir in "$LIB_DIR"/skills/*; do
  [[ -d "$skill_dir" ]] || continue
  copy_skill "$(basename "$skill_dir")"
done

for skill in hybrid-init hybrid-investigate hybrid-grill hybrid-plan hybrid-build hybrid-ship hybrid-retro verify-app; do
  rm -rf "$TARGET_DIR/.grok/skills/$skill"
  cp -R "$LIB_DIR/skills/$skill" "$TARGET_DIR/.grok/skills/$skill"
  echo "  [copy] .grok/skills/$skill"
done

cp "$LIB_DIR/AGENTS.md" "$TARGET_DIR/AGENTS.md"
cp "$LIB_DIR/library.json" "$TARGET_DIR/.agents/hybrid-library.json"

echo ""
echo "Installed Hybrid Matt + Poteto Skills into: $TARGET_DIR"
