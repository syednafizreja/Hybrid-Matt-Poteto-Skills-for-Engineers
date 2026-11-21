import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "library.json"), "utf8"));
let failures = 0;

for (const skill of manifest.skills) {
  const skillFile = path.join(root, "skills", skill, "SKILL.md");
  if (fs.existsSync(skillFile)) {
    console.log(`[OK] ${skill}`);
  } else {
    console.error(`[FAIL] Missing: ${skill}`);
    failures++;
  }
}

for (const guide of manifest.guides ?? []) {
  if (fs.existsSync(path.join(root, guide))) {
    console.log(`[OK] ${guide}`);
  } else {
    console.error(`[FAIL] Missing: ${guide}`);
    failures++;
  }
}

for (const file of [
  "AGENTS.md",
  "CLAUDE.md",
  "GLOSSARY.md",
  "FEATURE_MAP.md",
  "README.md",
  "LICENSE",
  "THIRD_PARTY_NOTICES.md",
  "install.sh",
  "verify-install.sh",
  "verify-setup.sh",
  "CREDITS.md",
  "grokbot-vscode-hybrid-factory-v3.zip",
  "assets/hybrid-hero.svg",
  ".grok/skills/hybrid-build/SKILL.md",
  ".grok/skills/verify-app/SKILL.md",
  ".vscode/settings.json",
  ".vscode/tasks.json",
  "docs/adr/0000-adr-template.md",
  "docs/agents/codingstandards.md",
  ".github/pull_request_template.md",
  ".github/workflows/deterministic-ci.yml",
  ".github/workflows/upstream-sync.yml",
  ".github/UPSTREAM_SYNC.md",
  "scripts/check-boundaries.mjs",
  "tools/maintainers/upstream-sources.json",
  "tools/maintainers/upstream-state.json",
  "tools/maintainers/upstream-sync-core.mjs",
  "tools/maintainers/sync-upstream-skills.mjs",
  "tools/maintainers/build-factory-zip.py",
  "tools/maintainers/upstream-sync.test.mjs",
  "upstream-review/README.md",
]) {
  if (fs.existsSync(path.join(root, file))) {
    console.log(`[OK] ${file}`);
  } else {
    console.error(`[FAIL] Missing: ${file}`);
    failures++;
  }
}

console.log(`Result: ${failures === 0 ? "PASS" : "FAIL"} (${failures} failures)`);
process.exitCode = failures === 0 ? 0 : 1;
