---
name: handoff
description: Compacts a long session into a crisp, zero-loss handoff note in .grok/handoff.md so a fresh <150k-token session can resume immediately without re-exploring.
---

# `/handoff` — Smart-Zone Context Reset Note

Run whenever context approaches ~150k tokens or when switching from alignment/planning to implementation.

## Output Format (Write to `.grok/handoff.md` and Print in Chat)

```markdown
# Session Handoff — YYYY-MM-DD HH:MM

## Goal & Linked Issue/Spec
- Target: [Ticket/Spec # and 1-sentence objective]
- Current Branch / Worktree: [branch name and path]

## Verified Facts (Read from Code / Runtime)
- [Exact file:line findings, test outputs, and constraints confirmed]

## Changes Made So Far
- [List modified files and what each change does]

## Remaining Steps (Ordered)
1. [Next concrete step]
2. [Verification command to run]

## Open Risks / Merge Danger
- Door Type: [Two-Way / One-Way] | Blast Radius: [Small / Medium / Large]
```
