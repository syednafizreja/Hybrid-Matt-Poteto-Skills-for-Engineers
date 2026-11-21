#!/usr/bin/env bash
set -euo pipefail

# Audit Agentic Harness for Engineers v3 installation inside any repository.
# Usage: ./verify-setup.sh

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PASS=0
WARN=0
FAIL=0

ok()   { echo "  [OK]   $1"; PASS=$((PASS+1)); }
warn() { echo "  [WARN] $1"; WARN=$((WARN+1)); }
fail() { echo "  [FAIL] $1"; FAIL=$((FAIL+1)); }

echo "=== Agentic Harness for Engineers v3 Audit ==="
echo "Repo: ${REPO_ROOT}"
echo ""

echo "1. Runtime & CLI Prerequisites"
command -v git  >/dev/null 2>&1 && ok "git ($(git --version))" || fail "git not found"
command -v node >/dev/null 2>&1 && ok "node ($(node -v))" || fail "node not found"

if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    ok "gh CLI authenticated"
  else
    warn "gh CLI installed but not authenticated (run 'gh auth login' for issue/PR automation)"
  fi
else
  warn "gh CLI not installed"
fi

if command -v grok >/dev/null 2>&1; then
  ok "grok CLI available"
else
  warn "'grok' CLI not on PATH (fine if using Grok Bot or Grok Build in VS Code)"
fi

echo ""
echo "2. Unified Agentic Harness Skills (.grok/skills/)"
EXPECTED_SKILLS=(
  hybrid-init
  hybrid-investigate
  hybrid-grill
  hybrid-plan
  hybrid-build
  hybrid-ship
  hybrid-retro
  verify-app
  codebase-design
  tdd
  unslop
  handoff
)

for skill in "${EXPECTED_SKILLS[@]}"; do
  if [[ -f "${REPO_ROOT}/.grok/skills/${skill}/SKILL.md" ]]; then
    ok ".grok/skills/${skill}/SKILL.md"
  else
    fail "Missing .grok/skills/${skill}/SKILL.md"
  fi
done

echo ""
echo "3. Strategic Docs, VS Code Config & Layer-2 CI"
REQUIRED_FILES=(
  "AGENTS.md"
  "CLAUDE.md"
  "GLOSSARY.md"
  "FEATURE_MAP.md"
  "THIRD_PARTY_NOTICES.md"
  "docs/adr/0000-adr-template.md"
  "docs/agents/codingstandards.md"
  "docs/agents/issue-tracker.md"
  "docs/agents/triage-labels.md"
  "docs/agents/model-routing.md"
  "docs/agents/eval-rubric-template.md"
  "scripts/check-boundaries.mjs"
  ".vscode/settings.json"
  ".vscode/tasks.json"
  ".github/pull_request_template.md"
  ".github/workflows/deterministic-ci.yml"
)

for f in "${REQUIRED_FILES[@]}"; do
  if [[ -f "${REPO_ROOT}/${f}" ]]; then
    ok "${f}"
  else
    fail "Missing ${f}"
  fi
done

echo ""
echo "4. Layer-2 Architecture & Anti-Slop Dry-Run"
if [[ -f "${REPO_ROOT}/scripts/check-boundaries.mjs" ]]; then
  if node "${REPO_ROOT}/scripts/check-boundaries.mjs" "${REPO_ROOT}" >/dev/null 2>&1; then
    ok "scripts/check-boundaries.mjs passed (0 violations)"
  else
    warn "scripts/check-boundaries.mjs found violations (run 'node scripts/check-boundaries.mjs' to view)"
  fi
fi

echo ""
echo "Result: ${PASS} passed, ${WARN} warnings, ${FAIL} failed."
if (( FAIL > 0 )); then
  exit 1
fi
