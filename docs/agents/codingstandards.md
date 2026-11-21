# Coding Standards (Layer 4 Steering + Layer 2 Promotion Candidates)

Enforced during `/hybrid-ship` and continuously promoted into hard Layer-2 CI rules (`scripts/check-boundaries.mjs` / linters) during weekly `/hybrid-retro` runs.

## 1. Architecture, Colocation & Deep Modules
- **Feature colocation:** Place all code belonging to a feature inside `src/features/<feature>/` and expose only a narrow public `index` interface. Never deep-import into a sibling feature's internals.
- **Deep modules over shallow wrappers:** Hide real complexity behind simple public interfaces. Avoid pass-through files and fragmented micro-helpers.
- **Process/layer isolation:** Never import server/main/filesystem code into client/renderer UI layers.
- **Ubiquitous language:** Every symbol, table, route, and test must match `GLOSSARY.md`.

## 2. Anti-Slop & Minimal Diffs
- **Ban narrating/historical AI comments:** Never write comments like `// updated per user feedback` or `// fixed bug where...`. Code explains *what* via clear naming; durable *why* belongs in `docs/adr/` or commit messages.
- **Subtract before adding:** Delete dead compatibility paths and unused helpers instead of bolting on defensive guards.
- **Atomic PRs:** Keep PRs focused on a single verifiable unit (typically 50–600 lines) with zero unrelated formatting churn.

## 3. Strict Typing & Boundary Validation
- **TypeScript:** Zero `any`, zero unexplained `@ts-ignore` / `@ts-nocheck`, zero unsafe type assertions at I/O boundaries.
- **Python:** Full type hints on public interfaces and domain models; no bare `except:` and no unexplained `# type: ignore`.
- **Validate external inputs:** Parse HTTP payloads, webhooks, env vars, and CLI args at the module boundary with explicit schemas.

## 4. Behavioral Verification & Testing
- **Test behavior, not implementation:** Assert observable outcomes through the module's public interface so refactors do not cause test churn.
- **Zero mock theatre:** Do not write tests that primarily assert mocks were invoked. Use real boundary fakes or in-memory test instances.
- **Red-green bug fixes:** Every bug fix requires a failing reproduction test or live verification trace first.
