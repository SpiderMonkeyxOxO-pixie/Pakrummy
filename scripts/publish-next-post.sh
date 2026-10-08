#!/usr/bin/env bash
# Promotes exactly one pre-written post from scheduled-posts/ into
# src/content/blog/, in filename order (01-..., 02-..., etc.), commits it,
# and pushes to main. No content generation happens here — every post in
# scheduled-posts/ was already written and is publish-ready; this script's
# only job is to reveal one per run.
#
# Run via cron, once a day, on a server that has:
#   - this repo cloned
#   - git push access to origin (SSH key or credential helper already set up)
#
# Idempotent: if scheduled-posts/ is empty, it logs that and exits 0.

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

STAGING_DIR="scheduled-posts"
TARGET_DIR="src/content/blog"

git pull --ff-only origin main

NEXT_FILE=$(find "$STAGING_DIR" -maxdepth 1 -name '*.md' | sort | head -n 1)

if [ -z "$NEXT_FILE" ]; then
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) — scheduled-posts/ is empty, nothing to publish today."
  exit 0
fi

FILENAME=$(basename "$NEXT_FILE")
# Strip the leading "NN-" ordering prefix to get the real slug filename.
SLUG_FILENAME=$(echo "$FILENAME" | sed -E 's/^[0-9]+-//')
DEST="$TARGET_DIR/$SLUG_FILENAME"

TITLE=$(grep -m1 '^title:' "$NEXT_FILE" | sed -E 's/^title: *"?//; s/"?$//')

# Set publishDate to today (UTC) so the post's own frontmatter matches the
# day it actually goes live, not the day it was originally drafted.
TODAY=$(date -u +%Y-%m-%d)
if command -v sed >/dev/null 2>&1; then
  sed -i -E "s/^publishDate: .*/publishDate: \"$TODAY\"/" "$NEXT_FILE"
fi

git mv "$NEXT_FILE" "$DEST"
git add "$DEST"
git commit -m "Publish: $TITLE"
git push origin main

echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) — published $DEST ($TITLE)"
