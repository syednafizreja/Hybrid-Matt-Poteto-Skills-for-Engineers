<div align="center">
  <h1>Hybrid Matt + Poteto Skills</h1>
  <p><strong>A complete engineering workflow for AI coding agents.</strong></p>
  <p>Think clearly. Build in small steps. Prove it works.</p>
  <p>
    <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-14b8a6.svg"></a>
    <a href="https://agentskills.io"><img alt="Agent Skills compatible" src="https://img.shields.io/badge/Agent%20Skills-compatible-2563eb.svg"></a>
  </p>
</div>

<p align="center">
  <img src="assets/hybrid-hero.svg" alt="Hybrid, Matt Pocock, and Poteto engineering practices combine into one verified engineering workflow" width="100%">
</p>

## About

Hybrid Matt + Poteto Skills is an open-source toolkit for making AI-assisted software work more reliable. Its portable `SKILL.md` files can be installed into Claude Code, Codex, Grok Build, GitHub Copilot, Gemini CLI, Cursor, and 70+ other supported agents through the Skills CLI. Use one skill or the whole library, with no single AI provider required.

## One workflow. Better engineering.

Hybrid combines repository guardrails and runtime proof with Matt Pocock's deep-module and testing practices, plus Poteto's model routing and isolated execution playbooks.

Use any skill on its own or follow the end-to-end path from investigation to a review-ready change. Skills follow the open [Agent Skills](https://agentskills.io) format. Host-specific interfaces and optional features can vary, but the core skill instructions are portable.

## Install for your AI agent

Install skills into your project with [Vercel's Skills CLI](https://github.com/vercel-labs/skills). It prompts you to choose skills and compatible agents, so you can install only what fits your workflow:

```bash
npx skills@latest add syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers
```

Install every skill to every supported agent with `--all`, or install selected skills globally with `-g`:

```bash
npx skills@latest add syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers --all
npx skills@latest add syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers -g
```

To explicitly install one skill for one agent:

```bash
npx skills@latest add syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers --skill tdd --agent codex
```

The Skills CLI requires Node.js 22.20 or later. See its [supported agent list](https://github.com/vercel-labs/skills/blob/main/docs/agents.md) for current integrations and install locations.

## Install the full factory

The full factory adds repository guidance, setup templates, VS Code tasks, CI checks, and optional Grok Bot cloud guides alongside the skills. By default, its installer skips files already present. Use `--force` to overwrite included files, including `AGENTS.md`; back up local customizations first.

Prefer a ready-to-extract VS Code + Grok starter kit? Download the [34-file factory ZIP](grokbot-vscode-hybrid-factory.zip).

Clone this library, then install into an existing repository:

```bash
git clone https://github.com/syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers.git
cd Hybrid-Matt-Poteto-Skills-for-Engineers
bash ./install.sh /path/to/your/repository
```

To install into the current directory of an existing project, run the script from that project:

```bash
bash /path/to/Hybrid-Matt-Poteto-Skills-for-Engineers/install.sh .
```

On Windows, run the factory installer from **Git Bash** and use a Git Bash path such as `/c/Users/you/source/project`. The Skills CLI also installs skills into each selected agent's native folder.

Verify the package, then run the installed setup audit from the target repository:

```bash
bash ./verify-install.sh
cd /path/to/your/repository
bash ./verify-setup.sh
```

`verify-install.sh` checks the library package. `verify-setup.sh` checks the installed skills, docs, VS Code settings, runtime prerequisites, and boundary script.

## The workflow

| Step | Skill | Use it to |
|:--:|---|---|
| 1 | `hybrid-init` | Set up repository guidance, checks, and runtime verification |
| 2 | `hybrid-investigate` | Trace behavior and establish evidence before proposing a fix |
| 3 | `hybrid-grill` | Resolve product or architecture decisions |
| 4 | `hybrid-plan` | Break agreed work into sequenced, verifiable tickets |
| 5 | `hybrid-build` | Implement in isolation with focused tests and runtime proof |
| 6 | `hybrid-ship` | Review the spec, architecture, runtime evidence, and merge risk |
| 7 | `hybrid-retro` | Turn recurring lessons into durable checks and guidance |

You can start with any skill that matches the work. For a small bug, use `tdd` directly; for an unfamiliar system, start with `hybrid-investigate`.

## What gets installed

| Installer | Contents |
|---|---|
| Skills CLI | Selected skills in the native directories for one or more supported agents |
| `install.sh` | Full factory files, all skills under `.agents/skills/`, and Grok skill copies under `.grok/skills/` |
| Full factory files | `AGENTS.md`, `CLAUDE.md`, glossary and feature-map templates, docs, VS Code tasks, CI templates, and boundary checks |
| `grokbot-cloud/` | Optional Grok Bot private-skill setup, bot profiles, routines, and trust ladder |
| `verify-setup.sh` | Post-install audit for skills and repository configuration |
| `.agents/hybrid-library.json` | Library name, version, sources, and skill inventory |

The specialist collection includes `codebase-design`, `diagnosing-bugs`, `tdd`, `unslop`, `handoff`, `poteto-mode`, `setup-pstack`, and `verify-app`.

## Update the skills

For skills installed with the Skills CLI, check for and apply updates with:

```bash
npx skills@latest check
npx skills@latest update
```

To update the full factory, pull the latest library and rerun `install.sh`. It skips existing files by default; pass `--force` to replace matching files.

## Contributing

Improvements and bug reports are welcome. Keep skills focused, make instructions testable, and include the smallest example that demonstrates a change.

## Contributors

- [Syed Nafiz Reja](https://github.com/syednafizreja) - creator and maintainer

## Credits and license

This library brings together the Hybrid workflow, [Matt Pocock's skills](https://github.com/mattpocock/skills), and [Open PStack](https://github.com/ericlitman/open-pstack). Original upstream MIT notices are preserved in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

Original project material is licensed under the [MIT License](LICENSE).
