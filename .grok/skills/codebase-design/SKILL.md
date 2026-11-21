---
name: codebase-design
description: Architectural principles from John Ousterhout, Matt Pocock, and Lauren Tan for designing deep, feature-colocated modules that agents can navigate and modify safely.
---

# `codebase-design` — Deep Modules & Feature Colocation

Use when designing new features, reviewing module boundaries, or refactoring hotspots.

## Core Design Rules

1. **Deep Modules Over Shallow Wrappers (Ousterhout / Pocock):**
   - A good module hides substantial complexity behind a small, simple, stable public interface.
   - Avoid "pass-through" layers, 15-line wrapper files, and micro-abstractions that force an agent to open 8 files to understand 1 operation.
2. **Feature Colocation / High Locality (Tan / Pocock):**
   - Group code by **domain feature** (`src/features/<feature>/`), not by technical layer (`controllers/`, `services/`, `utils/`, `types/`).
   - Expose only a narrow public `index` file per feature; sibling features must import from `index`, never reach into internal files.
3. **Shortest Path = Best Path:**
   - Agents copy existing patterns in the directory they touch. Keep one canonical gold-standard pattern per feature type so naive agents naturally do the right thing.
4. **Make Illegal States Unrepresentable:**
   - Model domain states with discriminated unions / state machines / strict schemas at system boundaries rather than scattered boolean flags (`isLoading`, `isError`, `isDone`).
