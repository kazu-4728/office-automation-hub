#!/usr/bin/env bash
set -euo pipefail

EXPECTED_REMOTE="https://github.com/kazu-4728/office-automation-hub.git"
REMOTE_NAME="origin"

if current_url=$(git remote get-url "${REMOTE_NAME}" 2>/dev/null); then
  if [[ "${current_url}" == "${EXPECTED_REMOTE}" ]]; then
    echo "${REMOTE_NAME} remote is already set to ${EXPECTED_REMOTE}" >&2
    exit 0
  fi
  echo "Updating ${REMOTE_NAME} remote from ${current_url} to ${EXPECTED_REMOTE}" >&2
  git remote set-url "${REMOTE_NAME}" "${EXPECTED_REMOTE}"
  exit 0
fi

echo "Adding ${REMOTE_NAME} remote pointing to ${EXPECTED_REMOTE}" >&2
git remote add "${REMOTE_NAME}" "${EXPECTED_REMOTE}"
