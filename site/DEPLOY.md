# Deploy

Este proyecto se construye como sitio estático en `site/dist`.

Principio operativo: primero validar en local y solo después promover a producción.

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
- Persistencia local:
  - `VITE_LEAD_POLICY_VERSION` (ej. `v1.0`)

Referencia: `site/.env.example`.

## 4) GitHub Pages (primario)

- Deploy vía GitHub Actions usando `.github/workflows/deploy-pages.yml`.
- El workflow publica `site/dist` como artefacto de Pages.
- Si no defines `VITE_BASE_PATH`, el workflow usa `/nombre-del-repo/` por defecto para project pages.

## 5) Persistencia local (sin backend)

- El formulario de contacto guarda borradores y consentimientos en `localStorage` del visitante.
- No existe envío automático a base de datos ni API.
- El canal real de contacto/respuesta sigue siendo WhatsApp o correo.

## 6) Smoke tests post deploy

- `/`
- `/privacidad/`
- URL inexistente (debe responder con 404 custom)
- Validar que no haya `example.com` en HTML público
- Probar que el formulario guarda borrador local y permite limpiar datos locales.
