<div align="center">
  <h1>Hybrid Matt + Poteto Skills</h1>
  <p><strong>A complete engineering workflow for AI coding agents.</strong></p>
  <p>Think clearly. Build in small steps. Prove it works.</p>
  <p>
    <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-14b8a6.svg"></a>
    <a href="https://github.com/syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers"><img alt="Works with agent skill folders" src="https://img.shields.io/badge/agent%20skills-ready-2563eb.svg"></a>
  </p>
</div>

<p align="center">
  <img src="assets/hybrid-hero.svg" alt="Hybrid, Matt Pocock, and Poteto engineering practices combine into one verified engineering workflow" width="100%">
</p>

## About

Hybrid Matt + Poteto Skills is an open-source toolkit for making AI-assisted software work more reliable. It brings practical engineering methods into one reusable library so teams and independent developers can investigate with evidence, build in focused steps, and verify changes against real applications.

## One workflow. Better engineering.

Hybrid combines repository guardrails and runtime proof with Matt Pocock's deep-module and testing practices, plus Poteto's model routing and isolated execution playbooks.

Use the skills individually, or follow the end-to-end path from investigation to a review-ready change. The library works with agent tools that discover skills from `.agents/skills`; it also installs the Hybrid workflow skills into `.grok/skills`.

## Get started

> **Before installing:** the installer replaces the target's root `AGENTS.md` and any same-named skill folders in `.agents/skills` or `.grok/skills`. Back up custom versions first.

Clone this library, then install it into an existing repository:

```bash
git clone https://github.com/syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers.git
cd Hybrid-Matt-Poteto-Skills-for-Engineers
bash ./install.sh /path/to/your/repository
```

For example, to install into the current directory of a repository:

```bash
bash ./install.sh .
```

On Windows, run these commands from **Git Bash** and use a Git Bash path such as `/c/Users/you/source/project`.

Confirm the package and installed entry points:

```bash
bash ./verify-install.sh
test -f /path/to/your/repository/.agents/skills/hybrid/SKILL.md
test -f /path/to/your/repository/.grok/skills/hybrid-build/SKILL.md
```

`verify-install.sh` checks the cloned library package. The two `test` commands check that the skills landed in the target repository.

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

| Destination | Contents |
|---|---|
| `.agents/skills/` | All library skills, including the Hybrid workflow, specialist skills, and Poteto playbooks |
| `.grok/skills/` | The seven `hybrid-*` workflow skills and `verify-app` |
| `AGENTS.md` | The library's repository-level engineering rules |
| `.agents/hybrid-library.json` | Library name, version, sources, and skill inventory |

The specialist collection includes `codebase-design`, `diagnosing-bugs`, `tdd`, `unslop`, `handoff`, `poteto-mode`, `setup-pstack`, and `verify-app`.

## Update the skills

Pull the latest library changes, then run the installer again for each target repository:

```bash
cd Hybrid-Matt-Poteto-Skills-for-Engineers
git pull
bash ./install.sh /path/to/your/repository
```

The installer replaces matching installed skill folders and `AGENTS.md`, so preserve any local edits before updating.

## Contributing

Improvements and bug reports are welcome. Keep skills focused, make instructions testable, and include the smallest example that demonstrates a change.

## Contributors

- [Syed Nafiz Reja](https://github.com/syednafizreja) - creator and maintainer

## Credits and license

This library brings together the Hybrid workflow, [Matt Pocock's skills](https://github.com/mattpocock/skills), and [Open PStack](https://github.com/ericlitman/open-pstack). Original upstream MIT notices are preserved in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

Original project material is licensed under the [MIT License](LICENSE).
