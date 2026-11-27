import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "library.json"), "utf8"));
let failures = 0;

for (const skill of manifest.skills) {
  const skillFile = path.join(root, "plugins", "engineering-harness", "skills", skill, "SKILL.md");
  if (fs.existsSync(skillFile)) {
    console.log(`[OK] ${skill}`);
  } else {
    console.error(`[FAIL] Missing: ${skill}`);
    failures++;
  }
}

for (const file of [
  "AGENTS.md",
  "GLOSSARY.md",
  "FEATURE_MAP.md",
  "README.md",
  "LICENSE",
  "CREDITS.md",
  "library.json",
  "plugins/engineering-harness/plugin.json",
  "upstream/sources.json",
  "scripts/validate-skills.py",
  "scripts/sync-upstreams.ps1",
  ".github/workflows/validate.yml",
  ".github/workflows/deterministic-ci.yml",
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
