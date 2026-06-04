#!/bin/bash
# Deploy justers.com.ua via FTP (lftp)
# Usage: ./deploy.sh

set -e

# Load credentials from .env
ENV_FILE="$(dirname "$0")/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env not found"
  exit 1
fi

FTP_HOST=$(grep '^FTP_HOST=' "$ENV_FILE" | cut -d= -f2)
FTP_USER=$(grep '^FTP_USER=' "$ENV_FILE" | cut -d= -f2)
FTP_PASS=$(grep '^FTP_PASS=' "$ENV_FILE" | cut -d= -f2)
REMOTE_DIR="/justers.com.ua"

if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
  echo "Error: FTP credentials missing in .env"
  exit 1
fi

cd "$(dirname "$0")"

echo "Deploying to $FTP_HOST:$REMOTE_DIR ..."

lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" -e "
  mirror --reverse --verbose --only-newer \
    --exclude ^\.git/ \
    --exclude ^\.github/ \
    --exclude ^\.claude/ \
    --exclude ^\.vercel/ \
    --exclude ^\.wrangler/ \
    --exclude ^\.expect/ \
    --exclude ^\.idea/ \
    --exclude ^node_modules/ \
    --exclude ^\.env$ \
    --exclude ^\.dev\.vars$ \
    --exclude ^\.gitignore$ \
    --exclude ^\.DS_Store$ \
    --exclude ^package\.json$ \
    --exclude ^package-lock\.json$ \
    --exclude ^wrangler\.toml$ \
    --exclude ^CLAUDE\.md$ \
    --exclude ^MIGRATION\.md$ \
    --exclude ^deploy\.sh$ \
    --exclude ^\.ftp-deploy-sync-state\.json$ \
    . $REMOTE_DIR;
  bye
"

echo "Done!"
