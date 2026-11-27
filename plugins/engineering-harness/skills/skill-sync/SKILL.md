---
name: skill-sync
description: Diff pinned upstream skills against the local cache and propose cherry-picks into the six harness skills. Use for skill-sync.
user-invocable: true
---

# Skill sync

Use this to update the six hybrids from pinned upstream skills. The six are `research-flow`, `numerical-engineering`, `paper-writing`, `prompt-engineer`, `agentic-eval`, and `skill-sync`.

## Read

1. Read `upstream/sources.json`.
2. Run `scripts/sync-upstreams.ps1` when a fetch is required. The script writes only under the cache directory. It does not copy skills into this repo.
3. Read the printed `SKILL.md` diff. Ignore files that are not in `sources.json`.

## Propose

1. For each hunk, name the hybrid in `maps_to`.
2. Propose a short edit to that hybrid or to one file in its `references/` directory.
3. Keep local rules: SI units, pytest, the finite-element checklist, claim-plus-evidence prose, and the em dash ban.
4. Do not replace a hybrid body with an upstream skill.
5. Do not add a seventh always-loaded skill unless the user asks for a new name.
6. Done when the proposal lists the upstream path, the local file, and the local rule the hunk must not weaken.

## Local library

1. Read `references/local-grok-skills.md` when a task names an older skill.
2. Open `%USERPROFILE%\.grok\skills\<name>\SKILL.md` for that row.
3. Do not open a second skill home. The Grok copy is the one to read.

## Cache

The default cache is `$env:LOCALAPPDATA\agentic-harness-cache`. That folder is outside this git repo. Do not move it into `.grok/skills`, `skills/`, or a plugin scan path.
