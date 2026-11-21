# Per-Role Model & Reasoning Effort Sheet

| Stage / Role | Effort | Cost & Quality Rule |
| :--- | :--- | :--- |
| Exploration (`/hybrid-investigate` read phase) | `medium` (`low` for lookups) | Read targeted files via `GLOSSARY.md` and `FEATURE_MAP.md`; stay below 150k tokens. |
| Grilling & slicing (`/hybrid-grill`, `/hybrid-plan`) | `medium` | Keep alignment focused, tickets below 150k tokens, and Merge Danger labels explicit. |
| Implementation (`/hybrid-build`, `/tdd`) | `medium` | Let deterministic CI and `verify-app` catch errors before escalating reasoning effort. |
| Runtime reproduction & verification (`verify-app`, `@Benny`) | `high` | Inspect traces and logs thoroughly; verify behavior on the real surface. |
| Adversarial review & blind-eval judge (`/hybrid-ship`, `/hybrid-retro`) | `high` | Use a cross-model reviewer or judge when available to reduce self-confirmation bias. |
