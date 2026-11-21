# Upstream skill updates

Every Monday at 11:00 UTC, the **Upstream skill sync** workflow checks the default branches of `mattpocock/skills` and `ericlitman/open-pstack`. Run it immediately with **Actions -> Weekly upstream skill sync -> Run workflow**.

The workflow merges non-conflicting edits from the mapped skill directories in `tools/maintainers/upstream-sources.json`, rebuilds the factory ZIP, and opens or updates a draft PR. Existing local edits are preserved with a three-way merge. Conflicts and upstream removals are reported for manual review; new or alternate skills are placed in `upstream-review/` as non-installable candidates. Matt's TDD skill is review-only because this library currently uses the Open PStack TDD version.

Before opening or updating its PR, the workflow runs sync tests, the library verifier, boundary checks, and a factory ZIP rebuild. It then dispatches deterministic CI against the published update branch so checks attach to the PR. It never auto-merges. Review behavior, licensing, and generated conflict candidates before merging.

The job reads public upstream files and uses the built-in `GITHUB_TOKEN` for API rate limits, branch updates, draft PRs, and CI dispatch. It requests `actions: write`, `contents: write`, and `pull-requests: write`. In repository settings, allow GitHub Actions to create pull requests if that option is disabled. No personal access token or model API key is required.

Update the source map when the upstream skill layout changes. Keep adapted Hybrid skills out of `sync` unless their upstream source and merge behavior are explicit.
