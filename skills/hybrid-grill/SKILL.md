---
name: hybrid-grill
description: Interactive alignment interview (Matt Pocock's grill-with-docs + domain-modeling + Lauren Tan's multi-model interrogate) that sharpens requirements, updates GLOSSARY.md and ADRs inline, and resolves ambiguity before coding.
---

# `/hybrid-grill` — Strategic Alignment, Domain Modeling & Multi-Model Stress Test

Close the communication gap between human intent and agent execution **before** spending implementation tokens.

## Protocol

1. **Silent Context Load First (Medium Effort):**
   - Read `AGENTS.md`, `GLOSSARY.md`, `FEATURE_MAP.md`, and `docs/adr/`.
   - Explore only the relevant feature directories (`src/features/...`) so you never ask questions the codebase already answers.
2. **Structured Interview (One Focused Batch at a Time):**
   - Grill the user on behavioral edge cases, failure modes, non-goals, data ownership, and reversibility (`Two-Way` vs `One-Way Door`).
   - Push back with candor if a proposed requirement adds complexity without earning its place ("this doesn't earn its place").
3. **Update Domain Model & ADRs Inline:**
   - Whenever a new entity, state transition, or canonical term is agreed upon, update `GLOSSARY.md` immediately so code, UI, and tests use identical names.
   - If a hard-to-reverse architectural decision is made (`One-Way Door`), draft `docs/adr/NNNN-<slug>.md` using `docs/adr/0000-adr-template.md`, explicitly specifying Layer 1–3 hard enforcement.
4. **Optional Devil's-Advocate Check (For Large / One-Way Designs):**
   - If the design touches core architecture, auth, billing, or data migrations, run a brief adversarial critique checking: *What fails at 10x scale? What is the simplest deletion/subtraction alternative?*
5. **Exit Criterion:**
   - Summarize the agreed scope, updated Glossary terms, and Merge Danger rating, then recommend `/hybrid-build` (if `<150k` tokens / single PR) or `/hybrid-plan` (if multi-ticket).
