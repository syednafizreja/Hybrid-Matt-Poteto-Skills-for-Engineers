#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PASS=0
FAIL=0

check_file() {
  if [[ -f "$1" ]]; then
    echo "  [OK] $2"
    PASS=$((PASS + 1))
  else
    echo "  [FAIL] $2"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== Hybrid Matt + Poteto Skill Verification ==="

check_file "$REPO_ROOT/library.json" "library.json"
check_file "$REPO_ROOT/AGENTS.md" "AGENTS.md"
check_file "$REPO_ROOT/CLAUDE.md" "CLAUDE.md"
check_file "$REPO_ROOT/GLOSSARY.md" "GLOSSARY.md"
check_file "$REPO_ROOT/FEATURE_MAP.md" "FEATURE_MAP.md"
check_file "$REPO_ROOT/verify-setup.sh" "verify-setup.sh"
check_file "$REPO_ROOT/.grok/skills/hybrid-build/SKILL.md" ".grok/skills/hybrid-build/SKILL.md"
check_file "$REPO_ROOT/scripts/check-boundaries.mjs" "scripts/check-boundaries.mjs"

while IFS= read -r skill_dir; do
  skill="$(basename "$skill_dir")"
  check_file "$skill_dir/SKILL.md" "skills/$skill/SKILL.md"
done < <(find "$REPO_ROOT/skills" -mindepth 1 -maxdepth 1 -type d -print)

echo ""
echo "Result: $PASS passed, $FAIL failed."
(( FAIL == 0 ))
