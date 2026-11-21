# Hybrid Matt + Poteto Engineering System

Use this workflow for nontrivial engineering work:

1. `/hybrid-init` bootstraps repository configuration.
2. `/hybrid-investigate` establishes root cause from code, history, and runtime evidence.
3. `/hybrid-grill` or `/prototype` resolves genuine product or architecture decisions.
4. `/hybrid-plan` creates small, blocking-edge-ordered tickets.
5. `/hybrid-build` executes isolated work through TDD and real runtime verification.
6. `/hybrid-ship` runs adversarial spec, architecture, runtime, and security review.
7. `/hybrid-retro` converts recurring failures into deterministic guardrails.

Use `codebase-design` for deep modules and stable interfaces.
Use `tdd` for focused behavioral regressions.
Use `unslop` before completion.
Use `handoff` when context or work is handed to another agent.
Use `poteto-mode` and `setup-pstack` for PStack routing.
Use `verify-app` for exact user-facing runtime proof.

No task is complete until deterministic checks and the matching runtime verification pass.
