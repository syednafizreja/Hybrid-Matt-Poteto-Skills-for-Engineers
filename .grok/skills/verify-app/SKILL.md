---
name: verify-app
description: Drives the real running application using FEATURE_MAP.md to reproduce bugs, check if bugs are already fixed on main, and capture runtime proof before opening any PR.
---

# `verify-app` — Real-Artifact Runtime Verification

*"It compiles" is not verification.* Prove behavior against the exact surface where users experience it.

## Protocol

1. **Consult `FEATURE_MAP.md` First:**
   - Look up the target feature's entry route, CLI command, navigation steps, keyboard shortcuts, and stable selectors (`data-testid`) before starting.
2. **Boot Cleanly:**
   - Start the local dev server, CLI binary, or test harness from a clean state and verify the health check succeeds.
3. **Bug Reproduction Mode (`@Benny` / `/hybrid-investigate`):**
   - Test latest `main` first, then the reported commit/branch.
   - If the bug does **not** reproduce on `main`, record the passing output and report **"Already fixed on `main` — release needed."**
   - If reproduced on `main`, capture the exact failing stack trace, console error, network response, or failing test output.
4. **Feature / Fix Verification Mode (`/hybrid-build` / `/hybrid-ship`):**
   - Execute the feature walkthrough end-to-end on the live running app.
   - Confirm zero console errors, zero unhandled rejections, and compliance with latency/frame budgets in `FEATURE_MAP.md`.
   - Record concise `before (fail) -> after (pass)` evidence for the PR body.
