#!/usr/bin/env bash
# Instala LaunchAgent para el servidor Vite de desarrollo (site/).
set -euo pipefail

LABEL="com.paolacortes.site.dev"
HOST="127.0.0.1"
PORT="5181"

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE_DIR="${REPO_ROOT}/site"
LOG_DIR="${SITE_DIR}/logs"
PLIST_DEST="${HOME}/Library/LaunchAgents/${LABEL}.plist"
UID_NUM="$(id -u)"
DOMAIN="gui/${UID_NUM}"

NODE_BIN="$(command -v node || true)"
if [[ -z "${NODE_BIN}" ]]; then
  echo "Error: no se encontró 'node' en PATH." >&2
  exit 1
fi

VITE_JS="${SITE_DIR}/node_modules/vite/bin/vite.js"
if [[ ! -f "${VITE_JS}" ]]; then
  echo "Error: falta Vite. Ejecuta primero: cd site && npm install" >&2
  exit 1
fi

mkdir -p "${HOME}/Library/LaunchAgents" "${LOG_DIR}"

# Liberar el puerto si algo ya escucha ahí (proceso anterior / terminal de Cursor).
if command -v lsof >/dev/null 2>&1; then
  PIDS="$(lsof -tiTCP:"${PORT}" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "${PIDS}" ]]; then
    echo "Deteniendo proceso(s) en el puerto ${PORT}: ${PIDS}"
    # shellcheck disable=SC2086
    kill ${PIDS} 2>/dev/null || true
    sleep 1
    PIDS="$(lsof -tiTCP:"${PORT}" -sTCP:LISTEN 2>/dev/null || true)"
    if [[ -n "${PIDS}" ]]; then
      # shellcheck disable=SC2086
      kill -9 ${PIDS} 2>/dev/null || true
    fi
  fi
fi

# Descargar servicio previo si existe.
if launchctl print "${DOMAIN}/${LABEL}" >/dev/null 2>&1; then
  launchctl bootout "${DOMAIN}/${LABEL}" 2>/dev/null || true
fi
if [[ -f "${PLIST_DEST}" ]]; then
  launchctl bootout "${DOMAIN}" "${PLIST_DEST}" 2>/dev/null || true
fi

PATH_VALUE="$(dirname "${NODE_BIN}"):/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

cat > "${PLIST_DEST}" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>
  <key>WorkingDirectory</key>
  <string>${SITE_DIR}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${NODE_BIN}</string>
    <string>${VITE_JS}</string>
    <string>--host</string>
    <string>${HOST}</string>
    <string>--port</string>
    <string>${PORT}</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>${PATH_VALUE}</string>
    <key>NODE_ENV</key>
    <string>development</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${LOG_DIR}/vite-dev.log</string>
  <key>StandardErrorPath</key>
  <string>${LOG_DIR}/vite-dev.err.log</string>
</dict>
</plist>
EOF

launchctl bootstrap "${DOMAIN}" "${PLIST_DEST}"
launchctl enable "${DOMAIN}/${LABEL}" 2>/dev/null || true
launchctl kickstart -k "${DOMAIN}/${LABEL}" 2>/dev/null || true

echo "Servicio instalado: ${LABEL}"
echo "Plist: ${PLIST_DEST}"
echo "URL:   http://${HOST}:${PORT}/"
echo "Logs:  ${LOG_DIR}/vite-dev.log"
echo "       ${LOG_DIR}/vite-dev.err.log"

# Esperar a que responda.
for _ in $(seq 1 30); do
  if curl -sf -o /dev/null -w "%{http_code}" "http://${HOST}:${PORT}/" 2>/dev/null | grep -qE '200|304'; then
    echo "OK: el servidor responde en http://${HOST}:${PORT}/"
    exit 0
  fi
  sleep 0.5
done

echo "Aviso: el servicio se cargó, pero aún no responde en el puerto ${PORT}." >&2
echo "Revisa: ${LOG_DIR}/vite-dev.err.log" >&2
exit 1
