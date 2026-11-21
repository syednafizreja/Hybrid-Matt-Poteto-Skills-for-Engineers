import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { isSafeRelativePath, mergeText, resolveInside, skillFilesInTree } from "./upstream-sync-core.mjs";

test("accepts contained relative paths", () => {
  const root = path.resolve("repo-root");
  assert.equal(isSafeRelativePath("skills/tdd/SKILL.md"), true);
  assert.equal(resolveInside(root, "skills/tdd/SKILL.md"), path.join(root, "skills", "tdd", "SKILL.md"));
});

test("rejects paths that can escape the repository", () => {
  assert.equal(isSafeRelativePath("../secrets"), false);
  assert.equal(isSafeRelativePath("skills\\..\\secrets"), false);
  assert.equal(isSafeRelativePath("C:secrets"), false);
  assert.throws(() => resolveInside(path.resolve("repo-root"), "../secrets"), /Unsafe relative path/);
});

test("collects a candidate skill and its supporting files without siblings", () => {
  const tree = new Map([
    ["skills/engineering/new-skill/SKILL.md", {}],
    ["skills/engineering/new-skill/references/guide.md", {}],
    ["skills/engineering/other-skill/SKILL.md", {}],
  ]);
  assert.deepEqual(skillFilesInTree(tree, "skills/engineering/new-skill/SKILL.md"), [
    "skills/engineering/new-skill/SKILL.md",
    "skills/engineering/new-skill/references/guide.md",
  ]);
});

test("merges independent local and upstream edits", () => {
  const result = mergeText(
    "first\nbase\nmiddle\nlast\n",
    "first\nbase\nlocal\nmiddle\nlast\n",
    "first\nbase\nmiddle\nupstream\n",
  );
  assert.equal(result.status, "merged");
  assert.equal(result.content.toString("utf8"), "first\nbase\nlocal\nmiddle\nupstream\n");
});

test("reports overlapping upstream and local edits as conflicts", () => {
  const result = mergeText("value: old\n", "value: local\n", "value: upstream\n");
  assert.equal(result.status, "conflict");
  assert.match(result.content.toString("utf8"), /<<<<<<< local/);
});

test("preserves local CRLF when merging upstream LF content", () => {
  const result = mergeText(
    "first\nbase\nmiddle\nlast\n",
    "first\r\nbase\r\nlocal\r\nmiddle\r\nlast\r\n",
    "first\nbase\nmiddle\nupstream\n",
  );
  assert.equal(result.status, "merged");
  assert.equal(result.content.toString("utf8"), "first\r\nbase\r\nlocal\r\nmiddle\r\nupstream\r\n");
});

test("does not pass binary content to Git's text merger", () => {
  const result = mergeText(Buffer.from([0, 1]), Buffer.from([0, 2]), Buffer.from([0, 3]));
  assert.equal(result.status, "binary");
});
