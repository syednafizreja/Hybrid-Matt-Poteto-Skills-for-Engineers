import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isSafeRelativePath, mergeText, resolveInside, skillFilesInTree } from "./upstream-sync-core.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sourceManifestPath = path.join(root, "tools", "maintainers", "upstream-sources.json");
const statePath = path.join(root, "tools", "maintainers", "upstream-state.json");
const reportPath = path.join(root, ".github", "upstream-update-report.md");
const candidateRoot = "upstream-review";
const apiRoot = "https://api.github.com";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sourceIsUnderRoot(sourcePath, skillRoots) {
  return skillRoots.some((skillRoot) => sourcePath.startsWith(`${skillRoot}/`));
}

function validateConfiguration(config, state) {
  if (config.version !== 1 || !Array.isArray(config.sources)) {
    throw new Error("Unsupported upstream source manifest.");
  }

  if (state.version !== 1 || !state.sources || typeof state.sources !== "object") {
    throw new Error("Unsupported upstream state file.");
  }

  const repositories = new Set();
  for (const source of config.sources) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(source.repository) || repositories.has(source.repository)) {
      throw new Error(`Invalid or duplicate repository: ${source.repository}`);
    }
    repositories.add(source.repository);

    if (!Array.isArray(source.skillRoots) || !Array.isArray(source.sync) || !Array.isArray(source.reviewOnly)) {
      throw new Error(`Invalid source mapping for ${source.repository}.`);
    }

    for (const skillRoot of source.skillRoots) {
      if (!isSafeRelativePath(skillRoot)) {
        throw new Error(`Unsafe skill root in ${source.repository}: ${skillRoot}`);
      }
    }

    for (const mapping of source.sync) {
      if (
        !isSafeRelativePath(mapping.path) ||
        !isSafeRelativePath(mapping.destination) ||
        !sourceIsUnderRoot(mapping.path, source.skillRoots)
      ) {
        throw new Error(`Invalid sync mapping in ${source.repository}: ${JSON.stringify(mapping)}`);
      }
    }

    for (const mapping of source.reviewOnly) {
      if (
        !isSafeRelativePath(mapping.path) ||
        !sourceIsUnderRoot(mapping.path, source.skillRoots) ||
        !mapping.path.endsWith("/SKILL.md") ||
        typeof mapping.skill !== "string" ||
        typeof mapping.reason !== "string"
      ) {
        throw new Error(`Invalid review-only mapping in ${source.repository}: ${JSON.stringify(mapping)}`);
      }
    }

    const commit = state.sources[source.repository]?.commit;
    if (typeof commit !== "string" || !/^[0-9a-f]{40}$/.test(commit)) {
      throw new Error(`Missing or invalid base commit for ${source.repository}.`);
    }
  }
}

function apiHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: apiHeaders() });
  if (!response.ok) {
    throw new Error(`GitHub API request failed (${response.status}): ${url}`);
  }
  return response.json();
}

async function fetchRaw(repository, commit, sourcePath) {
  const encodedPath = sourcePath.split("/").map(encodeURIComponent).join("/");
  const url = `https://raw.githubusercontent.com/${repository}/${commit}/${encodedPath}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Upstream file request failed (${response.status}): ${url}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function getTree(repository, commit) {
  const tree = await fetchJson(`${apiRoot}/repos/${repository}/git/trees/${commit}?recursive=1`);
  if (tree.truncated) {
    throw new Error(`Upstream tree was truncated for ${repository}@${commit}.`);
  }
  return new Map(tree.tree.filter((entry) => entry.type === "blob").map((entry) => [entry.path, entry]));
}

async function getLatest(repository) {
  const metadata = await fetchJson(`${apiRoot}/repos/${repository}`);
  const branch = encodeURIComponent(metadata.default_branch);
  const commit = await fetchJson(`${apiRoot}/repos/${repository}/commits/${branch}`);
  return { branch: metadata.default_branch, commit: commit.sha };
}

function pathIsWithin(pathname, prefix) {
  return pathname.startsWith(`${prefix}/`);
}

function treePaths(tree, prefix) {
  return [...tree.keys()].filter((pathname) => pathIsWithin(pathname, prefix));
}

function repositorySlug(repository) {
  return repository.replace("/", "-");
}

function skillSlugFromSkillFile(pathname) {
  return path.posix.basename(path.posix.dirname(pathname));
}

function candidatePath(repository, skill, commit, relativePath) {
  return `${candidateRoot}/${repositorySlug(repository)}/${skill}/${commit}/${relativePath}`;
}

function writeFileIfChanged(filePath, content, mode) {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath) : null;
  if (current?.equals(content)) {
    return false;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, mode === "100755" ? { mode: 0o755 } : undefined);
  return true;
}

function sourceLink(repository, commit, sourcePath) {
  return `https://github.com/${repository}/blob/${commit}/${sourcePath}`;
}

