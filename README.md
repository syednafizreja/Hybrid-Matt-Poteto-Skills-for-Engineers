<div align="center">
  <h1>Hybrid Matt + Poteto Skills</h1>
  <p><strong>Ship better software with AI.</strong></p>
  <p>Evidence-first engineering for Claude, Codex, Grok, Copilot, Gemini, and more.</p>
  <p>
    <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-14b8a6.svg"></a>
    <a href="https://agentskills.io"><img alt="Agent Skills compatible" src="https://img.shields.io/badge/Agent%20Skills-compatible-2563eb.svg"></a>
  </p>
</div>

<p align="center">
  <img src="assets/hybrid-hero.svg" alt="An engineering workflow for AI coding agents: understand, plan, build, and prove." width="100%">
</p>

> **Built for engineers:** investigate from evidence, make focused changes, and prove the result before shipping.

## Install

Requires Node.js 22.20 or later. Choose skills and agents interactively:

```bash
npx skills@latest add syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers
```

Install everything to every supported agent with `--all`, or choose one skill and agent:

```bash
npx skills@latest add syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers --all
npx skills@latest add syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers --skill tdd --agent codex
```

Add `-g` for a global install. See the [live agent list](https://github.com/vercel-labs/skills/blob/main/docs/agents.md).

## Choose your starting point

| Engineering task | Start with |
|---|---|
| Understand an unfamiliar codebase | `hybrid-investigate` |
| Diagnose or fix a bug | `diagnosing-bugs`, `tdd` |
| Plan and build a feature | `hybrid-plan` -> `hybrid-build` |
| Design a clear module boundary | `codebase-design` |
| Verify and review a change | `verify-app` -> `hybrid-ship` |

Use skills individually or follow the full loop: **Investigate -> Plan -> Build -> Verify -> Ship.**

## Full repository kit (optional)

Add `AGENTS.md`, setup templates, CI checks, VS Code tasks, and Grok Bot guides:

```bash
git clone https://github.com/syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers.git
cd Hybrid-Matt-Poteto-Skills-for-Engineers
bash ./install.sh /path/to/your/repository
```

The installer skips existing files. Use `--force` to overwrite them. On Windows, run it from Git Bash. Then run `verify-setup.sh` in the target repository. Prefer a ready-to-extract bundle? Get the [factory ZIP](grokbot-vscode-hybrid-factory.zip).

## Update

The weekly [upstream sync](https://github.com/syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers/blob/main/.github/UPSTREAM_SYNC.md) opens a draft PR when source skills change. Review and merge it to integrate updates; nothing merges automatically. Run `npx skills@latest update` for CLI-installed skills.

---

MIT licensed. Combines the Hybrid workflow, [Matt Pocock's skills](https://github.com/mattpocock/skills), and [Open PStack](https://github.com/ericlitman/open-pstack). See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
