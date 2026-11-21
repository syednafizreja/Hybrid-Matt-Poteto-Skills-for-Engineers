# 4-Stage Rollout & Trust Curve (VS Code Local -> Cloud Factory)

1. **Stage 1 — Local VS Code Verification (Days 1–4):**
   - Run `./install.sh` and `./verify-setup.sh` in your project repo, then `/hybrid-init`.
   - Complete **one full manual cycle** in VS Code: `/hybrid-investigate` -> `/hybrid-grill` -> `/hybrid-plan` -> `/hybrid-build` -> `/hybrid-ship` -> `/hybrid-retro`.
   - Verify `verify-app` drives your real running app cleanly using `FEATURE_MAP.md`.
2. **Stage 2 — Human-Gated Cloud Routines (Weeks 1–2):**
   - Enable Routines 1–4 with **all merges human-gated**.
   - Sample `@Gardener`'s first 5 architecture PRs closely, then sample ~1 in 5.
   - Merge at least 2 weekly `@Evaluator` guardrail PRs so review comments harden into `scripts/check-boundaries.mjs` rules.
3. **Stage 3 — Overnight Ticket Runner (Weeks 3–4):**
   - Once `door:two-way` + `blast:small` PRs pass CI and adversarial review cleanly without human edits, enable Routine 5 (capped at 5 tickets/night + 08:00 morning digest).
4. **Stage 4 — Selective Auto-Merge & Review-on-`main` (Month 2+):**
   - After **20 consecutive clean runs** on `door:two-way` + `blast:small` PRs, allow Routine 3 to auto-squash-merge them when CI is green, and review asynchronously via the 08:00 digest.
   - **Permanent Hard Rule:** Keep all `door:one-way` PRs (migrations, auth, billing, secrets, CI/guardrails, `AGENTS.md`) and `blast:medium|large` PRs strictly human-approved forever.
