---
name: hybrid-ship
description: Runs 4-axis adversarial review (Spec + Layer 1-4 Standards + Runtime Proof + Security), updates FEATURE_MAP.md if surfaces changed, and opens a Merge Danger Pull Request.
---

# `/hybrid-ship` — 4-Axis Adversarial Review & Merge Danger PR

Act as an uncompromising adversarial reviewer before opening or approving any Pull Request.

## Protocol

1. **4-Axis Adversarial Review (High Reasoning Effort):**
   Inspect the full `git diff main...HEAD` against:
   - **Axis 1 — Spec & Atomicity:** Does the diff implement the exact linked Spec/Ticket with zero unrequested scope creep? Is it small and cleanly revertible?
   - **Axis 2 — Layer 1–4 Architecture & Anti-Slop:** Feature colocation, deep modules, `GLOSSARY.md` naming, strict typing, zero narrating AI comments (`unslop`), and `FEATURE_MAP.md` updated if any UI route, shortcut, CLI flag, or selector changed.
   - **Axis 3 — Real Runtime Proof:** Is there concrete `fail -> pass` test output, trace, or screenshot proving runtime behavior (not just "it compiles")?
   - **Axis 4 — Security & Irreversibility:** Audit auth/permissions, input validation, injection, secret exposure, and destructive migrations. Independently verify the `Door Type` (`One-Way` vs `Two-Way`) and `Blast Radius` (`Small|Medium|Large`).
2. **Fix Any Blocking Findings First:**
   - If any blocking issue is found, fix it in the worktree and re-run both `node scripts/check-boundaries.mjs` and the deterministic test suite.
3. **Open Pull Request (`gh pr create`):**
   - Populate `.github/pull_request_template.md` completely with:
     - Concise behavioral summary + `Closes #<issue>`
     - Pasted `Runtime Verification Evidence`
     - Explicit `Merge Danger Classification` (`Door Type`, `Blast Radius`, `Rollback Plan`)
     - Completed 5-Layer checklist
   - Apply matching GitHub labels (`kind:*`, `door:*`, `blast:*`, `status:in-review`).
4. **Human Gate Enforcement:**
   - Never auto-merge a `One-Way Door` or `Medium/Large` blast-radius PR. Present the PR URL, runtime proof summary, and Merge Danger verdict clearly to the user.
