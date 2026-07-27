#!/usr/bin/env bash
# Desinstala el LaunchAgent del servidor Vite de desarrollo.
set -euo pipefail

LABEL="com.paolacortes.site.dev"
PLIST_DEST="${HOME}/Library/LaunchAgents/${LABEL}.plist"
UID_NUM="$(id -u)"
DOMAIN="gui/${UID_NUM}"

if launchctl print "${DOMAIN}/${LABEL}" >/dev/null 2>&1; then
  launchctl bootout "${DOMAIN}/${LABEL}" 2>/dev/null || true
fi
if [[ -f "${PLIST_DEST}" ]]; then
  launchctl bootout "${DOMAIN}" "${PLIST_DEST}" 2>/dev/null || true
  rm -f "${PLIST_DEST}"
  echo "Eliminado: ${PLIST_DEST}"
else
  echo "No había plist en ${PLIST_DEST}"
fi

echo "Servicio desinstalado: ${LABEL}"