async function syncDestination({
  repository,
  skill,
  sourcePath,
  candidateRelativePath,
  targetPath,
  baseEntry,
  latestEntry,
  baseCommit,
  latestCommit,
  result,
  dryRun,
  allowMissingLocal = false,
}) {
  const targetFile = resolveInside(root, targetPath);
  const incoming = await fetchRaw(repository, latestCommit, sourcePath);

  if (!baseEntry) {
    if (fs.existsSync(targetFile)) {
      result.conflicts.push({ sourcePath, targetPath, reason: "new upstream file collides with an existing local file" });
      writeCandidate(repository, skill, latestCommit, candidateRelativePath, incoming, dryRun);
      result.sourceBlocked = true;
      return;
    }

    if (!dryRun) {
      writeFileIfChanged(targetFile, incoming, latestEntry.mode);
    }
    result.applied.push({ sourcePath, targetPath, action: "added" });
    return;
  }

  const base = await fetchRaw(repository, baseCommit, sourcePath);
  if (!fs.existsSync(targetFile)) {
    if (allowMissingLocal) {
      if (!dryRun) {
        writeFileIfChanged(targetFile, incoming, latestEntry.mode);
      }
      result.applied.push({ sourcePath, targetPath, action: "added" });
      return;
    }
    result.conflicts.push({ sourcePath, targetPath, reason: "local file is missing" });
    writeCandidate(repository, skill, latestCommit, candidateRelativePath, incoming, dryRun);
    result.sourceBlocked = true;
    return;
  }

  if (baseEntry.mode !== latestEntry.mode) {
    result.conflicts.push({ sourcePath, targetPath, reason: "upstream file mode changed" });
    writeCandidate(repository, skill, latestCommit, candidateRelativePath, incoming, dryRun);
    result.sourceBlocked = true;
    return;
  }

  const local = fs.readFileSync(targetFile);
  if (local.equals(incoming)) {
    result.applied.push({ sourcePath, targetPath, action: "already current" });
    return;
  }

  let merged;
  if (local.equals(base)) {
    merged = { status: "merged", content: incoming };
  } else {
    merged = mergeText(base, local, incoming);
  }

  if (merged.status !== "merged") {
    result.conflicts.push({ sourcePath, targetPath, reason: merged.status });
    writeCandidate(repository, skill, latestCommit, candidateRelativePath, incoming, dryRun);
    result.sourceBlocked = true;
    return;
  }

  if (!dryRun && writeFileIfChanged(targetFile, merged.content, latestEntry.mode)) {
    result.applied.push({ sourcePath, targetPath, action: "merged" });
  } else {
    result.applied.push({ sourcePath, targetPath, action: "already current" });
  }
}

function writeCandidate(repository, skill, commit, relativePath, content, dryRun) {
  const candidateFile = resolveInside(root, candidatePath(repository, skill, commit, relativePath));
  if (!dryRun) {
    writeFileIfChanged(candidateFile, content);
  }
}

async function reviewCandidate({
  repository,
  skill,
  sourcePath,
  latestTree,
  latestEntry,
  latestCommit,
  result,
  dryRun,
  reason,
}) {
  if (!latestEntry) {
    result.review.push({ sourcePath, skill, reason: "upstream file was removed" });
    return;
  }

  const content = await fetchRaw(repository, latestCommit, sourcePath);
  const candidate = candidatePath(repository, skill, latestCommit, "SKILL.md");
  if (!dryRun) {
    const skillDirectory = path.posix.dirname(sourcePath);
    for (const candidateSourcePath of skillFilesInTree(latestTree, sourcePath)) {
      const sourceEntry = latestTree.get(candidateSourcePath);
      const relativePath = path.posix.relative(skillDirectory, candidateSourcePath);
      const candidateFile = candidatePath(repository, skill, latestCommit, relativePath);
      const candidateContent = candidateSourcePath === sourcePath
        ? content
        : await fetchRaw(repository, latestCommit, candidateSourcePath);
      writeFileIfChanged(resolveInside(root, candidateFile), candidateContent, sourceEntry.mode);
    }
  }
  result.review.push({ sourcePath, skill, candidate, reason });
}

