/** Business facts for the public website. */
export const COMPANY_LEGAL_NAME = 'Psicóloga Paola Cortés'
export const SITE_NAME_SHORT = 'Paola Cortés'
export const SITE_TITLE =
  'Psicóloga Paola Cortés | Terapia online individual, de pareja y familia'
export const SITE_DESCRIPTION =
  'Terapia online en español con la psicóloga Paola Cortés. Acompañamiento individual, de pareja y familia desde Colombia, también si vives en el exterior.'

const viteEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}
const nodeEnv = typeof process !== 'undefined' && process.env ? process.env : {}

function normalizeUrl(input, fallbackProtocol = 'https') {
  const raw = String(input || '').trim()
  if (!raw) return ''
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `${fallbackProtocol}://${raw}`
  return withProtocol.replace(/\/+$/, '')
}

/** WhatsApp in E.164 without + (example: 573001234567). */
const rawWhatsApp = String(viteEnv.VITE_WHATSAPP_NUMBER || nodeEnv.VITE_WHATSAPP_NUMBER || '')
export const WHATSAPP_NUMBER = rawWhatsApp.replace(/\D/g, '')

/** Public contact email. Leave empty to hide. */
export const CONTACT_EMAIL = String(viteEnv.VITE_CONTACT_EMAIL || nodeEnv.VITE_CONTACT_EMAIL || '').trim()

/** Human-friendly business hours text. */
export const BUSINESS_HOURS = String(viteEnv.VITE_BUSINESS_HOURS || nodeEnv.VITE_BUSINESS_HOURS || '').trim()

/** Instagram handle without @. Leave empty to hide. */
export const INSTAGRAM_HANDLE = String(viteEnv.VITE_INSTAGRAM_HANDLE || nodeEnv.VITE_INSTAGRAM_HANDLE || '')
  .trim()
  .replace(/^@/, '')

/** Public base URL used in canonical/OG/sitemap. */
const configuredSiteUrl = normalizeUrl(viteEnv.VITE_SITE_URL || nodeEnv.VITE_SITE_URL)
export const SITE_URL = configuredSiteUrl || 'http://localhost:5181'

/** GA4 measurement ID (G-XXXXXXXXXX). Leave empty to disable analytics. */
export const GA4_ID = String(viteEnv.VITE_GA4_ID || nodeEnv.VITE_GA4_ID || '').trim()

/** Professional profile data shown in the "Sobre mí" section. */
export const PROFESSIONAL_CREDENTIAL = String(
  viteEnv.VITE_PROFESSIONAL_CREDENTIAL ||
    nodeEnv.VITE_PROFESSIONAL_CREDENTIAL ||
    'egresada de la Universidad del Norte'
).trim()

export const PROFESSIONAL_EXPERIENCE = String(
  viteEnv.VITE_PROFESSIONAL_EXPERIENCE || nodeEnv.VITE_PROFESSIONAL_EXPERIENCE || 'más de 20 años'
).trim()

/** Optional: professional license number shown publicly when available. */
export const PROFESSIONAL_LICENSE = String(
  viteEnv.VITE_PROFESSIONAL_LICENSE || nodeEnv.VITE_PROFESSIONAL_LICENSE || ''
).trim()

/** Public version string for local consent records. */
export const LEAD_POLICY_VERSION = String(
  viteEnv.VITE_LEAD_POLICY_VERSION || nodeEnv.VITE_LEAD_POLICY_VERSION || 'v1.0'
).trim()

export const OG_IMAGE = 'og-image.svg'
export const BUSINESS_LOCATION = 'Bogotá, Colombia'

export function baseUrl() {
  const b = import.meta.env.BASE_URL || '/'
  return b.endsWith('/') ? b : `${b}/`
}

export function href(path) {
  const root = baseUrl()
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${root}${clean}`
}

export function absoluteUrl(path = '') {
  const relative = href(path).replace(/^\//, '')
  return relative ? `${SITE_URL}/${relative}` : SITE_URL
}

export function instagramUrl() {
  if (!INSTAGRAM_HANDLE) return ''
  return `https://www.instagram.com/${INSTAGRAM_HANDLE}/`
}
