# Domain Glossary (Ubiquitous Language)

Every entity, state, and action below must use the **exact same term** across the database, backend, frontend, API, tests, `FEATURE_MAP.md`, and prompts.

> Maintained inline during `/hybrid-grill`. Never coin synonyms when a canonical term already exists here.

## Core Entities

| Canonical Term | Definition | Avoid / Deprecated Synonyms | Feature Directory (`src/features/...`) |
| :--- | :--- | :--- | :--- |
| _Example: Workspace_ | _Top-level tenant owning projects and members._ | _Org, Account, Team_ | _`src/features/workspace/`_ |

## Lifecycle States

| Entity | State | Meaning | Valid Transitions |
| :--- | :--- | :--- | :--- |
| _Example: Spec_ | _`draft`_ | _Under active grilling; not yet ticketed._ | _`draft` -> `approved`_ |

## Domain Invariants
- _List business/technical invariants that must ALWAYS remain true (and note which Layer-2 CI rule or test enforces them)._
