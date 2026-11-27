# Finite-element verification checklist

Open this file from `numerical-engineering` when a result can move. Record the command, the mesh, and the quantity with units. Cite the reference value in the test. Do not type a benchmark number from memory.

## Mesh convergence

1. Name the quantity of interest: displacement, stress, buckling load, frequency, or strain energy.
2. Run at least three meshes. State the element, the integration rule, and the refinement ratio.
3. Tabulate element size `h`, degrees of freedom, and the quantity in SI units.
4. Report the change between the two finest meshes and the tolerance that stops the study.
5. A stress, a buckling load, or a frequency is unfinished without this table.

## Equilibrium and energy

1. For a static problem with reactions available, compare the reaction resultant with the applied load. State the relative tolerance.
2. Check moment balance about a stated point when the boundary conditions allow it.
3. For linear statics, compare internal strain energy with external work.
4. For a nonlinear step, record the solver residual norm and the energy increment at the accepted step.
5. Fail the test when the solver reports non-convergence. Do not plot a non-converged step as a result.

## Closed-form and shell benchmarks

Use these as regression cases. The test stores the reference and its citation.

1. Patch test. A linear displacement field on a patch of elements returns constant stress within the stated tolerance, away from constrained nodes that pollute the sample.
2. Scordelis-Lo barrel vault. Cylindrical shell roof, self-weight, diaphragm ends. Compare the vertical displacement at the midpoint of the free edge with the cited reference. State radius, length, thickness, angle, `E`, and `nu`.
3. Zoelly sphere. Linear buckling of a complete spherical shell under uniform external pressure. Compare the critical pressure with the classical Zoelly formula evaluated at the same `R`, `t`, `E`, and `nu`. State whether the model is a full sphere or a symmetry sector.
4. Boussinesq half-space. Point load normal to an elastic half-space. Compare the closed-form stress decay at sample points away from the load. Exclude a stated neighborhood of the singular point from the score.

## Algorithmic tangent

1. Probe one quadrature point, or one material state, with a central difference on the stress update.
2. Record the perturbation size, the component tested, and the relative error against the algorithmic tangent.
3. Use a perturbation small enough that truncation does not dominate, and large enough that roundoff does not dominate. State both trials if you had to search.
4. A constitutive change or a geometric-stiffness change needs this check, or an explicit reason the tangent is finite-difference only.

## pytest

1. One test function per quantity. The assertion message prints the value, the reference, the unit, and the tolerance.
2. Fixture inputs carry units in their names or in a dataclass field.
3. The test fails when the analysis process returns a non-zero exit code.
4. Write plots and tables next to the test output directory named in the repo. A figure without that file is not evidence.
