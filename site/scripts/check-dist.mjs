import { access } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '../dist')

const requiredFiles = ['index.html', 'privacidad/index.html', '404.html', 'favicon.svg', 'sitemap.xml']

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
  console.log(`check-dist: OK (${requiredFiles.length} files)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
