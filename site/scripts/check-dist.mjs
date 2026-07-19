import { access, readFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '../dist')

const requiredFiles = [
  'index.html',
  'privacidad/index.html',
  '404.html',
  'favicon.svg',
  'sitemap.xml',
  'robots.txt'
]

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function main() {
  const missing = []
  for (const file of requiredFiles) {
    if (!(await exists(resolve(distDir, file)))) missing.push(file)
  }
  if (missing.length) {
    console.error('check-dist: missing files:')
    missing.forEach((f) => console.error(`  - ${f}`))
    process.exit(1)
  }

  const home = await readFile(resolve(distDir, 'index.html'), 'utf8')
  const privacy = await readFile(resolve(distDir, 'privacidad/index.html'), 'utf8')
  const notFound = await readFile(resolve(distDir, '404.html'), 'utf8')
  const sitemap = await readFile(resolve(distDir, 'sitemap.xml'), 'utf8')
  const robots = await readFile(resolve(distDir, 'robots.txt'), 'utf8')
  const merged = [home, privacy, notFound, sitemap, robots].join('\n')

  if (/example\.com/i.test(merged)) {
    console.error('check-dist: found placeholder domain example.com in build output')
    process.exit(1)
  }

  const pages = [
    { name: 'index.html', value: home },
    { name: 'privacidad/index.html', value: privacy },
    { name: '404.html', value: notFound }
  ]
  for (const page of pages) {
    if (!/Content-Security-Policy/.test(page.value)) {
      console.error(`check-dist: ${page.name} missing Content-Security-Policy meta`)
      process.exit(1)
    }
    if (!/strict-origin-when-cross-origin/.test(page.value)) {
      console.error(`check-dist: ${page.name} missing referrer policy meta`)
      process.exit(1)
    }
  }

  if (!/<link rel="canonical" href="https?:\/\/[^"]+"/.test(home)) {
    console.error('check-dist: index.html missing absolute canonical URL')
    process.exit(1)
  }
  if (!/<link rel="canonical" href="https?:\/\/[^"]+"/.test(privacy)) {
    console.error('check-dist: privacidad/index.html missing absolute canonical URL')
    process.exit(1)
  }

  console.log(`check-dist: OK (${requiredFiles.length} files + security/integrity checks)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
