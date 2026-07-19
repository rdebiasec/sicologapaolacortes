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

Referencia: `site/.env.example`.

## 4) GitHub Pages (primario)

- Deploy vía GitHub Actions usando `.github/workflows/deploy-pages.yml`.
- El workflow publica `site/dist` como artefacto de Pages.
- Si no defines `VITE_BASE_PATH`, el workflow usa `/nombre-del-repo/` por defecto para project pages.

## 5) Render Static Site (espejo)

- Configurado con `render.yaml` (root `site`, publish `dist`).
- Para Render usar `VITE_BASE_PATH=/`.
- Definir `VITE_SITE_URL` con el dominio público de Render o dominio custom.

## 6) Smoke tests post deploy

- `/`
- `/privacidad/`
- URL inexistente (debe responder con 404 custom)
- Validar que no haya `example.com` en HTML público
