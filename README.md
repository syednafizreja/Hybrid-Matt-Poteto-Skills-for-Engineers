# Hybrid Matt + Poteto Skills for Engineers

A unified, installable engineering library combining:

- Hybrid repository workflow
- Matt Pocock engineering skills
- Poteto/PStack routing and isolated execution

The library gives AI coding agents a common workflow for investigation, planning, implementation, verification, review, and handoff.

## Install

Run from the repository root:

```bash
chmod +x install.sh
./install.sh /path/to/target-repository
```

To install into the current repository:

```bash
./install.sh .
```

Then verify the installation:

```bash
./verify-install.sh
```

## Workflow

The canonical sequence is:

1. `/hybrid-init`
2. `/hybrid-investigate`
3. `/hybrid-grill` or `/prototype`
4. `/hybrid-plan`
5. `/hybrid-build`
6. `/hybrid-ship`
7. `/hybrid-retro`

Specialist skills include `codebase-design`, `diagnosing-bugs`, `tdd`, `unslop`, `handoff`, `poteto-mode`, `setup-pstack`, and `verify-app`.

## Repository layout

```text
skills/<skill>/SKILL.md
AGENTS.md
install.sh
verify-install.sh
verify-library.mjs
library.json
```

`SKILL.md` files are the canonical skill documents. `AGENTS.md` is the operating policy for repositories where this library is installed.

## Source provenance

- Hybrid workflow: local Grok hybrid workflow
- Matt Pocock skills: `mattpocock/skills`
- PStack/Poteto skills: `ericlitman/open-pstack`

The upstream skill repositories remain independent sources. This package merges their relevant workflows into one public, de-duplicated library.
