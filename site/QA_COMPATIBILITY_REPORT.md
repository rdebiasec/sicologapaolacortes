# QA compatibilidad multiplataforma

Fecha: 2026-07-20  
Entorno validado: `dev` en `http://127.0.0.1:5181`

## Evidencia ejecutada

- Build de producción: `npm run build` -> OK.
- Matriz E2E cross-browser: `npm run test:e2e` -> `30 passed`.
- Perfiles cubiertos:
  - Desktop Chrome
  - Desktop Firefox
  - Desktop Safari
  - iPhone 14 Safari
  - iPad Safari
  - Pixel 7 Chrome

## Smoke QA multidispositivo (manual asistido)

Se ejecutaron verificaciones por perfil para confirmar:
- Home y privacidad cargan correctamente.
- Header sticky activo (`position: sticky`, `top: 0`).
- Objetivos tactiles del menu en mobile >= `44x44`.
- Navegacion por teclado funcional (skip link/focus inicial).
- Rendimiento base de carga en rango estable (`DOMContentLoaded` y `load` en cientos de ms en local).

Resultados:
- Desktop Chrome: OK
- Desktop Firefox: OK
- Desktop Safari: OK
- iPhone 14 Safari: OK
- iPad Safari: OK
- Pixel 7 Chrome: OK

## Gate de promocion a produccion

Promover solo si TODO se cumple:
- `npm run build` en verde.
- `npm run test:e2e` en verde para toda la matriz.
- Smoke QA multidispositivo sin regresiones en layout, scroll/sticky/fixed, targets tactiles y navegacion.
- Smoke post-deploy en produccion:
  - `/` carga y renderiza contenido principal.
  - `/privacidad/` carga, indice funciona y enlaces internos responden.
  - Navegacion y CTA principales operan igual que en `dev`.

Estado actual del gate: **APROBADO para promover** (pendiente ejecutar smoke post-deploy al momento de publicar).
