# Computational engineering harness

SI units. A result counts when a check passes and the number is in a file.

## Units and models

- State the unit on every input, tolerance, and result. Use SI: N, m, Pa, kg, s, K.
- Name the element, mesh, constitutive model, boundary conditions, and solver before a run.
- Record the command, the commit, and the result file for every reported number.

## Verification

- Read the deck, the script, and the result file before explaining a number.
- Reproduce a known case before a new claim: patch test, equilibrium, energy balance, or a closed form.
- Mesh studies use at least three refinements. Report the quantity, the meshes, and the change.
- Python changes include pytest. A finite-element change includes a numerical check in the same diff.
- OpenSeesPy, CalculiX, Gmsh, NumPy, SciPy, and PyTorch runs pin the environment and write outputs beside the script.

## Stack

- One public interface per analysis module. Hide the solver call behind it.
- This repo's check is `python scripts/validate-skills.py`. A mechanics repo's check is its pytest file plus the solver log.
- Proof is the test output or the solver log.
- Review units, convergence, the spec, and whether the prose matches the files.

## Token use

- Search, then read the matching lines. Load one skill and one reference for the current step.
- Checklists live in `plugins/engineering-harness/skills/*/references/`.
- Load this plugin once, through `[plugins].paths`. Do not also add that folder under `[skills].paths`.

## Prose

- Short sentences. The claim and the evidence share a paragraph.
- State the modeling limit in the same place as the result.
- Use a period, a comma, a colon, or parentheses. Do not use an em dash.

## Diffs

- Put the failing check in place before changing the model.
- Delete a dead path before adding a helper.
- A pull request names the door (two-way or one-way), the blast radius (small, medium, or large), and the command that proves the result.