async function syncGrokMirrorSupportFiles({
  repository,
  mapping,
  baseTree,
  latestTree,
  baseCommit,
  latestCommit,
  result,
  dryRun,
}) {
  const skill = path.posix.basename(mapping.destination);
  const targetRoot = `.grok/skills/${skill}`;
  if (!mapping.grokMirror || !fs.existsSync(resolveInside(root, targetRoot))) {
    return;
  }

  const sourcePrefix = `${mapping.path}/`;
  for (const sourcePath of treePaths(latestTree, mapping.path)) {
    if (sourcePath.endsWith("/SKILL.md")) {
      continue;
    }

    const latestEntry = latestTree.get(sourcePath);
    const targetPath = `${targetRoot}/${sourcePath.slice(sourcePrefix.length)}`;
    const targetFile = resolveInside(root, targetPath);
    const baseEntry = baseTree.get(sourcePath);
    if (latestEntry.mode === "120000") {
      if (!fs.existsSync(targetFile) || baseEntry?.sha !== latestEntry.sha) {
        result.conflicts.push({ sourcePath, targetPath, reason: "upstream file is a symbolic link" });
        result.sourceBlocked = true;
        result.relevant = true;
      }
      continue;
    }
    if (fs.existsSync(targetFile) && baseEntry?.sha === latestEntry.sha && baseEntry?.mode === latestEntry.mode) {
      continue;
    }

    await syncDestination({
      repository,
      skill,
      sourcePath,
      candidateRelativePath: sourcePath.slice(sourcePrefix.length),
      targetPath,
      baseEntry,
      latestEntry,
      baseCommit,
      latestCommit,
      result,
      dryRun,
      allowMissingLocal: true,
    });
    result.relevant = true;
  }
}

function writeReport(results, dryRun) {
  const lines = [
    "# Upstream skill update report",
    "",
    "Generated from the source commits listed below by the weekly sync workflow.",
    "",
    "Review source changes and license attribution before merging. This PR is never auto-merged.",
  ];

  for (const result of results) {
    lines.push("", `## ${result.repository}`, "");
    lines.push(`- Base: [\`${result.baseCommit.slice(0, 12)}\`](https://github.com/${result.repository}/commit/${result.baseCommit})`);
    lines.push(`- Latest: [\`${result.latestCommit.slice(0, 12)}\`](https://github.com/${result.repository}/commit/${result.latestCommit})`);

    if (result.applied.length > 0) {
      lines.push("", "### Integrated into this PR", "");
      for (const item of result.applied) {
        lines.push(`- \`${item.sourcePath}\` -> \`${item.targetPath}\` (${item.action})`);
      }
    }

    if (result.conflicts.length > 0) {
      lines.push("", "### Manual review required", "");
      for (const item of result.conflicts) {
        lines.push(`- \`${item.targetPath}\`: ${item.reason}. [Upstream source](${sourceLink(result.repository, result.latestCommit, item.sourcePath)})`);
      }
    }

    if (result.review.length > 0) {
      lines.push("", "### Review-only and new skill candidates", "");
      for (const item of result.review) {
        const candidateLink = item.candidate ? `; candidate: \`${item.candidate}\`` : "";
        lines.push(`- \`${item.skill}\` from \`${item.sourcePath}\`: ${item.reason}${candidateLink}. [Source](${sourceLink(result.repository, result.latestCommit, item.sourcePath)})`);
      }
    }

    if (result.removed.length > 0) {
      lines.push("", "### Upstream removals", "");
      for (const item of result.removed) {
        lines.push(`- \`${item.targetPath}\` remains unchanged; upstream removed \`${item.sourcePath}\`.`);
      }
    }

  }

  if (dryRun) {
    console.log(lines.join("\n"));
    return;
  }

  writeFileIfChanged(reportPath, Buffer.from(`${lines.join("\n")}\n`, "utf8"));
}

