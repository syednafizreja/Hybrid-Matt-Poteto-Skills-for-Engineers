# Domain Glossary (Ubiquitous Language)

Use exact canonical terms across code, schemas, UI, tests, `FEATURE_MAP.md`, and prompts.

Maintained inline during `/hybrid-grill`.

## Core Entities

| Canonical Term | Definition | Avoid / Deprecated Synonyms | Feature Directory (`src/features/...`) |
| :--- | :--- | :--- | :--- |
| _Example: Workspace_ | _Top-level tenant owning projects and bots._ | _Org, Account, Teams_ | _`src/features/workspace/`_ |

## Lifecycle States

| Entity | State | Meaning | Valid Transitions |
| :--- | :--- | :--- | :--- |
| _Example: Spec_ | _`draft`_ | _Under active grilling; not yet ticketed._ | _`draft` -> `approved`_ |

## Domain Invariants
- List invariants that must always hold and the hard check that enforces each one.
