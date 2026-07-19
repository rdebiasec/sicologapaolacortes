import { writeFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, COMPANY_LEGAL_NAME } from '../src/legal/constants.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')

const routes = [
  { path: '', priority: '1.0' },
  { path: 'privacidad/', priority: '0.4' }
]

function pageUrl(path) {
  return path ? `${SITE_URL}/${path.replace(/\/$/, '')}/` : `${SITE_URL}/`
}

async function main() {
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
  console.log(`SEO: sitemap + robots for ${COMPANY_LEGAL_NAME} (${SITE_TITLE.slice(0, 40)}…)`)
  console.log(`Description length: ${SITE_DESCRIPTION.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
