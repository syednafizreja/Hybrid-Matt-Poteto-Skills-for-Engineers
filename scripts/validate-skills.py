"""Validate harness manifests, skill frontmatter, line caps, and em dashes."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EM_DASH = "\u2014"
EXPECTED = {
    "research-flow",
    "numerical-engineering",
    "paper-writing",
    "prompt-engineer",
    "agentic-eval",
    "skill-sync",
}
JSON_FILES = (
    ".grok-plugin/marketplace.json",
    "plugins/engineering-harness/plugin.json",
    "upstream/sources.json",
)


def lines(path: Path) -> list[str]:
    return path.read_text(encoding="utf-8").splitlines()


def main() -> int:
    errors: list[str] = []

    agents = ROOT / "AGENTS.md"
    agent_lines = lines(agents)
    if len(agent_lines) > 70:
        errors.append(f"AGENTS.md has {len(agent_lines)} lines (max 70)")
    if EM_DASH in "\n".join(agent_lines):
        errors.append("AGENTS.md contains an em dash")

    claude = ROOT / "CLAUDE.md"
    if len(lines(claude)) > 10:
        errors.append(f"CLAUDE.md has {len(lines(claude))} lines (max 10)")

    for rel in JSON_FILES:
        path = ROOT / rel
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{rel}: {exc}")

    plugin_path = ROOT / "plugins/engineering-harness/plugin.json"
    if plugin_path.is_file():
        plugin = json.loads(plugin_path.read_text(encoding="utf-8"))
        if plugin.get("name") != "engineering-harness":
            errors.append("plugin.json name must be engineering-harness")

    skills_root = ROOT / "plugins/engineering-harness/skills"
    found = {p.name for p in skills_root.iterdir() if p.is_dir()}
    if found != EXPECTED:
        errors.append(f"skill directories {sorted(found)} != {sorted(EXPECTED)}")

    for name in sorted(EXPECTED):
        skill_md = skills_root / name / "SKILL.md"
        if not skill_md.is_file():
            errors.append(f"missing {skill_md.relative_to(ROOT)}")
            continue
        text = skill_md.read_text(encoding="utf-8")
        file_lines = text.splitlines()
        if len(file_lines) > 150:
            errors.append(f"{name}/SKILL.md has {len(file_lines)} lines (max 150)")
        if not text.startswith("---\n"):
            errors.append(f"{name}/SKILL.md is missing opening frontmatter")
            continue
        end = text.find("\n---\n", 4)
        if end < 0:
            errors.append(f"{name}/SKILL.md is missing closing frontmatter")
            continue
        data: dict[str, str] = {}
        for raw in text[4:end].splitlines():
            if not raw.strip():
                continue
            if ":" not in raw:
                errors.append(f"{name}/SKILL.md bad frontmatter line: {raw}")
                continue
            key, value = raw.split(":", 1)
            data[key.strip()] = value.strip().strip("\"'")
        for key in ("name", "description", "user-invocable"):
            if key not in data:
                errors.append(f"{name}/SKILL.md missing {key}")
        if data.get("name") != name:
            errors.append(f"{name}/SKILL.md name is {data.get('name')}")
        if data.get("user-invocable") != "true":
            errors.append(f"{name}/SKILL.md user-invocable must be true")
        word_count = len(data.get("description", "").split())
        if word_count > 25:
            errors.append(f"{name} description has {word_count} words (max 25)")

        for extra in (skills_root / name).rglob("*.md"):
            body = extra.read_text(encoding="utf-8")
            if EM_DASH in body:
                errors.append(f"{extra.relative_to(ROOT)} contains an em dash")

    if errors:
        for err in errors:
            print(f"ERROR {err}")
        return 1

    print(f"OK {len(EXPECTED)} skills, AGENTS.md {len(agent_lines)} lines")
    return 0


if __name__ == "__main__":
    sys.exit(main())
