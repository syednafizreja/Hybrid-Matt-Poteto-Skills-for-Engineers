# Feature map

| Surface | Command | Proof |
| --- | --- | --- |
| Skill budgets | `python scripts/validate-skills.py` | Prints `OK` and exits 0 |
| Plugin manifest | `grok plugin validate ./plugins/engineering-harness` | No manifest errors |
| Discovery | `grok inspect` | Six `engineering-harness` skills, each once |
| Upstream drift | `scripts/sync-upstreams.ps1` | `SKILL.md` diffs against `upstream/sources.json` pins |
