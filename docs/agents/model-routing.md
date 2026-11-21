# Per-Role Model & Reasoning Effort Sheet (Pareto-Frontier Routing)

> Spend high reasoning effort where it buys trust (runtime verification, debugging, security, blind evals) and keep exploration and routine ticket execution fast and nimble on medium effort.

| Workflow Stage / Bot Role | Model Tier | Reasoning Effort | Rationale |
| :--- | :--- | :--- | :--- |
| **Codebase Exploration (`/hybrid-investigate` read phase)** | Fast Pareto-frontier (Grok 4.6 / Opus 5.5) | `medium` (or `low` for lookups) | Prevents blowing context early; stays in `<150k` smart zone |
| **Grilling & Spec Slicing (`/hybrid-grill`, `/hybrid-plan`)** | Primary frontier (Grok 4.6 or Opus 5.5) | `medium` | Crisp interactive alignment without over-verbosity |
| **Routine Implementation (`/hybrid-build`, `/tdd`)** | Primary coding model (Grok 4.6 or Opus 5.5) | `medium` | Layers 1–3 guardrails catch mistakes cheaply |
| **Runtime Verification & Bug Repro (`verify-app`, `@Benny`)** | Primary frontier | `high` | Must inspect traces/logs thoroughly and not stop early |
| **Contested Architecture Critique (`/hybrid-grill` panel)** | **Multi-model panel** (Grok 4.6 + Opus 5.5) | `medium`–`high` | Surfaces blind spots across model families |
| **Adversarial PR Gatekeeper (`/hybrid-ship`)** | **Different model family** from Builder when available | `high` | Eliminates single-model self-confirmation bias |
| **Blind Skill Eval Judge (`/hybrid-retro`)** | **Cross-model judge** (distinct from tested worker) | `high` | Objective rubric scoring without self-grading bias |
