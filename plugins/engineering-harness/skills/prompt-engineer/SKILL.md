---
name: prompt-engineer
description: Harden a simulation prompt with units, tolerances, boundary conditions, and an output contract. Use before a long analysis run.
user-invocable: true
---

# Prompt engineer

Rewrite a simulation or code prompt so a later run can be checked. Do not start the long run from a soft prompt.

## Required fields

The rewritten prompt names all of these:

1. Geometry, element, and mesh rule, including the refinement plan.
2. Units, and material constants with units.
3. Boundary conditions and loads.
4. Solver name and tolerances.
5. Output paths and the quantity to compare.
6. Pass rule: reference, tolerance, and the command that writes the artifact.

## Reject

Return the prompt for repair when any of these is missing: unit, boundary condition, tolerance, or output path.

## Local library

Open `../skill-sync/references/local-grok-skills.md` and follow the `prompt-engineer` rows before rewriting the prompt.

## Shape

1. Imperative lines. One action per line.
2. No background paragraph that the solver cannot use.
3. Done when the prompt names the command and the file that prove the run.
