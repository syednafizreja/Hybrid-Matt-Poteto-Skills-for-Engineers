#!/usr/bin/env node
/**
 * Layer-2 guard for cross-layer imports, feature boundaries, and common code footguns.
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
  forbiddenImports: [
    { fromDir: "src/renderer", forbid: ["src/main", "../main", "electron-main", "node:fs", "fs", "child_process"] },
    { fromDir: "src/client", forbid: ["src/server", "../server", "prisma", "pg"] },
    { fromDir: "src/domain", forbid: ["src/ui", "src/renderer", "react"] },
  ],
  featuresRoot: "src/features",
  bannedPatterns: [
    {
      name: "narrating-ai-comment",
      regex: /\/\/\s*(?:TODO\(ai\)|NOTE:\s*(?:user|lauren|matt|claude|grok)\s+said|we\s+(?:changed|updated|removed|fixed)\s+this\s+because\s+(?:earlier|previously))/i,
      message: "Remove historical/conversational AI comments; put durable decisions in docs/adr/."
    },
    {
      name: "ts-any-escape",
      extensions: [".ts", ".tsx"],
      regex: /(?::\s*any\b|\bas\s+any\b)/,
      message: "Explicit any is banned. Use unknown + narrowing or a typed schema."
    },
    {
      name: "ts-ignore-unexplained",
      extensions: [".ts", ".tsx"],
      regex: /@ts-(?:ignore|nocheck)(?!\s+--\s+\S)/,
      message: "@ts-ignore / @ts-nocheck requires an explicit -- <justification>."
    },
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
    let match;
    while ((match = re.exec(content)) !== null) {
      imports.push(match[1]);
    }
  }
  return imports;
}

function maskQuotedStrings(line) {
  return line.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g, " ");
}

function codeWithoutComments(line) {
  return maskQuotedStrings(line).replace(/\/\/.*|\/\*.*?\*\//g, " ");
}

function commentsWithoutStrings(line) {
  return maskQuotedStrings(line).match(/\/\/.*|\/\*.*?\*\//g)?.join(" ") || "";
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

  for (const rule of CONFIG.forbiddenImports) {
    if (!relFile.startsWith(rule.fromDir + "/")) continue;
    for (const imp of imports) {
      for (const bad of rule.forbid) {
        if (imp === bad || imp.includes(bad)) {
          violations.push(`${relFile}: Forbidden import '${imp}' in '${rule.fromDir}'`);
        }
      }
    }
  }

  if (relFile.startsWith(CONFIG.featuresRoot + "/")) {
    const ownFeature = relFile.slice(CONFIG.featuresRoot.length + 1).split("/")[0];
    for (const imp of imports) {
      const deepSibling = imp.match(/features\/([^/]+)\/(.+)/);
      if (deepSibling && deepSibling[1] !== ownFeature && deepSibling[2] !== "index") {
        violations.push(
          `${relFile}: Deep import '${imp}' into sibling feature '${deepSibling[1]}'; use its public index.`
        );
      }
    }
  }

  for (const rule of CONFIG.bannedPatterns) {
    if (rule.extensions && !rule.extensions.includes(ext)) continue;
    lines.forEach((line, idx) => {
      const source = rule.name === "narrating-ai-comment" || rule.name === "ts-ignore-unexplained"
        ? commentsWithoutStrings(line)
        : codeWithoutComments(line);
      if (rule.regex.test(source)) {
        violations.push(`${relFile}:${idx + 1} [${rule.name}] ${rule.message}`);
      }
    });
  }
}

if (violations.length > 0) {
  console.error(`Boundary & Anti-Slop Check FAILED (${violations.length} violation(s)):\n`);
  for (const violation of violations) {
    console.error(`  - ${violation}`);
  }
  process.exit(1);
}

console.log(`Boundary & Anti-Slop Check PASSED (${files.length} file(s) scanned, 0 violations).`);
