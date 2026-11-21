# Hybrid AI Engineering System — Operating Rules

This repository runs a unified **Matt Pocock + Lauren Tan** engineering workflow inside **VS Code + Grok Bot**.
Our core objective: **less code, deeper modules, hard deterministic guardrails, real runtime proof, and fearless parallelism**.

---

## 1. The 5-Layer Enforcement Stack (Strongest to Softest)

Soft rules rot as repositories grow. Push every recurring invariant as far **up** this stack as possible:

1. **Layer 1 — Architecture & Feature Colocation (Hard):** Organize code into feature-colocated directories (`src/features/<feature>/`) and **deep modules** (`codebase-design`) with small, stable public interfaces. Make the shortest path for an agent the best path.
2. **Layer 2 — Static Analysis & Boundary CI (Hard — Makes CI Red):** Strict compiler/type checks, linters, and `scripts/check-boundaries.mjs` (enforces directory import isolation and bans agent footguns & narrating comments).
3. **Layer 3 — Real-Artifact Runtime Verification (Hard — Proves Behavior):** Execute the real application via `.grok/skills/verify-app/SKILL.md` and `FEATURE_MAP.md` (Playwright/CDP, CLI, traces, or integration tests). *"It compiles"* is **not** proof.
4. **Layer 4 — Soft Steering & Domain Docs:** `AGENTS.md`, `GLOSSARY.md`, `FEATURE_MAP.md`, `docs/adr/`, and `docs/agents/codingstandards.md`.
5. **Layer 5 — Adversarial Multi-Axis Review:** `/hybrid-ship` (Spec + Architecture + Runtime Proof + Security) with cross-model review on high-stakes changes.

---

## 2. Non-Negotiable Engineering Principles

- **Read Before Guessing (`/hybrid-investigate`):** Never claim a "smoking gun" or guess a root cause without reading the affected files, Git history, and live runtime behavior first.
- **Prove It Works:** Verify fixes and features on the **exact surface** where the user experiences them. Include authentic failing -> passing output in the PR.
- **Stay in the Smart Zone (`<150k` tokens):** Keep single-task sessions small and focused. If work exceeds one clean session, run `/hybrid-plan` to slice into `<150k`-token tracer-bullet tickets and run `/hybrid-build` in isolated Git worktrees (`.worktrees/`).
- **Sequence into Verifiable Units:** Ship small, atomic, revertible PRs (typically 50–600 lines) rather than monolithic diffs so `git history` stays clean and rollbacks are trivial.
- **Subtract Before Adding (`unslop`):** Delete dead paths, duplicate helpers, and narrating AI comments instead of stacking defensive workarounds.
- **Candor Over Sycophancy:** If a proposed scope or design does not earn its place, push back directly with concrete trade-offs.
- **Pareto-Frontier Effort Discipline (`docs/agents/model-routing.md`):** Use **medium** reasoning effort for codebase exploration and routine implementation; escalate to **high** effort only for runtime verification, hard bug diagnosis, security review, and blind skill evals.

---

## 3. Unified Slash-Command Workflow

- `/hybrid-init` — One-time repo bootstrap: detects stack, wires issue tracker, populates `FEATURE_MAP.md` & `verify-app`.
- `/hybrid-investigate` — Root-cause investigation (`/how` + `/why` + live repro + "already fixed on `main`?" check).
- `/hybrid-grill` — Interactive alignment interview; sharpens ubiquitous language in `GLOSSARY.md` and records `docs/adr/`.
- `/hybrid-plan` — Converts an agreed plan into a GitHub Spec + `<150k`-token tracer-bullet sub-issues with blocking edges.
- `/hybrid-build` — Executes tickets in isolated `.worktrees/` using `/tdd`, verifies via `verify-app`, and cleans with `/unslop`.
- `/hybrid-ship` — Runs 4-axis adversarial review, verifies CI + `check-boundaries.mjs`, and opens a Merge Danger PR.
- `/hybrid-retro` — Turns recurring review comments into Layer-2 CI rules, refactors hotspots, and runs blind skill evals.
- `/handoff` — Compacts a session into a crisp handoff file when approaching the `150k` smart-zone ceiling.

---

## 4. Mandatory Deterministic Verification Command

Update this command in `/hybrid-init` to match your repository's stack:
```bash
# Node/TypeScript default:
npm run typecheck --if-present && npm run lint --if-present && npm test --if-present && node scripts/check-boundaries.mjs

# Python default:
# ruff check . && mypy . && pytest -q && node scripts/check-boundaries.mjs
```
No task is complete until both this deterministic command **and** the matching runtime check in `.grok/skills/verify-app/SKILL.md` pass.

---

## 5. Merge Danger Classification (Required on Every PR)

Every Pull Request must declare:
1. **Door Type:**
   - `Two-Way Door` — Easily reversible via `git revert`; zero destructive state migrations or external side effects.
   - `One-Way Door` — Schema/data migration, auth/permissions, billing, secrets/infra, CI/guardrail changes, or external notifications.
2. **Blast Radius:** `Small` | `Medium` | `Large`
3. **Runtime Proof:** Exact test diff (`fail -> pass`), CLI trace, or UI screenshot proving runtime correctness.
