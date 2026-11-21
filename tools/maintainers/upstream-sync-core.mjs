import { isUtf8 } from "node:buffer";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function isSafeRelativePath(value) {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.includes("\0") ||
    value.includes("\\") ||
    value.includes(":")
  ) {
    return false;
  }

  if (value.startsWith("/")) {
    return false;
  }

  return value.split("/").every((part) => part !== "" && part !== "." && part !== "..");
}

export function resolveInside(root, relativePath) {
  if (!isSafeRelativePath(relativePath)) {
    throw new Error(`Unsafe relative path: ${relativePath}`);
  }

  const resolved = path.resolve(root, ...relativePath.split("/"));
  const relative = path.relative(root, resolved);
  if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Path escapes repository root: ${relativePath}`);
  }

  return resolved;
}

export function skillFilesInTree(tree, skillFilePath) {
  const skillDirectory = path.posix.dirname(skillFilePath);
  return [...tree.keys()]
    .filter((filePath) => filePath === skillFilePath || filePath.startsWith(`${skillDirectory}/`))
    .sort();
}

export function mergeText(base, local, upstream) {
  const contents = [base, local, upstream].map((value) => Buffer.from(value));
  if (contents.some((content) => content.includes(0) || !isUtf8(content))) {
    return { status: "binary" };
  }
  const lineEnding = contents[1].includes(Buffer.from("\r\n")) ? "\r\n" : "\n";
  const normalized = contents.map((content) => Buffer.from(content.toString("utf8").replace(/\r\n/g, "\n"), "utf8"));

  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "hybrid-upstream-"));
  const [basePath, localPath, upstreamPath] = ["base", "local", "upstream"].map((name) =>
    path.join(temporaryDirectory, name),
  );

  try {
    fs.writeFileSync(basePath, normalized[0]);
    fs.writeFileSync(localPath, normalized[1]);
    fs.writeFileSync(upstreamPath, normalized[2]);

    const result = spawnSync(
      "git",
      [
        "merge-file",
        "-p",
        "-L",
        "local",
        "-L",
        "upstream base",
        "-L",
        "upstream latest",
        localPath,
        basePath,
        upstreamPath,
      ],
      { encoding: null, maxBuffer: 8 * 1024 * 1024 },
    );

    if (result.error) {
      throw result.error;
    }

    if (result.status === 0) {
      return { status: "merged", content: restoreLineEndings(result.stdout, lineEnding) };
    }

    if (result.status === 1) {
      return { status: "conflict", content: restoreLineEndings(result.stdout, lineEnding) };
    }

    throw new Error(`git merge-file exited with status ${result.status}: ${result.stderr?.toString("utf8") ?? ""}`);
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

function restoreLineEndings(content, lineEnding) {
  if (lineEnding === "\n") {
    return content;
  }
  return Buffer.from(content.toString("utf8").replace(/\n/g, "\r\n"), "utf8");
}
