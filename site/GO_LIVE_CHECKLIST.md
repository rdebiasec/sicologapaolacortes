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
- [ ] API con `CORS_ALLOWED_ORIGINS` estricto (solo dominios autorizados).
- [ ] Rate limiting activo (`RATE_LIMIT_PER_MINUTE`).
- [ ] Secretos backend verificados (`DATABASE_URL`, `IP_HASH_SALT`) y nunca en `VITE_*`.
- [ ] `ADMIN_API_KEY` configurado para proteger endpoints de métricas/resumen.

## Legal y confianza

- [ ] Política de privacidad revisada/aprobada.
- [ ] Correo de contacto definido para derechos de datos.
- [ ] Secciones con datos profesionales verificadas antes de producción.
- [ ] Formulario de lead exige consentimiento explícito antes de persistir.
- [ ] Retención y borrado definidos (180 días y canal de supresión operativo).

## Conversión

- [ ] `VITE_WHATSAPP_NUMBER` configurado (si aplica al release).
- [ ] Botones WhatsApp abren `wa.me` con mensaje prellenado.
- [ ] Si `VITE_GA4_ID` está activo, verificar evento `click_whatsapp`.
- [ ] `VITE_API_BASE_URL` apunta al API productivo y responde `/healthz`.
- [ ] Evento `whatsapp-click` persiste en `conversion_events` con `boton` correcto.
- [ ] Lead con consentimiento persiste en `lead_submissions` + `consent_records`.

## Operación continua (mensual)

- [ ] Re-ejecutar `npm run build` y smoke tests de rutas.
- [ ] Revisar enlaces rotos y validez de sitemap/robots.
- [ ] Revisar dependencias (`npm outdated`, `npm audit`).
- [ ] Confirmar que políticas y datos de contacto siguen vigentes.
- [ ] Verificar backup automático de Postgres y prueba de restore.
- [ ] Revisar logs de acceso (`lead_access_log`) y patrones de abuso del API.
