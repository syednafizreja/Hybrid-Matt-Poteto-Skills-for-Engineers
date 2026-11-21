<div align="center">
  <h1>Hybrid AI Engineering Factory</h1>
  <p><strong>One evidence-first workflow. Twelve native Grok Bot skills.</strong></p>
  <p>Grok Bot in VS Code factory; portable Agent Skills catalog in the full repository.</p>
  <p>
    <a href="#licensing-and-attribution"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-14b8a6.svg"></a>
    <a href="https://agentskills.io"><img alt="Agent Skills compatible" src="https://img.shields.io/badge/Agent%20Skills-compatible-2563eb.svg"></a>
  </p>
</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers/main/assets/hybrid-hero.svg" alt="An engineering workflow for AI coding agents: understand, plan, build, and prove." width="100%">
</p>

> **For engineers:** investigate real code, make focused changes, and prove behavior before shipping.

## Why this hybrid

Matt Pocock's engineering skills and Lauren Tan's PStack/GrokBot/Dune workflows bring complementary strengths: precise specifications, test-first implementation, verifiable sequencing, isolated worktrees, and real runtime proof. This factory combines them into one vocabulary and one review path instead of installing overlapping packs side by side.

The result is a focused 12-skill Grok Bot set, a seven-command delivery loop, and five enforcement layers. Layers 1–3 are hard architecture, CI, and runtime checks; Layers 4–5 add domain steering and adversarial review.

## The seven-command loop

| Command | Merged strengths | What it does |
|---|---|---|
| `/hybrid-init` | Matt setup skills + PStack setup + verification bootstrap | Detects the project stack and Git remote; bootstraps `AGENTS.md`, issue tracking, `FEATURE_MAP.md`, and `verify-app`. |
| `/hybrid-investigate` | Matt diagnosing-bugs + Lauren `/how` and `/why` | Reads code, history, and architecture docs before forming a hypothesis; checks for an existing fix and reproduces bugs. |
| `/hybrid-grill` | Matt grill-with-docs/domain-modeling/wayfinder + Lauren `/interrogate` | Resolves ambiguity, updates `GLOSSARY.md` and ADRs, and challenges high-stakes designs. |
| `/hybrid-plan` | Matt to-spec/to-tickets + Lauren sequence-verifiable-units | Turns an agreed design into a GitHub spec and vertical tickets sized for a `<150k`-token session and atomic PR. |
| `/hybrid-build` | Matt implement-spec/TDD + PStack poteto-mode/verify-app | Executes work in isolated `.worktrees/`, uses behavioral TDD, verifies the real app, and removes diff slop. |
| `/hybrid-ship` | Matt code-review/PR + PStack four-axis review | Reviews spec fidelity, architecture, runtime proof, and security; checks CI and classifies Merge Danger. |
| `/hybrid-retro` | Matt retro/architecture improvement + blind skill evaluation | Promotes recurring review feedback into hard checks and improves skills through blind evaluation. |

**Supporting skills:** `verify-app`, `codebase-design`, `tdd`, `unslop`, and `handoff`.

## Five-layer enforcement

1. **Architecture:** feature colocation, deep modules, and narrow public interfaces.
2. **Static checks:** type, lint, test, and import-boundary rules that make CI fail on violations.
3. **Runtime proof:** exercise the real app or integration surface using `FEATURE_MAP.md`.
4. **Domain steering:** `AGENTS.md`, `GLOSSARY.md`, ADRs, and coding standards.
5. **Adversarial review:** `/hybrid-ship` checks scope, architecture, runtime evidence, and security.

## Install

### Quickstart in VS Code

Save the unzipped [`grokbot-vscode-hybrid-factory-v3.zip`](grokbot-vscode-hybrid-factory-v3.zip) as your permanent template repository so the workflow is easy to reuse. Open it in VS Code and push it to a GitHub repository you own.

Install into any project repository from Git Bash or the VS Code terminal:

