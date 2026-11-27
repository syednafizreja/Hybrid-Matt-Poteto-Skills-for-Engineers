---
name: numerical-engineering
description: Verify and change OpenSeesPy, CalculiX, Gmsh, or Python analysis. Use for tests, bug diagnosis, code review, or solver work.
user-invocable: true
---

# Numerical engineering

Use this for OpenSeesPy, CalculiX, Gmsh, NumPy, SciPy, PyTorch, and pytest. Absorbed triggers: tdd, diagnosing-bugs, systematic-debugging, implement, code-review, verification-before-completion.

## Before editing

1. Read the script, the input deck, and the result file the claim cites.
2. State units, element, mesh, constitutive model, boundary conditions, solver, and tolerance.
3. When a bug has a local pytest target, add the failing assertion before the fix.

## Change

1. Edit the module that owns the wrong result.
2. Keep mesh, load, and material data where the test can call them.
3. Pin seeds and solver tolerances in the test.

## Prove

1. Run pytest for the tests you touched.
2. Open `references/fem-verification-checklist.md` when the change can move a stress, a buckling load, a frequency, a residual, or a tangent.
3. Report the command, the pass or fail line, and the quantity with its unit.
4. Done when the new check passes and the existing checks for that model still pass.

## Review

1. Compare the diff with the spec or the bug report.
2. Reject a helper with one caller.
3. Reject a stress, buckling load, or frequency with no mesh note.
