/** Business facts — leave PENDIENTE values unset; UI shows “próximamente”. */
export const COMPANY_LEGAL_NAME = 'Psicóloga Paola Cortés'
export const SITE_NAME_SHORT = 'Paola Cortés'
export const SITE_TITLE =
  'Psicóloga Paola Cortés | Terapia online individual, de pareja y familia'
export const SITE_DESCRIPTION =
  'Terapia online en español con la psicóloga Paola Cortés. Acompañamiento individual, de pareja y familia desde Colombia, también si vives en el exterior.'

/** [PENDIENTE-1] WhatsApp with country code, digits only (e.g. 57XXXXXXXXXX). Empty = próximamente */
export const WHATSAPP_NUMBER = ''

/** [PENDIENTE-10] Email — leave empty to hide */
export const CONTACT_EMAIL = ''

/** [PENDIENTE-11] */
export const BUSINESS_HOURS = ''

/** [PENDIENTE-12] Instagram handle without @ — leave empty for próximamente */
export const INSTAGRAM_HANDLE = ''

/** [PENDIENTE-13] */
export const SITE_URL = 'https://example.com'

/** [PENDIENTE-14] GA4 ID (G-XXXXXXXXXX). Empty = analytics off */
export const GA4_ID = ''

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
