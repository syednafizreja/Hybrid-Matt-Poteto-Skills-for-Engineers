# Blind Skill Eval & Hill-Climbing Rubric Template

> Treat every skill or `AGENTS.md` edit like production code: test it blind across isolated sub-agents and score it with a cross-model judge before merging.

## Protocol

1. **Neutral Temp Directories (Anti-Leakage):**
   - Run sub-agents in neutrally named directories (e.g., `/tmp/task-alpha-01`, `/tmp/task-beta-02`).
   - **Never** put words like `eval`, `benchmark`, `test-skill`, or `grading` in paths or prompts—agents detect evaluation framing and alter behavior.
2. **A/B Replay:**
   - Replay 3–5 real historical issues/PRs through **Baseline** (`main` skill) and **Candidate** (edited skill).
3. **Cross-Model Judge:**
   - Randomize labels (`Output A` vs `Output B`) and score with a **different model family** acting as Judge.
4. **Merge Gate:**
   - Only merge if Candidate beats or ties Baseline on every criterion and scores **>= 9/10** overall.

## Scoring Rubric (10 Points)

| Axis | Weight | Pass Requirement |
| :--- | :--- | :--- |
| **1. Read-Before-Guessing (`/hybrid-investigate`)** | 2 pts | Inspected actual files & Git history before hypothesizing; zero hallucinated symbols |
| **2. Real Runtime Verification (`verify-app`)** | 3 pts | Executed real app/tests and pasted authentic `fail -> pass` runtime proof |
| **3. Scope & Anti-Slop (`unslop`)** | 2 pts | Atomic diff; zero narrating AI comments; matches `GLOSSARY.md` |
| **4. Layer-2 CI Compliance (`check-boundaries.mjs`)** | 2 pts | Zero type, lint, or import-boundary violations |
| **5. Merge Danger & Handoff Accuracy** | 1 pt | Accurate Door Type, Blast Radius, and rollback plan |
