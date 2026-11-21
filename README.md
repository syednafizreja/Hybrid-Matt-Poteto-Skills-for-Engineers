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

By default, the installer skips files that already exist in the target repository. Use `--force` to overwrite the included files, including `AGENTS.md` and matching skill files. Back up local customizations before forcing an update.

Clone this library, then install it into an existing repository:

```bash
git clone https://github.com/syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers.git
cd Hybrid-Matt-Poteto-Skills-for-Engineers
bash ./install.sh /path/to/your/repository
```

To overwrite existing files:

```bash
bash ./install.sh /path/to/your/repository --force
```

To install into the current directory of an existing project, run this from that project:

```bash
bash /path/to/Hybrid-Matt-Poteto-Skills-for-Engineers/install.sh .
```

On Windows, run these commands from **Git Bash** and use a Git Bash path such as `/c/Users/you/source/project`.

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

| Destination | Contents |
|---|---|
| `.agents/skills/` | All library skills, including the Hybrid workflow, specialist skills, and Poteto playbooks |
| `.grok/skills/` | Hybrid workflow and specialist skills for Grok |
| `AGENTS.md`, `CLAUDE.md` | Agent operating rules and instructions |
| `GLOSSARY.md`, `FEATURE_MAP.md` | Domain language and repository navigation templates |
| `docs/`, `.vscode/`, `.github/`, `scripts/` | ADR and agent docs, editor settings, PR/CI templates, and boundary checks |
| `verify-setup.sh` | Post-install audit for skills and repository configuration |
| `.agents/hybrid-library.json` | Library name, version, sources, and skill inventory |

The specialist collection includes `codebase-design`, `diagnosing-bugs`, `tdd`, `unslop`, `handoff`, `poteto-mode`, `setup-pstack`, and `verify-app`.

## Update the skills

Pull the latest library changes, then run the installer again for each target repository:

```bash
cd Hybrid-Matt-Poteto-Skills-for-Engineers
git pull
bash ./install.sh /path/to/your/repository
```

The installer skips existing files by default. Pass `--force` to replace matching files when updating.

## Contributing

Improvements and bug reports are welcome. Keep skills focused, make instructions testable, and include the smallest example that demonstrates a change.

## Contributors

- [Syed Nafiz Reja](https://github.com/syednafizreja) - creator and maintainer

## Credits and license

This library brings together the Hybrid workflow, [Matt Pocock's skills](https://github.com/mattpocock/skills), and [Open PStack](https://github.com/ericlitman/open-pstack). Original upstream MIT notices are preserved in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

Original project material is licensed under the [MIT License](LICENSE).
