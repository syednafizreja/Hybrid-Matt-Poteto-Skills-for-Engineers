import argparse
import json
import pathlib
import posixpath
import re
import subprocess
import tempfile
from urllib.parse import urlsplit
import zipfile


ROOT = pathlib.Path(__file__).resolve().parents[2]
ARCHIVE_PATH = ROOT / "grokbot-vscode-hybrid-factory.zip"
PACKAGE_ROOT = "grokbot-vscode-hybrid-factory"
GROK_SKILLS = (
    "hybrid-init",
    "hybrid-investigate",
    "hybrid-grill",
    "hybrid-plan",
    "hybrid-build",
    "hybrid-ship",
    "hybrid-retro",
    "verify-app",
    "codebase-design",
    "tdd",
    "unslop",
    "handoff",
)
PACKAGE_FILES = (
    "README.md",
    "install.sh",
    "verify-setup.sh",
    "AGENTS.md",
    "CLAUDE.md",
    "GLOSSARY.md",
    "FEATURE_MAP.md",
    ".vscode/settings.json",
    ".vscode/tasks.json",
    *(f".grok/skills/{skill}/SKILL.md" for skill in GROK_SKILLS),
    "scripts/check-boundaries.mjs",
    "docs/adr/0000-adr-template.md",
    "docs/agents/codingstandards.md",
    "docs/agents/issue-tracker.md",
    "docs/agents/triage-labels.md",
    "docs/agents/model-routing.md",
    "docs/agents/eval-rubric-template.md",
    "grokbot-cloud/01-grokbot-private-skills-import.md",
    "grokbot-cloud/02-bot-roster-profiles.md",
    "grokbot-cloud/03-routines.md",
    "grokbot-cloud/04-trust-ladder.md",
    ".github/pull_request_template.md",
    ".github/workflows/deterministic-ci.yml",
)
EXPECTED_FILE_COUNT = 34
MARKDOWN_LINK = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")


def package_files():
    files = []
    for item in PACKAGE_FILES:
        source = ROOT / item
        if source.is_file():
            files.append(source)
        else:
            raise FileNotFoundError(f"Required package input is missing: {item}")
    return sorted(files, key=lambda path: path.relative_to(ROOT).as_posix())


def archive_content(path):
    content = path.read_bytes()
    try:
        content.decode("utf-8")
    except UnicodeDecodeError:
        return content
    return content.replace(b"\r\n", b"\n")


def write_archive(files):
    with zipfile.ZipFile(ARCHIVE_PATH, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in files:
            relative = path.relative_to(ROOT).as_posix()
            name = f"{PACKAGE_ROOT}/{relative}"
            info = zipfile.ZipInfo(name)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.create_system = 3
            mode = 0o100755 if path.suffix in {".sh", ".mjs"} else 0o100644
            info.external_attr = mode << 16
            archive.writestr(info, archive_content(path))


def archive_is_current(files):
    if not ARCHIVE_PATH.is_file():
        return False

    expected_names = {
        f"{PACKAGE_ROOT}/{path.relative_to(ROOT).as_posix()}"
        for path in files
    }
    try:
        with zipfile.ZipFile(ARCHIVE_PATH) as archive:
            if archive.testzip() is not None or set(archive.namelist()) != expected_names:
                return False
            for path in files:
                name = f"{PACKAGE_ROOT}/{path.relative_to(ROOT).as_posix()}"
                info = archive.getinfo(name)
                expected_mode = 0o755 if path.suffix in {".sh", ".mjs"} else 0o644
                if (
                    archive.read(name) != archive_content(path)
                    or (info.external_attr >> 16) & 0o777 != expected_mode
                ):
                    return False
    except (OSError, zipfile.BadZipFile):
        return False
    return True


def verify_archive(bash):
    with zipfile.ZipFile(ARCHIVE_PATH) as archive:
        if archive.testzip() is not None:
            raise ValueError("ZIP integrity check failed.")

        names = set(archive.namelist())
        expected_names = {f"{PACKAGE_ROOT}/{path}" for path in PACKAGE_FILES}
        if names != expected_names or len(names) != EXPECTED_FILE_COUNT:
            missing = expected_names - names
            unexpected = names - expected_names
            raise ValueError(
                f"ZIP must contain exactly {EXPECTED_FILE_COUNT} files; "
                f"missing={sorted(missing)}, unexpected={sorted(unexpected)}"
            )
        if any("/tools/maintainers/" in name or name.endswith("/.github/workflows/upstream-sync.yml") for name in names):
            raise ValueError("Maintainer-only automation must not be included in the factory ZIP.")

        for name in names:
            if name.endswith((".sh", ".mjs")):
                info = archive.getinfo(name)
                if not (info.external_attr >> 16) & 0o111:
                    raise ValueError(f"Executable bit is missing: {name}")

        for relative in (".vscode/settings.json", ".vscode/tasks.json"):
            json.loads(archive.read(f"{PACKAGE_ROOT}/{relative}").decode("utf-8"))

        for relative in PACKAGE_FILES:
            if not relative.startswith(".grok/skills/") or not relative.endswith("/SKILL.md"):
                continue
            content = archive.read(f"{PACKAGE_ROOT}/{relative}").decode("utf-8")
            for raw_target in MARKDOWN_LINK.findall(content):
                target = raw_target.strip().split()[0].strip("<>")
                parsed = urlsplit(target)
                if parsed.scheme or target.startswith("//") or not parsed.path:
                    continue
                resolved = posixpath.normpath(posixpath.join(posixpath.dirname(relative), parsed.path))
                if resolved not in {file.removeprefix(f"{PACKAGE_ROOT}/") for file in names}:
                    raise ValueError(f"Missing packaged skill reference: {relative} -> {target}")

        with tempfile.TemporaryDirectory(prefix="hybrid-factory-zip-") as temporary:
            for name in sorted(names):
                if not name.endswith((".sh", ".mjs")):
                    continue
                path = pathlib.Path(temporary) / pathlib.PurePosixPath(name)
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(archive.read(name))
                if name.endswith(".sh"):
                    subprocess.run([bash, "-n", str(path)], check=True)
                else:
                    subprocess.run(["node", "--check", str(path)], check=True)

    return len(names)


def main():
    parser = argparse.ArgumentParser(description="Build and validate the consumer-facing factory ZIP.")
    parser.add_argument("--bash", default="bash", help="Bash executable used for shell syntax checks.")
    args = parser.parse_args()

    files = package_files()
    if not archive_is_current(files):
        write_archive(files)
    count = verify_archive(args.bash)
    print(f"ZIP verified: {ARCHIVE_PATH} ({ARCHIVE_PATH.stat().st_size:,} bytes, {count} files)")


if __name__ == "__main__":
    main()
