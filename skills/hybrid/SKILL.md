---
name: hybrid
description: Unified engineering workflow combining Hybrid repository guardrails, Matt Pocock deep-module and TDD practices, and PStack model routing and isolated execution. Use for /hybrid or requests to run the merged library.
---

# Hybrid

Follow `AGENTS.md` in this library and the user's target repository.

## Route the work

- Investigation or diagnosis: `hybrid-investigate`
- Architecture alignment or a genuine decision: `hybrid-grill`
- Tracer-bullet implementation plan: `hybrid-plan`
- Isolated implementation: `hybrid-build`
- Shipping review: `hybrid-ship`
- Recurring CI lessons: `hybrid-retro`
- Model routing: `setup-pstack`
- Deep-module design: `codebase-design`
- Focused bug test: `tdd`
- Runtime proof: `verify-app`

## Execution rules

1. Read the target code, tests, history, and ADRs before hypothesizing.
2. Reproduce user-visible behavior before changing production code.
3. Name the data shape before writing stateful logic.
4. Prefer feature-colocated modules with small interfaces.
5. Use isolated worktrees for nontrivial changes.
6. Sequence work into small, verifiable units.
7. Run deterministic checks and the real runtime check.
8. Report evidence and merge danger for every shipped change.
