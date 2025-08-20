
#!/bin/bash

# Configurações de deploy para Repositório
BUILD_DIR="dist"
REMOTE_USER="u670352471"
REMOTE_HOST="45.14.88.221"
REMOTE_PORT="65002"
REMOTE_PATH="/home/u670352471/domains/acaoparamita.com.br/public_html/repositorio"
HTACCESS_LOCAL=".htaccess"
SITE_URL="https://repositorio.acaoparamita.com.br"

echo "[INFO] Starting deployment process..."

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "[ERROR] Build directory '$BUILD_DIR' not found! Run 'npm run build' first." >&2
  exit 1
fi

# Ensure .htaccess exists in the build folder
if [ -f "$HTACCESS_LOCAL" ]; then
  cp "$HTACCESS_LOCAL" "$BUILD_DIR/.htaccess"
  echo "[INFO] Copied .htaccess to build directory"
else
  echo "[ERROR] .htaccess file not found!" >&2
  exit 1
fi

# Create necessary directories on remote server (but don't overwrite audio folders)
echo "[INFO] Creating remote directories..."
ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $REMOTE_PATH"

# Upload build folder via rsync, EXCLUDING audio folders to preserve FTP uploads
echo "[INFO] Uploading files to server (preserving audio folders)..."
rsync -avz --delete \
  --exclude='audios/' \
  --exclude='audio/' \
  -e "ssh -p $REMOTE_PORT" \
  "$BUILD_DIR/" \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"

RSYNC_STATUS=$?

if [ $RSYNC_STATUS -ne 0 ]; then
  echo "[ERROR] Failed to deploy files over SSH." >&2
  exit 2
fi

echo "[INFO] Files uploaded successfully!"
echo "[INFO] Audio folders preserved (not overwritten)"

# Check if site is live
echo "[INFO] Checking if site is responsive..."
for i in {1..10}; do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
  if [ "$HTTP_STATUS" = "200" ]; then
    echo "[SUCCESS] Deploy successful! Visit: $SITE_URL"
    exit 0
  fi
  echo "[INFO] Attempt $i/10 - Site not yet responsive (HTTP $HTTP_STATUS), retrying..."
  sleep 2
done

echo "[WARNING] Deployed, but site is not responding with HTTP 200. Check manually: $SITE_URL" >&2
echo "[INFO] This might be normal if the server needs time to process the new files."
exit 0
