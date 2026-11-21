import argparse
import json
import pathlib
import subprocess
import tempfile
import zipfile


ROOT = pathlib.Path(__file__).resolve().parents[2]
ARCHIVE_PATH = ROOT / "grokbot-vscode-hybrid-factory.zip"
PACKAGE_ROOT = "grokbot-vscode-hybrid-factory"
PACKAGE_PATHS = (
    "AGENTS.md",
    "CLAUDE.md",
    "GLOSSARY.md",
    "FEATURE_MAP.md",
    "README.md",
    "LICENSE",
    "THIRD_PARTY_NOTICES.md",
    "library.json",
    "install.sh",
    "verify-setup.sh",
    "assets/hybrid-hero.svg",
    "skills",
    ".grok",
    ".vscode",
    "docs",
    "grokbot-cloud",
    "scripts/check-boundaries.mjs",
    ".github/pull_request_template.md",
    ".github/workflows/deterministic-ci.yml",
)
REQUIRED_FILES = (
    "install.sh",
    "verify-setup.sh",
    "library.json",
    "skills/tdd/SKILL.md",
    ".vscode/settings.json",
    ".vscode/tasks.json",
    ".github/pull_request_template.md",
    ".github/workflows/deterministic-ci.yml",
)


def package_files():
    files = []
    for item in PACKAGE_PATHS:
        source = ROOT / item
        if source.is_dir():
            files.extend(path for path in source.rglob("*") if path.is_file())
        elif source.is_file():
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
        missing = {f"{PACKAGE_ROOT}/{path}" for path in REQUIRED_FILES} - names
        if missing:
            raise ValueError(f"ZIP is missing required files: {sorted(missing)}")
        if any("/tools/maintainers/" in name or name.endswith("/.github/workflows/upstream-sync.yml") for name in names):
            raise ValueError("Maintainer-only automation must not be included in the factory ZIP.")

        for name in names:
            if name.endswith((".sh", ".mjs")):
                info = archive.getinfo(name)
                if not (info.external_attr >> 16) & 0o111:
                    raise ValueError(f"Executable bit is missing: {name}")

        for relative in (".vscode/settings.json", ".vscode/tasks.json", "library.json"):
            json.loads(archive.read(f"{PACKAGE_ROOT}/{relative}").decode("utf-8"))

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
