---
name: hybrid-build
description: Executes a ticket or full spec using isolated Git worktrees (.worktrees/), fresh sub-agent contexts, TDD, real-app runtime verification (verify-app), and anti-slop cleanup (unslop).
---

# `/hybrid-build` — Isolated Worktree Execution, TDD & Real-App Proof

Build verified, minimal, deep-module code without polluting your main working tree or exceeding the `150k`-token smart zone.

## Protocol

1. **Worktree & Context Isolation:**
   - For a single ticket: create a dedicated worktree `.worktrees/<ticket-slug>` on a new branch `feat/<ticket-slug>` (or `fix/<ticket-slug>`).
   - For a multi-ticket spec: execute the ready frontier in parallel worktrees (one fresh sub-agent per unblocked ticket; never fork bloated sessions), merging verified branches into an integration branch cleanly.
2. **Follow `codebase-design` & `poteto-mode` Discipline (Medium Effort):**
   - Co-locate feature code inside `src/features/<feature>/` behind a narrow public `index` interface.
   - Use exact names from `GLOSSARY.md`.
   - Subtract before adding: delete dead paths rather than layering workarounds.
3. **Drive Red-Green-Refactor (`tdd`):**
   - Write a failing behavioral test through the module's public entry point first -> implement the minimal clean code to pass -> refactor for deep-module clarity.
4. **Deterministic Gate + Real-App Proof (`verify-app` at High Effort):**
   - Run the mandatory deterministic command in `AGENTS.md` (including `node scripts/check-boundaries.mjs`) until exit code `0`.
   - Run `.grok/skills/verify-app/SKILL.md` against the real running app using `FEATURE_MAP.md` and capture authentic `fail -> pass` output.
5. **Strip AI Slop (`unslop`):**
   - Run `.grok/skills/unslop/SKILL.md` on `git diff` to remove narrating comments, speculative abstractions, and unrelated formatting churn, then re-run the deterministic check command.
