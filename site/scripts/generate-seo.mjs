import { readFile, writeFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  COMPANY_LEGAL_NAME,
  SITE_NAME_SHORT,
  OG_IMAGE
} from '../src/legal/constants.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteRoot = resolve(__dirname, '..')
const publicDir = resolve(__dirname, '../public')

const routes = [
  { path: '', priority: '1.0' },
  { path: 'privacidad/', priority: '0.4' }
]

function pageUrl(path) {
  return path ? `${SITE_URL}/${path.replace(/\/$/, '')}/` : `${SITE_URL}/`
}

function assetUrl(path) {
  const clean = String(path || '').replace(/^\/+/, '')
  return `${SITE_URL}/${clean}`
}

const pages = [
  {
    file: 'index.html',
    path: '',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    includeOg: true
  },
  {
    file: 'privacidad/index.html',
    path: 'privacidad/',
    title: `Política de privacidad | ${SITE_NAME_SHORT}`,
    description: 'Política de tratamiento de datos personales — Psicóloga Paola Cortés.',
    includeOg: true
  },
  {
    file: '404.html',
    path: '404.html',
    title: `Página no encontrada | ${SITE_NAME_SHORT}`,
    description: 'Página no encontrada — Psicóloga Paola Cortés.',
    includeOg: false
  }
]

function upsertHeadTag(html, regex, replacement) {
  const cleaned = html.replace(regex, '').replace(/\n{3,}/g, '\n\n')
  return cleaned.replace('</head>', `    ${replacement}\n  </head>`)
}

async function patchHtmlSeo() {
  for (const page of pages) {
    const target = resolve(siteRoot, page.file)
    let html = await readFile(target, 'utf8')
    const canonical = pageUrl(page.path)
    const ogImage = assetUrl(OG_IMAGE)

    html = upsertHeadTag(html, /<title>[\s\S]*?<\/title>\s*/gi, `<title>${page.title}</title>`)
    html = upsertHeadTag(
      html,
      /<meta\s+name="description"[\s\S]*?\/>\s*/gi,
      `<meta name="description" content="${page.description}" />`
    )
    if (page.includeOg) {
      html = upsertHeadTag(
        html,
        /<link\s+rel="canonical"[\s\S]*?\/>\s*/gi,
        `<link rel="canonical" href="${canonical}" />`
      )
      html = upsertHeadTag(
        html,
        /<meta\s+property="og:title"[\s\S]*?\/>\s*/gi,
        `<meta property="og:title" content="${page.title}" />`
      )
      html = upsertHeadTag(
        html,
        /<meta\s+property="og:description"[\s\S]*?\/>\s*/gi,
        `<meta property="og:description" content="${page.description}" />`
      )
      html = upsertHeadTag(
        html,
        /<meta\s+property="og:image"[\s\S]*?\/>\s*/gi,
        `<meta property="og:image" content="${ogImage}" />`
      )
      html = upsertHeadTag(
        html,
        /<meta\s+property="og:url"[\s\S]*?\/>\s*/gi,
        `<meta property="og:url" content="${canonical}" />`
      )
    }
    await writeFile(target, html)
  }
}

async function main() {
  await patchHtmlSeo()

  const urls = routes
    .map(
      (r) => `  <url>
    <loc>${pageUrl(r.path)}</loc>
    <changefreq>monthly</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

  await writeFile(resolve(publicDir, 'sitemap.xml'), sitemap)
  await writeFile(resolve(publicDir, 'robots.txt'), robots)
  console.log(`SEO: patched HTML + sitemap/robots for ${COMPANY_LEGAL_NAME}`)
  console.log(`SITE_URL: ${SITE_URL}`)
  console.log(`Description length: ${SITE_DESCRIPTION.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
