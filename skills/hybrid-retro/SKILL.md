---
name: hybrid-retro
description: Post-session or weekly continuous improvement loop combining Matt Pocock's retro + improve-codebase-architecture with Lauren Tan's Layer-2 CI ratcheting and blind skill evaluations.
---

# `/hybrid-retro` — Deterministic Guardrail Ratchet, Hotspot Refactor & Blind Eval

Every time a human had to leave a PR review comment or correct an agent, treat it as a **systemic failure of our environment**—not a one-off prompt tweak.

## Protocol

1. **Harvest Friction Signals:**
   - Inspect recent merged PRs, human PR review comments, reverted commits, and failed verification runs.
2. **Rank Fixes by the 5-Layer Enforcement Stack:**
   - **Priority 1 (Layer 1–2 Hard CI):** Add a new rule to `scripts/check-boundaries.mjs`, linter config, compiler flags, or a fast regression test so CI turns **RED** if an agent makes that mistake again.
   - **Priority 2 (Layer 3 Runtime Verification):** Update `FEATURE_MAP.md` or `.grok/skills/verify-app/SKILL.md` if an agent missed a real runtime bug.
   - **Priority 3 (Layer 1 Architecture Hotspot):** Run a targeted hotspot scan on files modified in the last 14 days to consolidate duplicated or shallow helpers into one deep, testable module.
   - **Priority 4 (Layer 4 Steering):** Update `GLOSSARY.md`, add an ADR in `docs/adr/`, or tighten `AGENTS.md` / skills only when no hard check is feasible.
3. **Blind Eval Gate for Any Skill / `AGENTS.md` Edit (`docs/agents/eval-rubric-template.md`):**
   - If you propose editing any `SKILL.md` or `AGENTS.md`, test Baseline vs. Candidate across 3 historical tasks in neutrally named temp directories (never use words like `eval` or `benchmark` in paths/prompts).
   - Score anonymized outputs using a **cross-model judge** (or strict rubric checklist) and discard any edit scoring `< 9/10`.
4. **Ship as an Atomic Guardrail PR:**
   - Verify the entire repository passes under the new rules, then open a `kind:guardrail` + `door:one-way` PR summarizing which failure modes are now permanently blocked in CI.
