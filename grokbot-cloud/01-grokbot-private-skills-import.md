# Sync Hybrid Skills into Grok Bot Private Skills (Optional Cloud Layer)

When working locally in **VS Code**, Grok reads `.grok/skills/*/SKILL.md` directly from your repository—no extra import needed.

If you also use the **Grok Bot desktop / cloud app** for always-on background Bots (`@Benny`, `@Gardener`, `@Evaluator`), paste this prompt into a Grok Bot chat after connecting GitHub:

```text
Read my repository [OWNER/REPO] (branch `main`), specifically all 12 skill files under `.grok/skills/*/SKILL.md` and `AGENTS.md`.

Save all 12 unified skills into my Grok Bot Private skills library, preserving each skill's exact slug, description, and instructions:
1. hybrid-init
2. hybrid-investigate
3. hybrid-grill
4. hybrid-plan
5. hybrid-build
6. hybrid-ship
7. hybrid-retro
8. verify-app
9. codebase-design
10. tdd
11. unslop
12. handoff

After saving them, confirm each skill name and remind me which ones to enable under Connect apps -> Private skills for @Architect, @Builder, @Benny, @Gardener, and @Evaluator.
```
