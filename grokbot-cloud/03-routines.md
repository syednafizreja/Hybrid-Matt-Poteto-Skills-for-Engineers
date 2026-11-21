# Cloud Automation Routines (Copy-Paste Prompts)

Replace `[OWNER/REPO]` and `[YOUR_TIMEZONE]` before pasting into each Bot's chat.

---

## Routine 1 — `@Benny`: Autonomous Bug Triage & Live Repro (Event: New GitHub Issue)
```text
Set up a routine triggered whenever a new GitHub issue is opened in [OWNER/REPO].
1. Read `AGENTS.md`, `GLOSSARY.md`, `FEATURE_MAP.md`, and `docs/agents/triage-labels.md`.
2. Classify and label the issue (`kind:*`, `status:*`). If spam or completely unactionable, label `status:needs-info`, ask politely for steps/logs, and stop.
3. For `kind:bug`, run `/hybrid-investigate` and `verify-app` at high reasoning effort on a clean `main` worktree using `FEATURE_MAP.md`:
   - If already fixed on `main`: label `status:fixed-on-main`, paste passing runtime proof, and stop.
   - If reproduced on `main`: commit a failing repro test and classify Merge Danger. If `door:two-way` + `blast:small`, delegate to `@Builder` to open a Draft PR with `fail -> pass` runtime proof; otherwise post the trace on the issue and ping `@Architect` and me.
4. If the app fails to boot on clean `main`, stop and alert me with the startup log.
```

---

## Routine 2 — `@Gardener`: Daily Architecture Cleanup & Feature Map Sync (Daily 02:00)
```text
Set up a routine to run daily at 02:00 [YOUR_TIMEZONE] on [OWNER/REPO].
1. Pull latest `main` and run the deterministic check command + `node scripts/check-boundaries.mjs`. If `main` is red, stop and alert me.
2. If 2+ `kind:architecture` PRs are already open, exit quietly.
3. Sync `FEATURE_MAP.md` and `.grok/skills/verify-app/SKILL.md` if routes, shortcuts, or selectors changed in the last 24 hours.
4. Scan files touched in the last 14 days and pick at most ONE high-impact `door:two-way` refactor (<600 lines) consolidating shallow/duplicated logic into a deep module (`codebase-design`). If none exists, exit quietly.
5. Implement in `.worktrees/gardener-YYYY-MM-DD`, run `unslop`, verify with deterministic CI + `verify-app`, and open a PR via `/hybrid-ship`. Never auto-merge.
```

---

## Routine 3 — `@Builder`: 4-Axis Adversarial PR Gatekeeper (Event: PR Opened / Ready)
```text
Set up a routine triggered whenever a Pull Request is opened or marked ready for review in [OWNER/REPO].
1. Run `/hybrid-ship` 4-axis adversarial review at high reasoning effort (Spec fidelity, Layer 1–4 architecture & `unslop`, `verify-app` runtime proof, and security/irreversibility).
2. Confirm GitHub Actions CI (including `scripts/check-boundaries.mjs`) is green.
3. Route by Merge Danger:
   - Blocking findings or red CI -> Request changes with exact `file:line` citations.
   - `One-Way Door` OR `Medium/Large` blast radius -> Comment "HUMAN APPROVAL REQUIRED" and ping me.
   - `Two-Way Door` AND `Small` blast radius with 0 findings -> Comment "Verified safe to merge" and await confirmation. Enable auto-squash-merge only after 20 consecutive clean runs at Stage 4 on the Trust Ladder.
```

---

## Routine 4 — `@Evaluator`: Weekly Retro, Blind Eval & Layer-2 CI Ratchet (Sunday 18:00)
```text
Set up a routine to run every Sunday at 18:00 [YOUR_TIMEZONE] on [OWNER/REPO].
1. Collect the last 15 merged PRs, all human PR review comments, and any failed runs from the past 7 days. Skip quietly if fewer than 2 PRs were merged and there were no failures.
2. Run `/hybrid-retro`: convert recurring human review comments into hard Layer-2 CI rules (`scripts/check-boundaries.mjs`, linters, tests) first, Layer-3 `verify-app` checks second, and Layer-4 prose last.
3. Run a blind A/B eval (`docs/agents/eval-rubric-template.md`) in neutral temp directories with a cross-model judge for any skill or `AGENTS.md` edit; drop any edit scoring < 9/10.
4. Open one consolidated `kind:guardrail` + `door:one-way` PR for my approval and post the Sunday summary in chat.
```

---

## Routine 5 — `@Builder` + `@Architect`: Overnight Ticket Queue & 08:00 Digest (Stage 3+)
```text
Set up two routines on [OWNER/REPO]:
A) Nightly at 23:30 [YOUR_TIMEZONE] (@Builder): Pick up at most 5 unblocked issues labeled `status:ready-for-build` + `door:two-way` + `blast:small`, execute each in an isolated `.worktrees/` branch via `/hybrid-build`, and open PRs via `/hybrid-ship`. Mark tickets stalled after more than 2 failed attempts as `status:needs-info`.
B) Daily at 08:00 [YOUR_TIMEZONE] (@Architect): Post a concise morning digest listing all PRs landed on `main` (with commit SHAs for instant `git revert`), PRs awaiting human approval, `@Benny` triage findings, and any red CI alerts.
```
