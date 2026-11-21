---
name: tdd
description: Strict Red-Green-Refactor loop testing observable behavior through public module boundaries without mock theatre.
---

# `tdd` — Behavioral Red-Green-Refactor Loop

## Rules

1. **RED — Write One Failing Behavioral Test First:**
   - Test through the module's **public entry point** (`src/features/<feature>/index`), never private internal helpers.
   - Avoid mock theatre: do not write tests that merely assert mock functions were called. Use real domain logic and lightweight boundary fakes (in-memory stores, test HTTP handlers).
   - Run the test and confirm it fails for the expected reason before writing implementation code.
2. **GREEN — Write the Minimal Clean Implementation:**
   - Write only enough production code to make the failing test pass while satisfying strict types and `GLOSSARY.md` naming.
3. **REFACTOR — Deepen & Simplify:**
   - Consolidate duplication, tighten types, remove dead branches, and verify all tests + `node scripts/check-boundaries.mjs` remain green.
