---
name: unslop
description: Strips common AI-generated code and prose slop (narrating historical comments, dead compatibility shims, speculative abstractions, and bloated prose) from diffs before PR submission.
---

# `unslop` — Diff & Prose Anti-Slop Pass

Run on `git diff` prior to `/hybrid-ship`.

## Checklist to Remove Immediately

1. **Narrating / Historical Comments:** Delete comments like `// updated per user request`, `// fixed edge case where...`, or obvious restatements of the next line (`// increment counter`). Keep only non-obvious invariant explanations or `// @ts-ignore -- <reason>` justifications.
2. **Dead Compatibility Paths:** Delete unused fallback branches, orphaned helper functions, and commented-out old code ("subtract before adding").
3. **Speculative Over-Engineering:** Remove single-implementation interfaces, unused config flags, and premature generic factories not required by the linked Spec/Ticket.
4. **Unrelated Diff Churn:** Revert whitespace-only or formatting-only edits in untouched files so `git blame` stays clean.
5. **Prose Bloat (in Docs / PRs):** Cut filler phrases ("It is important to note that...", "In order to...") and replace vague claims with exact commands and outputs.
