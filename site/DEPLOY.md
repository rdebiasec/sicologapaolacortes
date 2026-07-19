# Deploy

Este proyecto se construye como sitio estático en `site/dist`.

## 1) Desarrollo local

```bash
cd site
npm install
npm run dev
```

Abre `http://localhost:5181/`.

## 2) Build de verificación

```bash
cd site
npm run build
```

El build ejecuta:
- `scripts/generate-seo.mjs` (actualiza meta/canonical + sitemap/robots)
- `vite build`
- `scripts/check-dist.mjs` (integridad + seguridad)

## 3) Variables mínimas para producción

Configura en el entorno de build (o en `site/.env` local):

- `VITE_SITE_URL` (obligatoria para canonical/OG/sitemap correctos)
- `VITE_BASE_PATH` (`/repo/` para GitHub Pages de proyecto, `/` para dominio raíz/Render)
- Opcionales: `VITE_WHATSAPP_NUMBER`, `VITE_CONTACT_EMAIL`, `VITE_BUSINESS_HOURS`, `VITE_INSTAGRAM_HANDLE`, `VITE_GA4_ID`
- Persistencia:
  - `VITE_API_BASE_URL` (ej. `https://paola-cortes-api.onrender.com`)
  - `VITE_LEAD_POLICY_VERSION` (ej. `v1.0`)

Referencia: `site/.env.example`.

## 4) GitHub Pages (primario)

- Deploy vía GitHub Actions usando `.github/workflows/deploy-pages.yml`.
- El workflow publica `site/dist` como artefacto de Pages.
- Si no defines `VITE_BASE_PATH`, el workflow usa `/nombre-del-repo/` por defecto para project pages.

## 5) Render Data API + Postgres

- Configurado en `render.yaml`:
  - servicio `paola-cortes-api` (`rootDir: api`)
  - base `paola-cortes-db` (Postgres, plan `basic_256mb` por límite de un solo free DB por workspace)
- Secretos backend (no `VITE_*`): `DATABASE_URL`, `IP_HASH_SALT`.
- Variables de operación API: `CORS_ALLOWED_ORIGINS`, `RATE_LIMIT_PER_MINUTE`, `LEAD_POLICY_VERSION`.
- Variables secretas API: `DATABASE_URL`, `IP_HASH_SALT`, `ADMIN_API_KEY`.
- El API ejecuta `alembic upgrade head` en cada deploy antes de levantar `uvicorn`.

## 6) Smoke tests post deploy

- `/`
- `/privacidad/`
- URL inexistente (debe responder con 404 custom)
- Validar que no haya `example.com` en HTML público
- Probar evento: click de WhatsApp genera inserción en `conversion_events`.
- Probar lead: envío con consentimiento guarda en `lead_submissions` + `consent_records`.
