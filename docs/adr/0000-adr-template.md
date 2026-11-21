# ADR-0000: [Short Descriptive Title]

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXXX
- **Door Type:** One-Way Door | Two-Way Door
- **Deciders:** [Human / @Architect]

## Context
What constraint, failure mode, or product need forced this decision? Link relevant specs, issues, or performance traces.

## Decision
State the decision clearly in active voice ("We will...").

## Alternatives Considered
1. **Option A:** Summary and why it was rejected.
2. **Option B:** Summary and why it was rejected.

## Hard Enforcement (Layers 1–3)
How will we prevent agents from accidentally drifting from this decision?
- **Layer 1 (Directory / Module shape):** ...
- **Layer 2 (`scripts/check-boundaries.mjs` / lint / type rule):** ...
- **Layer 3 (`verify-app` runtime test):** ...