```bash
cd /path/to/your/project
chmod +x /path/to/grokbot-vscode-hybrid-factory/install.sh
/path/to/grokbot-vscode-hybrid-factory/install.sh .
./verify-setup.sh
```

Initialize once per project with `/hybrid-init`, then run `/hybrid-grill` -> `/hybrid-plan` -> `/hybrid-build` -> `/hybrid-ship` -> `/hybrid-retro` in Grok Bot or Grok Build.

### Make the bundle your GitHub template

Unzip the factory, then push the folder to a repository you own:

```bash
git init -b main
git add .
git commit -m "Create Grok Bot engineering template"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Enable **Settings -> General -> Template repository**. New projects can use the template directly; existing projects use the installer above.

### Claude, Codex, Copilot, Gemini, and other agents

Use the full repository's Agent Skills catalog to choose skills and supported agents interactively:

```bash
npx skills@latest add syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers
```

Requires Node.js 22.20 or later.

Install all skills to all supported agents with `--all`, or target one skill and agent:

```bash
npx skills@latest add syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers --all
npx skills@latest add syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers --skill tdd --agent codex
```

Add `-g` for a global install. See the [live agent list](https://github.com/vercel-labs/skills/blob/main/docs/agents.md).

## Factory ZIP v3 contents (34 files)

```text
grokbot-vscode-hybrid-factory/
├── README.md
├── install.sh
├── verify-setup.sh
├── AGENTS.md
├── CLAUDE.md
├── GLOSSARY.md
├── FEATURE_MAP.md
├── .vscode/
│   ├── settings.json
│   └── tasks.json
├── .grok/skills/
│   ├── hybrid-init/SKILL.md
│   ├── hybrid-investigate/SKILL.md
│   ├── hybrid-grill/SKILL.md
│   ├── hybrid-plan/SKILL.md
│   ├── hybrid-build/SKILL.md
│   ├── hybrid-ship/SKILL.md
│   ├── hybrid-retro/SKILL.md
│   ├── verify-app/SKILL.md
│   ├── codebase-design/SKILL.md
│   ├── tdd/SKILL.md
│   ├── unslop/SKILL.md
│   └── handoff/SKILL.md
├── scripts/check-boundaries.mjs
├── docs/
│   ├── adr/0000-adr-template.md
│   └── agents/
│       ├── codingstandards.md
│       ├── issue-tracker.md
│       ├── triage-labels.md
│       ├── model-routing.md
│       └── eval-rubric-template.md
├── grokbot-cloud/
│   ├── 01-grokbot-private-skills-import.md
│   ├── 02-bot-roster-profiles.md
│   ├── 03-routines.md
│   └── 04-trust-ladder.md
└── .github/
    ├── pull_request_template.md
    └── workflows/deterministic-ci.yml
```

The cloud routines are optional. The local VS Code workflow works without Grok Bot Cloud.

## Upstream updates

The full repository checks Matt Pocock and Open PStack weekly and opens a draft PR for human review; it never auto-merges. The PR also refreshes this 34-file ZIP. See the [sync policy](https://github.com/syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers/blob/main/.github/UPSTREAM_SYNC.md). Run `npx skills@latest update` to update CLI-installed skills.

## Licensing and attribution

The hybrid factory is MIT licensed. Adapted portions from [Matt Pocock's skills](https://github.com/mattpocock/skills) and [Open PStack](https://github.com/ericlitman/open-pstack) retain their MIT notices. The full repository also keeps these notices in `THIRD_PARTY_NOTICES.md`.

<details>
<summary>MIT license texts included with the factory</summary>

<!-- HYBRID-THIRD-PARTY-NOTICES:BEGIN -->
### Hybrid AI Engineering Factory

```text
MIT License

Copyright (c) 2026 Syed Nafiz Reja

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Matt Pocock skills

Source: <https://github.com/mattpocock/skills>

```text
MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Open PStack

Source: <https://github.com/ericlitman/open-pstack>

```text
MIT License

Copyright (c) 2026 Lauren Tan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
<!-- HYBRID-THIRD-PARTY-NOTICES:END -->

</details>
