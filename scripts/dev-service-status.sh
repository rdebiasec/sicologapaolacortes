#!/usr/bin/env bash
# Estado del LaunchAgent Vite + puerto 5181.
set -euo pipefail

LABEL="com.paolacortes.site.dev"
HOST="127.0.0.1"
PORT="5181"
PLIST_DEST="${HOME}/Library/LaunchAgents/${LABEL}.plist"
UID_NUM="$(id -u)"
DOMAIN="gui/${UID_NUM}"

echo "=== LaunchAgent: ${LABEL} ==="
if [[ -f "${PLIST_DEST}" ]]; then
  echo "Plist: ${PLIST_DEST} (existe)"
else
  echo "Plist: no instalado"
fi

if launchctl print "${DOMAIN}/${LABEL}" >/dev/null 2>&1; then
  echo "launchctl: cargado"
  launchctl print "${DOMAIN}/${LABEL}" 2>/dev/null | grep -E 'state =|pid =|last exit code|path =|runs =' || true
else
  echo "launchctl: no cargado"
fi

echo
echo "=== Puerto ${PORT} ==="
if command -v lsof >/dev/null 2>&1; then
  if lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN 2>/dev/null; then
    :
  else
    echo "(nada escuchando)"
  fi
fi

echo
echo "=== HTTP http://${HOST}:${PORT}/ ==="
CODE="$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 2 "http://${HOST}:${PORT}/" 2>/dev/null || echo "000")"
echo "HTTP status: ${CODE}"
