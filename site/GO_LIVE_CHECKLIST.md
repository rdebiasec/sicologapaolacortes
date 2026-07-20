# Go-Live Checklist (GitHub → Pages → Render)

## Integridad (bloqueantes)

- [ ] `VITE_SITE_URL` configurado para el entorno publicado.
- [ ] `npm run build` exitoso sin `example.com` en `dist/`.
- [ ] Rutas operativas: `/`, `/privacidad/`, `404`.
- [ ] Sin errores de assets (JS/CSS/favicon/og-image).

## Seguridad

- [ ] `Content-Security-Policy` presente en `index`, `privacidad` y `404`.
- [ ] `Referrer-Policy` presente.
- [ ] `X-Content-Type-Options` y `X-Frame-Options` aplicados en hosting (Pages/Render).
- [ ] Enlaces externos con `rel="noopener noreferrer"`.
- [ ] No hay secretos expuestos en frontend (`VITE_*` solo para configuración pública).
- [ ] Botón para limpiar datos locales funcional.

## Legal y confianza

- [ ] Política de privacidad revisada/aprobada.
- [ ] Correo de contacto definido para derechos de datos.
- [ ] Secciones con datos profesionales verificadas antes de producción.
- [ ] Formulario local exige consentimiento explícito antes de guardar datos.
- [ ] Retención y borrado local definidos (180 días y botón de limpieza disponible).

## Conversión

- [ ] `VITE_WHATSAPP_NUMBER` configurado (si aplica al release).
- [ ] Botones WhatsApp abren `wa.me` con mensaje prellenado.
- [ ] Si `VITE_GA4_ID` está activo, verificar evento `click_whatsapp`.
- [ ] Evento `click_whatsapp` se registra localmente sin romper navegación.
- [ ] Guardado local de formulario funciona en navegador y se puede limpiar.

## Operación continua (mensual)

- [ ] Re-ejecutar `npm run build` y smoke tests de rutas.
- [ ] Revisar enlaces rotos y validez de sitemap/robots.
- [ ] Revisar dependencias (`npm outdated`, `npm audit`).
- [ ] Confirmar que políticas y datos de contacto siguen vigentes.
- [ ] Confirmar que el copy legal de almacenamiento local sigue vigente.
