---
name: hybrid-init
description: One-time repository setup combining Matt Pocock's repo configuration and Lauren Tan's pstack + real-app verification map generator. Run once per repo in VS Code.
---

# `/hybrid-init` — Unified Repository & Verification Bootstrap

Configure this repository so all `/hybrid-*` skills, sub-agents, and Grok Bot routines work out of the box.

## Steps

1. **Inspect the Repository First:**
   - Detect language/framework (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.), existing test/lint scripts, git remote (`git remote get-url origin`), and existing docs.
2. **Confirm 3 Quick Choices with the User (Concise Single Turn):**
   - **Issue Tracker:** GitHub Issues (`gh` CLI, recommended) or local Markdown tickets under `docs/tickets/`?
   - **Verification Surface:** Web/Electron UI (Playwright/CDP), CLI binary, API server, or test-suite only?
   - **Model Routing:** Confirm `docs/agents/model-routing.md` defaults (medium effort for exploration/coding; high effort for verification, security, and blind evaluations).
3. **Update Strategic Config Files:**
   - Fill in `docs/agents/issue-tracker.md` with the detected `OWNER/REPO` slug.
   - Update Section 4 of `AGENTS.md` with the repo's exact fast deterministic check command (`typecheck && lint && test && node scripts/check-boundaries.mjs`).
   - Customize `scripts/check-boundaries.mjs` directory rules to match the repo's actual `src/` folder layout.
4. **Populate `FEATURE_MAP.md` & `.grok/skills/verify-app/SKILL.md`:**
   - Scan routes, CLI commands, entry points, and `data-testid` / ARIA selectors across the codebase.
   - Populate `FEATURE_MAP.md` with real routes/commands and update `.grok/skills/verify-app/SKILL.md` with the exact startup + smoke-test commands for this app.
5. **Verify End-to-End:**
   - Run `./verify-setup.sh` and report what was configured and any remaining warnings.
