# Agentic harness for engineers

Six skills for computational structural engineering. They load as one Grok plugin. Upstream skill repos stay in a local cache and are not copied into git.

## Skills

| Skill | Use |
| --- | --- |
| `research-flow` | Frame a question, pin sources, write a checkable spec |
| `numerical-engineering` | OpenSeesPy, CalculiX, Gmsh, Python, pytest, solver bugs |
| `paper-writing` | Q1 or Q2 manuscript, Tectonic or LaTeX, reviewer replies |
| `prompt-engineer` | Units, boundary conditions, tolerances, output contract |
| `agentic-eval` | Judge units, convergence, and claim-to-file alignment |
| `skill-sync` | Diff pinned upstream skills and propose a small local edit |

Long checklists sit in each skill's `references/` directory. `AGENTS.md` is the always-on rule file (SI units, verification, prose).

## Grok Build (Windows)

This machine loads the plugin by path, inside the user profile, so Grok trusts it without a symlink and without a second copy:

```toml
[plugins]
paths = ["C:/Users/ASUS/repos/agentic-harness-for-engineers/plugins/engineering-harness"]
enabled = ["engineering-harness"]
```

Do not also set `[skills].paths` to that folder. Check with:

```powershell
grok plugin validate .\plugins\engineering-harness
grok inspect
python scripts\validate-skills.py
```

Another machine can add the marketplace and install the same plugin:

```powershell
grok plugin marketplace add .
grok plugin install .\plugins\engineering-harness --trust
```

Use one of those two methods, not both, or the six skills load twice.

## Local Grok skills

Personal skills live in `%USERPROFILE%\.grok\skills`. The harness index is `plugins/engineering-harness/skills/skill-sync/references/local-grok-skills.md`. Do not copy those folders into this repo, and do not point Grok at a second skill tree.

## Upstream diffs

```powershell
.\scripts\sync-upstreams.ps1
.\scripts\sync-upstreams.ps1 -CacheDir D:\cache\agentic-harness-cache
```

The default cache is `%LOCALAPPDATA%\agentic-harness-cache`. Pins live in `upstream/sources.json`. The script prints `SKILL.md` diffs and does not edit the hybrids. `skill-sync` decides what, if anything, to cherry-pick.

## Check

`python scripts/validate-skills.py` enforces frontmatter, a description of at most 25 words, `SKILL.md` of at most 150 lines, `AGENTS.md` of at most 70 lines, valid JSON manifests, and no em dash in `AGENTS.md` or the skills.
