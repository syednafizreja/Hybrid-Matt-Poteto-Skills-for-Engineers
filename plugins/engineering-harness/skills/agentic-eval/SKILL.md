---
name: agentic-eval
description: Score an analysis, paper claim, or agent trace for units, convergence, and evidence. Use for self-critique or LLM-as-judge.
user-invocable: true
---

# Agentic eval

Use this to judge an analysis, a paper claim, or an agent trace. The judge scores only what a file, a log, or a figure shows.

## Loop

1. Read `references/engineering-eval-rubrics.md` and pick the rubric that matches the artifact.
2. Writer produces the artifact.
3. Judge lists failures as `file:line`, figure id, or log line, plus the rule that failed.
4. Writer fixes those items and nothing else.
5. Stop when the rubric gate passes, or when the same failure remains after two fixes. Report the remaining failure.

## Local library

Open `../skill-sync/references/local-grok-skills.md` and follow the `agentic-eval` rows before scoring.

## Physics judge

Check, in order: units, boundary conditions, residual or energy, mesh convergence when the quantity needs it, and whether the claim is stronger than the evidence.

## Prose judge

A paper paragraph passes when the claim, the evidence, and the modeling limit are in that paragraph. Use the paper-writing reference for marker words. Do not restyle text that already passes.
