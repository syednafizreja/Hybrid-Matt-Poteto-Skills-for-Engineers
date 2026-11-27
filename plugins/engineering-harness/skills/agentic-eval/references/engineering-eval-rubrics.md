# Engineering eval rubrics

Score from evidence. A missing file is a fail for that axis, not a partial.

## Analysis rubric (10)

| Axis | Points | Pass |
| --- | ---: | --- |
| Units on inputs, tolerances, and the reported quantity | 2 | SI, or a stated coherent system used everywhere |
| Boundary conditions and loads match the claim | 2 | Named in the deck or the test fixture |
| Residual, energy, or reaction balance | 2 | Tolerance stated, and the log meets it |
| Mesh or model convergence for stress, buckling, or frequency | 2 | At least three meshes, or a closed form with the singular region excluded |
| Reproducible command | 2 | pytest or the solver command reruns from a clean tree |

Gate: units and boundary conditions must pass. Total at least 8. A non-converged solver step scores 0 on residual.

## Claim rubric (10)

| Axis | Points | Pass |
| --- | ---: | --- |
| Number matches a result file | 4 | Same digits the file prints, with the unit |
| Verification case exists for the element or the solver | 3 | Patch test, benchmark, or closed form cited in the test |
| Modeling limit sits with the claim | 2 | Names what the model leaves out |
| Prose has no banned marker from the paper-writing reference | 1 | Spot check of the paragraph |

Gate: the file match must pass. Total at least 8. An invented number scores 0 on the file axis.

## Skill-edit rubric (10)

Use this when changing a skill or `AGENTS.md`. Run three real tasks. Hide which output is the candidate. A judge from another model family scores them.

| Axis | Points | Pass |
| --- | ---: | --- |
| Read the owning file before a cause | 2 | The trace cites the file |
| Runtime proof | 3 | Failing check, then passing check, on the real command |
| Scope | 2 | The diff does the task and deletes a dead path if one was in the way |
| Checks | 2 | The repo's validate or pytest command passes |
| Door and blast radius | 1 | Two-way or one-way, and small, medium, or large |

Gate: at least 9, and no axis below its previous score.
