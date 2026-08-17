#!/usr/bin/env bash
set -euo pipefail

# Production layout mirrors kurapov.ee / dina.kurapov.ee:
# repo lives at /www/good.kurapov.ee, Vite builds into dist/, then dist becomes public/
# which nginx serves as the document root.
SITE_DIR="/www/good.kurapov.ee"

echo "[1/4] Update good.kurapov.ee repository"
# Production only needs the latest deployable snapshot, not Git history.
git -C "$SITE_DIR" remote set-branches origin main
git -C "$SITE_DIR" config remote.origin.fetch "+refs/heads/main:refs/remotes/origin/main"
git -C "$SITE_DIR" fetch --depth=1 --prune --no-tags origin +refs/heads/main:refs/remotes/origin/main
git -C "$SITE_DIR" reset --hard origin/main
git -C "$SITE_DIR" reflog expire --expire=now --all
git -C "$SITE_DIR" gc --prune=now

echo "[2/4] Install npm dependencies"
(
    cd "$SITE_DIR"
    npm ci
)

echo "[3/4] Build static site into dist/"
rm -rf "$SITE_DIR/dist"
(
    cd "$SITE_DIR"
    npm run build
)

echo "[4/4] Publish dist/ as public/"
rm -rf "$SITE_DIR/public"
mv "$SITE_DIR/dist" "$SITE_DIR/public"

if [[ ! -f "$SITE_DIR/public/index.html" ]]; then
    echo "Deploy verification failed: public/index.html is missing." >&2
    exit 1
fi

if [[ ! -d "$SITE_DIR/public/journey-previews" ]] || [[ -z "$(ls -A "$SITE_DIR/public/journey-previews" 2>/dev/null || true)" ]]; then
    echo "Deploy verification failed: public/journey-previews/ is missing or empty." >&2
    exit 1
fi

echo "Deploy complete. Nginx root is $SITE_DIR/public"
echo "Nginx reload is intentionally manual."
