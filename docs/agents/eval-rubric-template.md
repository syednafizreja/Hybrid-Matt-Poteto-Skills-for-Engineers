# Blind Skill Eval Rubric (10 Points)

Treat skill and `AGENTS.md` edits like production code: compare them blind on real tasks before merging.

## Protocol

1. **Neutral Paths:** Run in neutral directories such as `/tmp/work-alpha-01`; keep `eval`, `benchmark`, and `test-skill` out of paths and task prompts.
2. **A/B Replay:** Compare anonymized Baseline (`main`) and Candidate outputs on exactly 3 real tasks.
3. **Cross-Model Judge:** Randomize output labels and score with a judge from a different model family.
4. **Merge Gate:** Require `>= 9/10` and zero regressions against Baseline.

## Scoring Rubric

| Axis | Weight | Pass Requirement |
| :--- | :--- | :--- |
| **Read Before Guessing (`/hybrid-investigate`)** | 2 pts | Inspected actual files and history before proposing a cause. |
| **Real Runtime Proof (`verify-app`)** | 3 pts | Captured authentic `fail -> pass` output on the real surface. |
| **Scope & Anti-Slop (`unslop`)** | 2 pts | Atomic diff, canonical `GLOSSARY.md` terms, and no narrating comments. |
| **Layer-2 CI Pass** | 2 pts | Types, lint, tests, and `scripts/check-boundaries.mjs` all pass. |
| **Merge Danger Accuracy** | 1 pt | Correct Door Type, Blast Radius, and rollback plan. |
