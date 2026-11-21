---
name: hybrid-plan
description: Converts an aligned conversation into a structured Spec and vertical tracer-bullet tickets sized to <150k tokens each, with explicit blocking edges and atomic PR boundaries.
---

# `/hybrid-plan` — Smart-Zone Spec & Tracer-Bullet Slicing

Keep every implementation agent firmly inside the **<150k token smart zone** and ensure every resulting PR is small, atomic, and cleanly revertible.

## Protocol

1. **Synthesize the Spec (`to-spec`):**
   - Capture Problem Statement, Non-Goals, Canonical Terms (`GLOSSARY.md`), Module Boundaries (`codebase-design`), Runtime Verification Criteria (`FEATURE_MAP.md`), and Merge Danger classification.
   - If GitHub Issues is configured in `docs/agents/issue-tracker.md`, create a parent GitHub Issue labeled `spec` via `gh issue create`; otherwise write `docs/specs/SPEC-YYYY-MM-DD-<slug>.md`.
2. **Slice into Vertical Tracer-Bullet Tickets (`to-tickets` + `sequence-verifiable-units`):**
   - Slice **vertically** (thin end-to-end working slices through UI/API/domain/tests), never horizontally ("all DB migrations first, all UI last").
   - **Hard Sizing Rule:** Every ticket must fit comfortably inside **one `<150k`-token session** and produce **one atomic PR (50–600 lines)** that passes deterministic CI on its own.
   - Declare explicit `## Blocked By` edges between tickets so `/hybrid-build` knows which tickets can run concurrently in parallel Git worktrees.
   - Tag each ticket with its individual Merge Danger (`door:two-way` vs `door:one-way` and `blast:small|medium|large`).
3. **Publish & Confirm:**
   - Create linked GitHub Sub-Issues labeled `ticket` (or numbered files in `docs/tickets/`) and print the dependency execution frontier ready for `/hybrid-build`.
