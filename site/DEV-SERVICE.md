# Servidor de desarrollo como servicio (macOS)

El sitio Vite puede correr como **LaunchAgent** de usuario para que no se caiga al cerrar terminals de Cursor/agente.

- Label: `com.paolacortes.site.dev`
- URL: http://127.0.0.1:5181/
- Logs: `site/logs/vite-dev.log` y `site/logs/vite-dev.err.log`

## Instalar / arrancar

Desde la raíz del repo:

```bash
./scripts/dev-service-install.sh
```

El script genera el plist en `~/Library/LaunchAgents/` con rutas absolutas a este workspace, libera el puerto 5181 si hace falta, y carga el servicio (`KeepAlive` + arranque al login).

## Estado

```bash
./scripts/dev-service-status.sh
```

## Desinstalar

```bash
./scripts/dev-service-uninstall.sh
```

## Notas

- Requiere `npm install` previo en `site/` (usa el Vite local).
- Si mueves el repo de carpeta, vuelve a ejecutar el install para regenerar el plist.
- No uses `npm run dev` en paralelo en el mismo puerto; el servicio ya lo ocupa.
