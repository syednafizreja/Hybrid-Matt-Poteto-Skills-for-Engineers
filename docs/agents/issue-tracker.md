# Issue Tracker Configuration

Used by `/hybrid-init`, `/hybrid-plan`, `/hybrid-build`, and `@Benny`.

- **Provider:** GitHub Issues
- **Repository:** `[OWNER/REPO]` *(populated by `/hybrid-init`)*
- **CLI Tool:** `gh` (GitHub CLI)
- **Specs:** Parent GitHub Issues labeled `spec`.
- **Tickets:** GitHub Sub-Issues linked under their parent Spec, labeled `ticket`.
- **Dependencies:** Declare blocking issues under `## Blocked By` (`- #<num>`) and link native GitHub blocking relationships.
- **Sizing:** Each ticket must be a vertical, verifiable tracer-bullet slice executable inside a single `<150k` token session and deliverable as an atomic PR.
