#!/usr/bin/env node
/**
 * Layer-2 Deterministic Architecture & Anti-Slop Guard (Unified Dune + Pocock CI Check)
 *
 * Enforces hard codebase constraints in CI so agents cannot drift into slop:
 *   1. Cross-layer import boundaries (e.g., UI/client cannot import server/main/fs).
 *   2. Feature colocation encapsulation (features import sibling public index, not internal files).
 *   3. Banned AI footguns (explicit TypeScript `any`, unexplained `@ts-ignore`, narrating AI comments).
 *
 * Customize CONFIG below for your repository's folder structure.
 * Exit code 0 = clean, Exit code 1 = violations found (fails CI).
 */

import fs from "node:fs";
import path from "node:path";

const TARGET_ROOT = path.resolve(process.argv[2] || process.cwd());

const CONFIG = {
  extensions: new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".py"]),

  ignoreDirs: new Set([
    "node_modules", ".git", ".worktrees", "dist", "build", ".next",
    ".venv", "venv", "__pycache__", "coverage", ".grok", "docs"
  ]),

  // 1. Forbidden cross-layer imports (path prefix -> array of forbidden import substrings)
  forbiddenImports: [
    { fromDir: "src/renderer", forbid: ["src/main", "../main", "electron-main", "node:fs", "fs", "child_process"] },
    { fromDir: "src/client",   forbid: ["src/server", "../server", "prisma", "pg"] },
    { fromDir: "src/domain",   forbid: ["src/ui", "src/renderer", "react"] },
  ],

  // 2. Feature colocation boundary: src/features/<A> cannot deep-import src/features/<B>/<internal>
  featuresRoot: "src/features",

  // 3. Banned AI footgun patterns
  bannedPatterns: [
    {
      name: "narrating-ai-comment",
      regex: /\/\/\s*(?:TODO\(ai\)|NOTE:\s*(?:user|lauren|matt|claude|grok)\s+said|we\s+(?:changed|updated|removed|fixed)\s+this\s+because\s+(?:earlier|previously))/i,
      message: "Avoid historical/conversational AI narrating comments; record durable decisions in docs/adr/ instead."
    },
    {
      name: "ts-any-escape",
      extensions: [".ts", ".tsx"],
      regex: /(?::\s*any|as\s+any)/,
      message: "Explicit `any` is banned. Use `unknown` + type narrowing or a validated schema."
    },
    {
      name: "ts-ignore-unexplained",
      extensions: [".ts", ".tsx"],
      regex: /@ts-(?:ignore|nocheck)(?!\s+--\s+\S)/,
      message: "`@ts-ignore` / `@ts-nocheck` is banned without an explicit `-- <justification>`."
    },
    // Optional React strictness (Lauren Tan's Dune rule — uncomment when ready):
    // {
    //   name: "banned-use-effect",
    //   extensions: [".ts", ".tsx", ".js", ".jsx"],
    //   regex: /useEffect\s*\(/,
    //   message: "Raw `useEffect` is banned. Use event handlers, derived state, or framework data hooks."
    // },
  ],
};

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (CONFIG.ignoreDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, results);
    } else if (CONFIG.extensions.has(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

function extractImports(content) {
  const imports = [];
  const patterns = [
    /import\s+(?:[^'"]+from\s+)?['"]([^'"]+)['"]/g,
    /require\(\s*['"]([^'"]+)['"]\s*\)/g,
    /from\s+([a-zA-Z0-9_.]+)\s+import/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(content)) !== null) {
      imports.push(m[1]);
    }
  }
  return imports;
}

const violations = [];
const files = walk(TARGET_ROOT);

for (const absFile of files) {
  const relFile = path.relative(TARGET_ROOT, absFile).replace(/\\/g, "/");
  if (relFile === "scripts/check-boundaries.mjs") continue;

  const ext = path.extname(absFile);
  const content = fs.readFileSync(absFile, "utf8");
  const lines = content.split(/\r?\n/);
  const imports = extractImports(content);

  // Check 1: Cross-layer imports
  for (const rule of CONFIG.forbiddenImports) {
    if (relFile.startsWith(rule.fromDir + "/")) {
      for (const imp of imports) {
        for (const bad of rule.forbid) {
          if (imp === bad || imp.includes(bad)) {
            violations.push(`${relFile}: Forbidden cross-layer import '${imp}' inside '${rule.fromDir}'`);
          }
        }
      }
    }
  }

  // Check 2: Cross-feature deep imports
  if (relFile.startsWith(CONFIG.featuresRoot + "/")) {
    const ownFeature = relFile.slice(CONFIG.featuresRoot.length + 1).split("/")[0];
    for (const imp of imports) {
      const deepSibling = imp.match(/features\/([^/]+)\/(.+)/);
      if (deepSibling && deepSibling[1] !== ownFeature && deepSibling[2] !== "index") {
        violations.push(
          `${relFile}: Deep import '${imp}' reaches into sibling feature '${deepSibling[1]}'. Import its public index instead.`
        );
      }
    }
  }

  // Check 3: Banned patterns
  for (const rule of CONFIG.bannedPatterns) {
    if (rule.extensions && !rule.extensions.includes(ext)) continue;
    lines.forEach((line, idx) => {
      if (rule.regex.test(line)) {
        violations.push(`${relFile}:${idx + 1} [${rule.name}] ${rule.message}`);
      }
    });
  }
}

if (violations.length > 0) {
  console.error(`Boundary & Anti-Slop Check FAILED (${violations.length} violation(s)):
`);
  for (const v of violations) {
    console.error(`  - ${v}`);
  }
  process.exit(1);
} else {
  console.log(`Boundary & Anti-Slop Check PASSED (${files.length} file(s) scanned, 0 violations).`);
}
