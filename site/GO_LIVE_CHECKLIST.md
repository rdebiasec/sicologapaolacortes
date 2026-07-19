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

## Legal y confianza

- [ ] Política de privacidad revisada/aprobada.
- [ ] Correo de contacto definido para derechos de datos.
- [ ] Secciones con datos profesionales verificadas antes de producción.

## Conversión

- [ ] `VITE_WHATSAPP_NUMBER` configurado (si aplica al release).
- [ ] Botones WhatsApp abren `wa.me` con mensaje prellenado.
- [ ] Si `VITE_GA4_ID` está activo, verificar evento `click_whatsapp`.

## Operación continua (mensual)

- [ ] Re-ejecutar `npm run build` y smoke tests de rutas.
- [ ] Revisar enlaces rotos y validez de sitemap/robots.
- [ ] Revisar dependencias (`npm outdated`, `npm audit`).
- [ ] Confirmar que políticas y datos de contacto siguen vigentes.
