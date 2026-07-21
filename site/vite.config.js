import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

function allowInlineStylesInDevCsp() {
  return {
    name: 'allow-inline-styles-in-dev-csp',
    apply: 'serve',
    transformIndexHtml(html) {
      const cspPattern = /<meta\s+http-equiv="Content-Security-Policy"[^>]*>/i
      if (!cspPattern.test(html)) return html
      return html.replace(cspPattern, (tag) =>
        tag
          .replace(
            "style-src 'self' https://fonts.googleapis.com;",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
          )
          .replace(/\s*;?\s*upgrade-insecure-requests\b/, '')
      )
    }
  }
}

const normalizeBase = (value) => {
  if (!value || value === '/') return '/'
  const withLeading = value.startsWith('/') ? value : `/${value}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = normalizeBase(env.VITE_BASE_PATH)

  return {
    plugins: [allowInlineStylesInDevCsp()],
    base,
    build: {
      target: 'es2020',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          privacy: resolve(__dirname, 'privacidad/index.html'),
          notFound: resolve(__dirname, '404.html')
        }
      }
    },
    server: {
      port: 5181,
      strictPort: true,
      host: 'localhost'
    },
    preview: {
      port: 5181,
      strictPort: true,
      host: 'localhost'
    }
  }
})
