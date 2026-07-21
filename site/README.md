# Psicóloga Paola Cortés — sitio web

Sitio estático (plantilla Vite multi-página) con el diseño y contenidos del brief DBX v1.2.

## Desarrollo local

```bash
cd site
npm install
npm run dev
```

Abre **http://localhost:5181/**

## Datos pendientes

Configura en variables de entorno (ver `.env.example`) o en `src/legal/constants.js`:
- WhatsApp, correo, horarios, Instagram, GA4
- Credenciales profesionales públicas (formación, experiencia y tarjeta profesional)
- `VITE_SITE_URL` para canonical/OG/sitemap
- `VITE_LEAD_POLICY_VERSION` para versionar consentimiento local

Si faltan datos opcionales, la UI oculta esos campos o redirige al bloque de contacto.

## Estructura

- One-page en `/` con anclas
- `/privacidad/` — política de datos (Ley 1581)
- `/404.html` — página 404 amable

## Deploy

- Build verificado: `npm run build`
- Publicación principal: GitHub Pages (workflow de Actions)
- Persistencia: solo navegador visitante (`localStorage`)
