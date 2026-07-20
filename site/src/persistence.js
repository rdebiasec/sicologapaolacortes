import { LEAD_POLICY_VERSION } from './legal/constants.js'

const STORAGE_KEYS = {
  whatsappEvents: 'pc_local_whatsapp_events_v1',
  leadSubmissions: 'pc_local_leads_v1',
  leadDraft: 'pc_local_lead_draft_v1'
}

const MAX_WHATSAPP_EVENTS = 120
const MAX_LOCAL_LEADS = 40
const LEAD_RETENTION_DAYS = 180

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function nowIso() {
  return new Date().toISOString()
}

function futureIso(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function currentContext() {
  return {
    source: window.location.origin,
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || ''
  }
}

function normalizeList(value) {
  return Array.isArray(value) ? value : []
}

function clearExpiredLeads() {
  const now = Date.now()
  const leads = normalizeList(readJson(STORAGE_KEYS.leadSubmissions, []))
  const valid = leads.filter((item) => {
    if (!item || !item.expiresAt) return false
    const expiry = Date.parse(item.expiresAt)
    return Number.isFinite(expiry) && expiry > now
  })
  writeJson(STORAGE_KEYS.leadSubmissions, valid)
  return valid
}

function localId(prefix = 'local') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

export function persistWhatsAppClick({ boton }) {
  if (!boton) return
  const events = normalizeList(readJson(STORAGE_KEYS.whatsappEvents, []))
  const item = {
    id: localId('wa'),
    eventName: 'click_whatsapp',
    boton,
    happenedAt: nowIso(),
    ...currentContext()
  }
  events.push(item)
  writeJson(STORAGE_KEYS.whatsappEvents, events.slice(-MAX_WHATSAPP_EVENTS))
}

export function persistLeadSubmission(input) {
  const leads = clearExpiredLeads()
  const payload = {
    id: localId('lead'),
    name: input.name || null,
    contactChannel: input.contactChannel || 'whatsapp',
    contactValue: input.contactValue || '',
    interestChannel: input.interestChannel || 'general',
    messageShort: input.messageShort || null,
    consentGiven: true,
    policyVersion: LEAD_POLICY_VERSION || 'v1.0',
    consentText: input.consentText,
    happenedAt: nowIso(),
    expiresAt: futureIso(LEAD_RETENTION_DAYS),
    ...currentContext()
  }

  leads.push(payload)
  const ok = writeJson(STORAGE_KEYS.leadSubmissions, leads.slice(-MAX_LOCAL_LEADS))
  if (!ok) throw new Error('No fue posible guardar en el navegador.')
  clearLeadDraft()
  return { ok: true, leadId: payload.id }
}

export function saveLeadDraft(draft) {
  const payload = {
    name: draft.name || '',
    contactChannel: draft.contactChannel || 'whatsapp',
    contactValue: draft.contactValue || '',
    interestChannel: draft.interestChannel || 'general',
    messageShort: draft.messageShort || '',
    updatedAt: nowIso()
  }
  writeJson(STORAGE_KEYS.leadDraft, payload)
}

export function readLeadDraft() {
  const draft = readJson(STORAGE_KEYS.leadDraft, null)
  return draft && typeof draft === 'object' ? draft : null
}

export function clearLeadDraft() {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.leadDraft)
  } catch {
    // noop
  }
}

export function clearLocalLeadData() {
  clearLeadDraft()
  try {
    window.localStorage.removeItem(STORAGE_KEYS.leadSubmissions)
  } catch {
    // noop
  }
}
