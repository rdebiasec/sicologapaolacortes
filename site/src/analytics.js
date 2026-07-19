import { GA4_ID } from './legal/constants.js'
import { persistWhatsAppClick } from './persistence.js'

function isValidGa4Id(id) {
  return typeof id === 'string' && /^G-[A-Z0-9]+$/i.test(id)
}

export function initAnalytics() {
  const id = (import.meta.env.VITE_GA4_ID || GA4_ID || '').trim()
  if (!isValidGa4Id(id)) return

  if (document.getElementById('ga4-script')) return

  const script = document.createElement('script')
  script.id = 'ga4-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', id)
}

export function trackWhatsAppClick(boton) {
  persistWhatsAppClick({ boton })
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'click_whatsapp', { boton })
}

export function trackEvent(name, params = {}) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
