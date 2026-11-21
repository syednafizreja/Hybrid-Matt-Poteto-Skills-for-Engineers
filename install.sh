#!/usr/bin/env bash
set -euo pipefail

KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-}"
FORCE="${2:-}"

if [[ -z "${TARGET_DIR}" || $# -gt 2 ]]; then
  echo "Usage: $0 /path/to/target-repo [--force]"
  exit 1
fi

if [[ "${FORCE}" != "" && "${FORCE}" != "--force" ]]; then
  echo "Error: the only supported option is --force."
  echo "Usage: $0 /path/to/target-repo [--force]"
  exit 1
fi

if [[ ! -d "${TARGET_DIR}" ]]; then
  echo "Error: target directory '${TARGET_DIR}' does not exist."
  exit 1
fi

TARGET_DIR="$(cd "${TARGET_DIR}" && pwd)"

if [[ "${KIT_DIR}" == "${TARGET_DIR}" ]]; then
  echo "Error: target directory is the template kit itself. Pass a project repository."
  exit 1
fi

copy_item() {
  local src="$1"
  local dst="$2"
  mkdir -p "$(dirname "${dst}")"
  if [[ -f "${dst}" && "${FORCE}" != "--force" ]]; then
    echo "  [skip] ${dst#${TARGET_DIR}/} (already exists; pass --force to overwrite)"
  else
    cp "${src}" "${dst}"
    echo "  [copy] ${dst#${TARGET_DIR}/}"
  fi
}

copy_tree() {
  local source="$1"
  local destination="$2"
  local file
  local rel

  if [[ ! -d "${source}" ]]; then
    echo "Error: package directory is missing: ${source}" >&2
    return 1
  fi

  while IFS= read -r -d '' file; do
    rel="${file#${source}/}"
    copy_item "${file}" "${destination}/${rel}"
  done < <(find "${source}" -type f -print0)
}

echo "==> Installing Hybrid AI Engineering System v3 into: ${TARGET_DIR}"

for root_file in AGENTS.md CLAUDE.md GLOSSARY.md FEATURE_MAP.md verify-setup.sh; do
  copy_item "${KIT_DIR}/${root_file}" "${TARGET_DIR}/${root_file}"
done

for skill_dir in "${KIT_DIR}"/skills/*; do
  [[ -d "${skill_dir}" ]] || continue
  skill="$(basename "${skill_dir}")"
  copy_tree "${skill_dir}" "${TARGET_DIR}/.agents/skills/${skill}"
done

for sub in .grok .vscode docs scripts grokbot-cloud; do
  copy_tree "${KIT_DIR}/${sub}" "${TARGET_DIR}/${sub}"
done

for github_file in .github/pull_request_template.md .github/workflows/deterministic-ci.yml; do
  copy_item "${KIT_DIR}/${github_file}" "${TARGET_DIR}/${github_file}"
done

if [[ -f "${KIT_DIR}/library.json" ]]; then
  copy_item "${KIT_DIR}/library.json" "${TARGET_DIR}/.agents/hybrid-library.json"
fi

if [[ -f "${KIT_DIR}/THIRD_PARTY_NOTICES.md" ]]; then
  copy_item "${KIT_DIR}/THIRD_PARTY_NOTICES.md" "${TARGET_DIR}/THIRD_PARTY_NOTICES.md"
else
  notices_path="${TARGET_DIR}/THIRD_PARTY_NOTICES.md"
  if [[ -f "${notices_path}" && "${FORCE}" != "--force" ]]; then
    echo "  [skip] THIRD_PARTY_NOTICES.md (already exists; pass --force to overwrite)"
  else
    temporary="$(mktemp "${TARGET_DIR}/.third-party-notices.XXXXXX")"
    if ! awk '
      /^<!-- HYBRID-THIRD-PARTY-NOTICES:BEGIN -->$/ { copying=1; next }
      /^<!-- HYBRID-THIRD-PARTY-NOTICES:END -->$/ { copying=0 }
      copying
    ' "${KIT_DIR}/README.md" > "${temporary}"; then
      rm -f -- "${temporary}"
      echo "Error: unable to extract third-party notices from README.md." >&2
      exit 1
    fi
    if [[ ! -s "${temporary}" ]]; then
      rm -f -- "${temporary}"
      echo "Error: third-party notice section is missing from README.md." >&2
      exit 1
    fi
    mv -- "${temporary}" "${notices_path}"
    echo "  [copy] THIRD_PARTY_NOTICES.md"
  fi
fi

if [[ -f "${TARGET_DIR}/verify-setup.sh" ]]; then
  chmod +x "${TARGET_DIR}/verify-setup.sh"
fi

if [[ -f "${TARGET_DIR}/scripts/check-boundaries.mjs" ]]; then
  chmod +x "${TARGET_DIR}/scripts/check-boundaries.mjs"
fi

if [[ -f "${TARGET_DIR}/.gitignore" ]]; then
  if ! grep -q "^\.worktrees/" "${TARGET_DIR}/.gitignore"; then
    printf "\n# Isolated agent git worktrees\n.worktrees/\n" >> "${TARGET_DIR}/.gitignore"
    echo "  [edit] Added .worktrees/ to .gitignore"
  fi
fi

echo ""
echo "Installation complete!"
echo "Next steps:"
echo "  1. Open ${TARGET_DIR} in your preferred editor or agent workspace"
echo "  2. Run ./verify-setup.sh from a Bash terminal"
echo "  3. In Grok Bot or Grok Build, invoke /hybrid-init"
echo ""
if [[ -d "${KIT_DIR}/skills" && -f "${KIT_DIR}/library.json" ]]; then
  echo "To install skills into other supported agents' native folders, run from the target repository:"
  echo "  npx skills@latest add syednafizreja/Hybrid-Matt-Poteto-Skills-for-Engineers"
fi
