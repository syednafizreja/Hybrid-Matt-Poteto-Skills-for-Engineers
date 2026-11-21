---
name: hybrid-investigate
description: Root-cause investigation combining Lauren Tan's /how + /why code-first exploration with Matt Pocock's gated bug diagnosis. Reads real code and tests live before guessing.
---

# `/hybrid-investigate` — Read-First & Runtime Root-Cause Investigation

Never guess, hallucinate a "smoking gun," or propose a fix before proving the root cause against real code and runtime behavior.

## Protocol

1. **Read the Code (`/how`):**
   - Check `GLOSSARY.md` and `FEATURE_MAP.md` to map user terms or screenshots to exact directories and entry points.
   - Read the actual implementation files, call chains, and boundary schemas—do not infer behavior from filenames alone.
2. **Check History & Decisions (`/why`):**
   - Run `git log -n 10 --oneline -- <affected-paths>` and check `docs/adr/` to see *why* the code is shaped this way so you do not re-introduce an old bug or violate an `Accepted` ADR.
3. **Reproduce on the Real Surface (`verify-app`):**
   - For bug reports, run `.grok/skills/verify-app/SKILL.md` at **high reasoning effort**:
     - First check latest `main`: if the bug no longer reproduces on `main`, capture the passing trace and report **"Already fixed on `main` — release needed"** instead of writing redundant code.
     - If reproduced on `main`, isolate the minimal failing input and write a failing automated reproduction test (`tdd`) before touching production code.
4. **Output a Crisp Investigation Brief:**
   - **Confirmed Root Cause** (exact `file:line` citations)
   - **Historical / ADR Context** (if any)
   - **Minimal Failing Repro** (test path or runtime trace)
   - **Merge Danger Assessment** (`Two-Way Door` vs `One-Way Door` + `Blast Radius`)
