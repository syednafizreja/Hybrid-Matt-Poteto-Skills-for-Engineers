# Triage Labels & Issue State Machine

Used by `@Benny` and `/hybrid-plan`.

## Workflow State Labels (Mutually Exclusive)
| Label | Meaning | Next Owner |
| :--- | :--- | :--- |
| `status:untriaged` | Newly opened; not yet inspected | `@Benny` |
| `status:needs-info` | Missing repro steps, logs, or expected behavior | Issue Author |
| `status:fixed-on-main` | `@Benny` proved the bug is already fixed on `main` (release needed) | Release Manager / Human |
| `status:reproduced` | Confirmed failing on `main` with runtime evidence / repro test | `@Builder` or Human |
| `status:ready-for-spec` | Feature or complex bug requiring `/hybrid-grill` | `@Architect` |
| `status:ready-for-build` | Ticketed and unblocked; ready for `/hybrid-build` | `@Builder` |
| `status:in-review` | PR open with runtime proof + Merge Danger rating | `@Builder` / Human |

## Classification Labels
- `kind:bug` — Verifiable defect
- `kind:feature` — New capability
- `kind:architecture` — Deep-module refactor or `FEATURE_MAP.md` maintenance
- `kind:guardrail` — Layer 1–2 CI check, linter, or blind skill eval improvement from `/hybrid-retro`

## Merge Danger Labels
- `door:two-way` — Easily reversible; eligible for sampling / Stage-4 auto-merge
- `door:one-way` — Irreversible or high-risk; mandatory human approval forever
- `blast:small` | `blast:medium` | `blast:large`