async function processSource(source, state, librarySkills, dryRun) {
  const repository = source.repository;
  const baseCommit = state.sources[repository].commit;
  const latest = await getLatest(repository);
  if (latest.commit === baseCommit) {
    console.log(`${repository}: already current at ${latest.commit.slice(0, 12)}`);
    return null;
  }

  const [baseTree, latestTree] = await Promise.all([
    getTree(repository, baseCommit),
    getTree(repository, latest.commit),
  ]);
  const result = {
    repository,
    branch: latest.branch,
    baseCommit,
    latestCommit: latest.commit,
    applied: [],
    conflicts: [],
    removed: [],
    review: [],
    sourceBlocked: false,
    relevant: false,
  };

  const syncedSkillFiles = new Set();
  for (const mapping of source.sync) {
    const prefix = `${mapping.path}/`;
    const paths = new Set([
      ...treePaths(baseTree, mapping.path),
      ...treePaths(latestTree, mapping.path),
    ]);

    for (const sourcePath of paths) {
      const baseEntry = baseTree.get(sourcePath);
      const latestEntry = latestTree.get(sourcePath);
      if (baseEntry?.sha === latestEntry?.sha && baseEntry?.mode === latestEntry?.mode) {
        continue;
      }

      const relativePath = sourcePath.slice(prefix.length);
      const targetPath = `${mapping.destination}/${relativePath}`;
      if (!latestEntry) {
        result.removed.push({ sourcePath, targetPath });
        result.sourceBlocked = true;
        result.relevant = true;
        continue;
      }
      if (latestEntry.mode === "120000") {
        result.conflicts.push({ sourcePath, targetPath, reason: "upstream file became a symbolic link" });
        result.sourceBlocked = true;
        result.relevant = true;
        continue;
      }

      await syncDestination({
        repository,
        skill: path.posix.basename(mapping.destination),
        sourcePath,
        candidateRelativePath: relativePath,
        targetPath,
        baseEntry,
        latestEntry,
        baseCommit,
        latestCommit: latest.commit,
        result,
        dryRun,
      });
      result.relevant = true;

      if (sourcePath.endsWith("/SKILL.md")) {
        syncedSkillFiles.add(sourcePath);
        const grokTarget = `.grok/skills/${path.posix.basename(mapping.destination)}/SKILL.md`;
        const grokPath = resolveInside(root, grokTarget);
        if (mapping.grokMirror && fs.existsSync(grokPath)) {
          await syncDestination({
            repository,
            skill: path.posix.basename(mapping.destination),
            sourcePath,
            candidateRelativePath: relativePath,
            targetPath: grokTarget,
            baseEntry,
            latestEntry,
            baseCommit,
            latestCommit: latest.commit,
            result,
            dryRun,
          });
        }
      }
    }

    await syncGrokMirrorSupportFiles({
      repository,
      mapping,
      baseTree,
      latestTree,
      baseCommit,
      latestCommit: latest.commit,
      result,
      dryRun,
    });
  }

  for (const mapping of source.reviewOnly) {
    const baseEntry = baseTree.get(mapping.path);
    const latestEntry = latestTree.get(mapping.path);
    if (baseEntry?.sha === latestEntry?.sha) {
      continue;
    }
    await reviewCandidate({
      repository,
      skill: mapping.skill,
      sourcePath: mapping.path,
      latestTree,
      latestEntry,
      latestCommit: latest.commit,
      result,
      dryRun,
      reason: mapping.reason,
    });
    result.relevant = true;
  }

  const mappedSkillFiles = new Set([
    ...syncedSkillFiles,
    ...source.reviewOnly.map((mapping) => mapping.path),
  ]);
  for (const skillRoot of source.skillRoots) {
    const latestSkillFiles = [...latestTree.keys()].filter(
      (pathname) => pathIsWithin(pathname, skillRoot) && pathname.endsWith("/SKILL.md"),
    );
    for (const sourcePath of latestSkillFiles) {
      if (mappedSkillFiles.has(sourcePath)) {
        continue;
      }
      const baseEntry = baseTree.get(sourcePath);
      const latestEntry = latestTree.get(sourcePath);
      if (baseEntry?.sha === latestEntry?.sha) {
        continue;
      }
      const skill = skillSlugFromSkillFile(sourcePath);
      const priorCandidateRoot = resolveInside(root, `${candidateRoot}/${repositorySlug(repository)}/${skill}`);
      if (!baseEntry || librarySkills.has(skill) || fs.existsSync(priorCandidateRoot)) {
        await reviewCandidate({
          repository,
          skill,
          sourcePath,
          latestTree,
          latestEntry,
          latestCommit: latest.commit,
          result,
          dryRun,
          reason: baseEntry ? "upstream skill changed outside the automatic sync map" : "new upstream skill",
        });
        result.relevant = true;
      }
    }
  }

  if (!result.relevant) {
    console.log(`${repository}: no mapped skill changes at ${latest.commit.slice(0, 12)}`);
    return null;
  }

  if (!result.sourceBlocked) {
    state.sources[repository].commit = latest.commit;
  }
  console.log(`${repository}: ${result.applied.length} file changes, ${result.conflicts.length} conflicts, ${result.review.length} review items`);
  return result;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const allowedArgs = new Set(["--dry-run", "--check-config"]);
  for (const arg of args) {
    if (!allowedArgs.has(arg)) {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  const config = readJson(sourceManifestPath);
  const state = readJson(statePath);
  validateConfiguration(config, state);
  if (args.has("--check-config")) {
    console.log("Upstream source map and state are valid.");
    return;
  }

  const library = readJson(path.join(root, "library.json"));
  const librarySkills = new Set(library.skills);
  const dryRun = args.has("--dry-run");
  const originalState = JSON.stringify(state);
  const results = [];

  for (const source of config.sources) {
    const result = await processSource(source, state, librarySkills, dryRun);
    if (result) {
      results.push(result);
    }
  }

  if (!dryRun && JSON.stringify(state) !== originalState) {
    fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  }
  if (results.length === 0) {
    console.log("No upstream skill changes to review.");
    return;
  }
  writeReport(results, dryRun);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
