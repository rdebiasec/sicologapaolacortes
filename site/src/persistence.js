import { API_BASE_URL, LEAD_POLICY_VERSION, apiUrl } from './legal/constants.js'

function getClientContext() {
  return {
    source: window.location.origin,
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || '',
    userAgent: navigator.userAgent || 'desconocido'
  }
}

function postJson(path, payload, { useBeacon = false } = {}) {
  const url = apiUrl(path)
  if (!API_BASE_URL || !url) return Promise.resolve({ ok: false, skipped: true })

  const body = JSON.stringify(payload)
  if (useBeacon && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' })
    const sent = navigator.sendBeacon(url, blob)
    return Promise.resolve({ ok: sent, beacon: true })
  }

  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-store',
    keepalive: true,
    headers: { 'content-type': 'application/json' },
    body
  })
}

export function persistWhatsAppClick({ boton }) {
  if (!boton) return
  const payload = {
    eventName: 'click_whatsapp',
    boton,
    happenedAt: new Date().toISOString(),
    ...getClientContext()
  }
  postJson('/v1/events/whatsapp-click', payload, { useBeacon: true }).catch(() => {})
}

export async function persistLeadSubmission(input) {
  const payload = {
    name: input.name || null,
    contactChannel: input.contactChannel,
    contactValue: input.contactValue,
    interestChannel: input.interestChannel || 'general',
    messageShort: input.messageShort || null,
    consentGiven: true,
    policyVersion: LEAD_POLICY_VERSION || 'v1.0',
    consentText: input.consentText,
    happenedAt: new Date().toISOString(),
    ...getClientContext()
  }

  const response = await postJson('/v1/leads', payload)
  if (!response || typeof response.ok !== 'boolean') {
    throw new Error('No fue posible conectar con el API.')
  }
  if (!response.ok) {
    throw new Error('No fue posible guardar tus datos de contacto.')
  }
  return response.json()
}

export function apiPersistenceEnabled() {
  return Boolean(API_BASE_URL)
}
