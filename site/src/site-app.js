import './style.css'
import {
  COMPANY_LEGAL_NAME,
  SITE_NAME_SHORT,
  SITE_TITLE,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  BUSINESS_HOURS,
  SITE_URL,
  API_BASE_URL,
  LEAD_POLICY_VERSION,
  OG_IMAGE,
  BUSINESS_LOCATION,
  href,
  absoluteUrl,
  instagramUrl
} from './legal/constants.js'
import {
  nav,
  familiarPhrases,
  services,
  processSteps,
  firstSessionPoints,
  faq
} from './content/site-content.js'
import { escapeHtml } from './security/html.js'
import { initAnalytics } from './analytics.js'
import { renderWhatsAppButton, bindWhatsAppTracking } from './whatsapp.js'
import { persistLeadSubmission } from './persistence.js'

function pending(label = 'próximamente') {
  return `<span class="pending-inline">${escapeHtml(label)}</span>`
}

function setMeta({ title, description, path = '' }) {
  document.title = title
  const desc = document.querySelector('meta[name="description"]')
  if (desc) desc.setAttribute('content', description)

  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.setAttribute('content', title)
  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) ogDesc.setAttribute('content', description)
  const ogUrl = document.querySelector('meta[property="og:url"]')
  if (ogUrl) ogUrl.setAttribute('content', absoluteUrl(path))
  const ogImage = document.querySelector('meta[property="og:image"]')
  if (ogImage) ogImage.setAttribute('content', absoluteUrl(OG_IMAGE))
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) canonical.setAttribute('href', absoluteUrl(path))
}

function injectSchema() {
  if (document.getElementById('psychologist-schema')) return
  const script = document.createElement('script')
  script.id = 'psychologist-schema'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Psychologist',
    name: COMPANY_LEGAL_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    image: absoluteUrl('favicon.svg'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bogotá',
      addressCountry: 'CO'
    },
    areaServed: ['Colombia', 'Online'],
    availableLanguage: 'Spanish'
  })
  document.head.appendChild(script)
}

function photoPlaceholder(size = 'lg') {
  return `
    <div class="photo-placeholder photo-placeholder-${size}" role="img" aria-label="Foto de Paola Cortés — próximamente">
      <span class="photo-initials">PC</span>
      <span class="pending-note">próximamente</span>
    </div>
  `
}

function serviceIcon(index) {
  const icons = [
    // person
    '<path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    // teen / users
    '<path d="M8 11a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM3 20a5 5 0 0110 0M11 20a5 5 0 0110 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    // couple hearts simplified
    '<path d="M12 19s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 9c0 5.5-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    // family
    '<path d="M8 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm8 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM4 19a4 4 0 018 0M12 19a4 4 0 018 0M12 13a2 2 0 100-4 2 2 0 000 4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    // grief / leaf
    '<path d="M12 21V9m0 0c4-1 7-4 8-8-4 1-7 4-8 8zm0 0C8 8 5 5 4 1c1 4 4 7 8 8z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    // book / education
    '<path d="M4 5h7a3 3 0 013 3v11a2.5 2.5 0 00-2.5-2.5H4V5zm16 0h-7a3 3 0 00-3 3v11a2.5 2.5 0 012.5-2.5H20V5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    // urgency clock
    '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  ]
  return `<svg class="service-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[index % icons.length]}</svg>`
}

function renderHeader(active = 'home') {
  const links = nav
    .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
    .join('')

  return `
    <a class="skip-link" href="#main-content">Saltar al contenido</a>
    <header class="site-header" data-header>
      <div class="header-inner">
        <a href="${escapeHtml(href(''))}#inicio" class="logo" aria-label="${escapeHtml(COMPANY_LEGAL_NAME)} — inicio">
          <span class="logo-mark">PC</span>
          <span class="logo-text">${escapeHtml(SITE_NAME_SHORT)}</span>
        </a>
        <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Abrir menú">
          <span></span><span></span>
        </button>
        <nav id="primary-nav" aria-label="Navegación principal">
          ${links}
          ${renderWhatsAppButton('Escríbeme', 'navbar', 'primary')}
        </nav>
      </div>
    </header>
  `
}

function renderHero() {
  return `
    <section id="inicio" class="hero section">
      <div class="hero-inner">
        <div class="chat-bubbles" aria-hidden="true">
          <div class="bubble bubble-left">No sé por dónde empezar…</div>
          <div class="bubble bubble-right">Empecemos por aquí.</div>
        </div>
        <h1>Un espacio seguro para entenderte, sanar y estar mejor.</h1>
        <p class="hero-lead">
          Soy Paola Cortés, psicóloga. Acompaño procesos de terapia individual, de pareja y de familia,
          100% online, estés en Colombia o en el exterior.
        </p>
        <div class="hero-actions">
          ${renderWhatsAppButton('Escríbeme por WhatsApp', 'hero', 'primary')}
          <a class="btn-link" href="#como-funciona">Conoce cómo trabajo →</a>
        </div>
        <p class="hero-micro">Atención en español · Respuesta en horario de atención</p>
      </div>
    </section>
  `
}

function renderAbout() {
  return `
    <section id="sobre-mi" class="section section-alt">
      <div class="section-inner about-grid">
        <div class="about-photo">
          ${photoPlaceholder('lg')}
        </div>
        <div class="about-copy">
          <h2>Hola, soy Paola.</h2>
          <p>
            Soy psicóloga ${pending('universidad y título — próximamente')} con
            ${pending('años de experiencia — próximamente')} de experiencia acompañando a adolescentes,
            adultos, parejas y familias. Trabajo desde la psicología humanista y el enfoque cognitivo-conductual:
            esto significa que en consulta encontrarás un espacio cálido y sin juicios, junto con herramientas
            prácticas para los retos que estás viviendo.
          </p>
          <p>
            Me he especializado en procesos de duelo, dificultades emocionales de la adolescencia y la adultez,
            relaciones de pareja y dinámicas familiares. Creo profundamente que pedir ayuda no es debilidad:
            es el primer paso para estar mejor.
          </p>
          <p class="trust-line">Tarjeta profesional No. ${pending('próximamente')}</p>
        </div>
      </div>
    </section>
  `
}

function renderFamiliar() {
  const cards = familiarPhrases
    .map((phrase) => `<blockquote class="quote-card"><p>“${escapeHtml(phrase)}”</p></blockquote>`)
    .join('')

  return `
    <section id="es-para-mi" class="section">
      <div class="section-inner">
        <h2>¿Te suena familiar?</h2>
        <div class="quote-grid">${cards}</div>
        <p class="section-close">
          Si te identificas con alguna de estas frases, la terapia puede ayudarte.
          No tienes que esperar a estar “muy mal” para pedir apoyo.
        </p>
        <div class="section-actions">
          ${renderWhatsAppButton('Escríbeme por WhatsApp', 'es_para_mi', 'outline')}
        </div>
      </div>
    </section>
  `
}

function renderServices() {
  const cards = services
    .map(
      (s, i) => `
      <article class="service-card">
        ${serviceIcon(i)}
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.body)}</p>
      </article>`
    )
    .join('')

  return `
    <section id="servicios" class="section section-alt">
      <div class="section-inner">
        <h2>¿En qué te puedo acompañar?</h2>
        <div class="services-grid">${cards}</div>
        <p class="section-close">
          Todas las sesiones son online, por videollamada.
          ${pending('presencial — próximamente')}
        </p>
      </div>
    </section>
  `
}

function renderHowItWorks() {
  const steps = processSteps
    .map(
      (step, i) => `
      <li class="step-card">
        <span class="step-num" aria-hidden="true">${i + 1}</span>
        <div>
          <h3>${escapeHtml(step.title)}</h3>
          <p>${escapeHtml(step.body)}</p>
        </div>
      </li>`
    )
    .join('')

  return `
    <section id="como-funciona" class="section">
      <div class="section-inner">
        <h2>¿Cómo funciona?</h2>
        <ol class="steps-list">${steps}</ol>
        <div class="section-actions">
          ${renderWhatsAppButton('Dar el primer paso →', 'primera_sesion', 'primary')}
        </div>
      </div>
    </section>
  `
}

function renderFirstSession() {
  const items = firstSessionPoints.map((p) => `<li>${escapeHtml(p)}</li>`).join('')
  return `
    <section id="primera-sesion" class="section section-alt">
      <div class="section-inner narrow">
        <h2>Tu primera sesión: qué esperar</h2>
        <ul class="soft-bullets">${items}</ul>
      </div>
    </section>
  `
}

function renderFaq() {
  const items = faq
    .map((item, i) => {
      const answer = item.a
        ? escapeHtml(item.a)
        : `<span class="pending-inline">próximamente</span>`
      return `
        <div class="faq-item">
          <button type="button" class="faq-trigger" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="faq-panel-${i}" id="faq-btn-${i}">
            ${escapeHtml(item.q)}
            <span class="faq-chevron" aria-hidden="true"></span>
          </button>
          <div class="faq-panel" id="faq-panel-${i}" role="region" aria-labelledby="faq-btn-${i}" ${i === 0 ? '' : 'hidden'}>
            <p>${answer}</p>
          </div>
        </div>`
    })
    .join('')

  return `
    <section id="preguntas" class="section">
      <div class="section-inner narrow">
        <h2>Preguntas frecuentes</h2>
        <div class="faq-list">${items}</div>
      </div>
    </section>
  `
}

function renderUrgency() {
  return `
    <section id="urgencias" class="section section-urgency">
      <div class="section-inner narrow">
        <h2>¿Necesitas ayuda urgente?</h2>
        <p>
          Si estás atravesando un momento difícil que no puede esperar, escríbeme:
          ofrezco sesiones de urgencia, incluso fuera del horario habitual.
        </p>
        <div class="section-actions">
          ${renderWhatsAppButton(
            'Necesito una sesión urgente',
            'urgencias',
            'primary',
            'Hola Paola, necesito una sesión de urgencia'
          )}
        </div>
        <p class="urgency-note">
          Importante: si existe un riesgo inmediato para tu vida o la de otra persona,
          comunícate de inmediato con la <strong>Línea 106</strong> (Bogotá, 24 horas)
          o la <strong>Línea 123</strong>, o acude al servicio de urgencias más cercano.
        </p>
      </div>
    </section>
  `
}

function renderContact() {
  const ig = instagramUrl()
  const emailBlock = CONTACT_EMAIL
    ? `<p><a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a></p>`
    : `<p>Correo: ${pending()}</p>`
  const hoursBlock = BUSINESS_HOURS
    ? `<p>Horarios: ${escapeHtml(BUSINESS_HOURS)}</p>`
    : `<p>Horarios de atención: ${pending()}</p>`
  const igBlock = ig
    ? `<p><a href="${escapeHtml(ig)}" target="_blank" rel="noopener noreferrer">Instagram @${escapeHtml(ig.split('/').filter(Boolean).pop())}</a></p>`
    : `<p>Instagram: ${pending()}</p>`

  const leadForm = renderLeadForm()

  return `
    <section id="contacto" class="section">
      <div class="section-inner narrow contact-block">
        <h2>Hablemos.</h2>
        <p class="section-lead">El primer paso es una conversación. Escríbeme y te responderé personalmente.</p>
        <div class="section-actions">
          ${renderWhatsAppButton('Escríbeme por WhatsApp', 'contacto', 'primary')}
        </div>
        ${leadForm}
        <div class="contact-meta">
          ${emailBlock}
          ${hoursBlock}
          ${igBlock}
          <p class="contact-location">${escapeHtml(BUSINESS_LOCATION)} · Atención online</p>
        </div>
      </div>
    </section>
  `
}

function renderLeadForm() {
  if (!API_BASE_URL) {
    return `
      <div class="lead-form-panel is-pending">
        <h3>Formulario de contacto</h3>
        <p>Esta opción se está activando para guardar solicitudes con consentimiento explícito.</p>
        <p class="pending-note">próximamente</p>
      </div>
    `
  }

  const consentText =
    'Autorizo el tratamiento de mis datos de contacto para responder mi solicitud, conforme a la Ley 1581 de 2012.'

  return `
    <form class="lead-form-panel lead-form" data-lead-form novalidate>
      <h3>También puedes dejar tus datos aquí</h3>
      <p class="lead-form-disclaimer">
        Este formulario es solo para contacto inicial. No incluyas detalles clínicos sensibles.
      </p>
      <div class="lead-grid">
        <label>
          Nombre (opcional)
          <input type="text" name="name" maxlength="120" autocomplete="name" />
        </label>
        <label>
          Canal preferido
          <select name="contactChannel" required>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Correo</option>
            <option value="phone">Llamada</option>
          </select>
        </label>
      </div>
      <label>
        Dato de contacto
        <input type="text" name="contactValue" minlength="3" maxlength="190" required autocomplete="off" />
      </label>
      <label>
        Tema general
        <select name="interestChannel" required>
          <option value="individual">Terapia individual</option>
          <option value="pareja">Terapia de pareja</option>
          <option value="familia">Terapia familiar</option>
          <option value="duelo">Proceso de duelo</option>
          <option value="ansiedad">Ansiedad / regulación emocional</option>
          <option value="depresion">Estado de ánimo</option>
          <option value="urgencia">Acompañamiento urgente</option>
          <option value="general">Otro tema</option>
        </select>
      </label>
      <label>
        Mensaje breve (opcional)
        <textarea name="messageShort" maxlength="500" rows="3" placeholder="Ejemplo: Quiero conocer disponibilidad y costo."></textarea>
      </label>
      <label class="consent-check">
        <input type="checkbox" name="consentGiven" required />
        <span>
          Acepto el tratamiento de mis datos de contacto para que me respondan esta solicitud.
          Leí la <a href="${escapeHtml(href('privacidad/'))}" target="_blank" rel="noopener noreferrer">política de privacidad</a>.
        </span>
      </label>
      <input type="hidden" name="consentText" value="${escapeHtml(consentText)}" />
      <input type="hidden" name="policyVersion" value="${escapeHtml(LEAD_POLICY_VERSION || 'v1.0')}" />
      <button class="btn btn-outline" type="submit">Enviar solicitud</button>
      <p class="lead-form-status" data-lead-status role="status" aria-live="polite"></p>
    </form>
  `
}

function renderFooter() {
  const links = nav
    .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
    .join('')

  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <p class="footer-brand">${escapeHtml(COMPANY_LEGAL_NAME)} · Terapia online</p>
        <nav aria-label="Pie de página">
          ${links}
          <a href="${escapeHtml(href('privacidad/'))}">Política de privacidad</a>
        </nav>
        <p class="footer-copy">© 2026 · Sitio desarrollado por DBX Solutions</p>
      </div>
    </footer>
  `
}

function renderFloating() {
  return `
    ${renderWhatsAppButton('Escríbeme por WhatsApp', 'flotante', 'floating')}
    <div id="chatbot-slot" class="chatbot-slot" data-chatbot-slot hidden aria-hidden="true"><!-- ChatbotSlot: pegar aquí widget externo (convive o reemplaza el flotante WA) --></div>
  `
}

function renderPrivacyContent() {
  return `
    <section class="section privacy-page">
      <div class="section-inner narrow">
        <p class="privacy-banner">Documento base — pendiente de revisión final.</p>
        <h1>Política de privacidad</h1>
        <p>Responsable del tratamiento: <strong>${escapeHtml(COMPANY_LEGAL_NAME)}</strong>, ${escapeHtml(BUSINESS_LOCATION)}.</p>
        <h2>Marco legal</h2>
        <p>
          Esta política se elabora conforme a la Ley 1581 de 2012 de la República de Colombia
          y sus normas reglamentarias, relativas a la protección de datos personales.
        </p>
        <h2>Datos que podemos tratar</h2>
        <p>
          Si nos contactas por WhatsApp, correo u otros canales que indiquemos en este sitio,
          podemos recibir datos de identificación y contacto (nombre, número telefónico, correo),
          canal de interés y mensaje breve para responder la solicitud o agendar una sesión.
          Te pedimos no incluir información clínica sensible en el formulario web.
        </p>
        <h2>Finalidad</h2>
        <p>
          Responder solicitudes de contacto, orientar sobre los servicios de terapia online
          y coordinar el agendamiento de citas.
        </p>
        <h2>Consentimiento explícito</h2>
        <p>
          Antes de guardar una solicitud en base de datos, solicitamos autorización explícita
          y registramos versión de política, fecha, huella técnica de origen e información mínima
          necesaria para trazabilidad y seguridad.
        </p>
        <h2>Retención y eliminación</h2>
        <p>
          Los datos de contacto se conservan hasta por 180 días o menos si solicitas su eliminación.
          Puedes ejercer tus derechos de consulta, actualización, rectificación o supresión en cualquier momento.
        </p>
        <h2>Derechos del titular</h2>
        <p>
          Puedes conocer, actualizar, rectificar y solicitar la eliminación de tus datos,
          así como revocar la autorización cuando aplique, de acuerdo con la Ley 1581 de 2012.
        </p>
        <h2>Canal de contacto</h2>
        <p>
          Para ejercer tus derechos o consultar sobre el tratamiento de datos:
          ${CONTACT_EMAIL ? `<a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a>` : pending('correo — próximamente')}.
        </p>
        <p><a class="btn-link" href="${escapeHtml(href(''))}">← Volver al inicio</a></p>
      </div>
    </section>
  `
}

function bindHeader() {
  const header = document.querySelector('[data-header]')
  const toggle = document.querySelector('.nav-toggle')
  const onScroll = () => {
    if (!header) return
    header.classList.toggle('is-scrolled', window.scrollY > 24)
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  toggle?.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open')
    toggle.setAttribute('aria-expanded', String(open))
  })

  document.querySelectorAll('#primary-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open')
      toggle?.setAttribute('aria-expanded', 'false')
    })
  })
}

function bindFaq() {
  const triggers = document.querySelectorAll('.faq-trigger')
  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true'
      triggers.forEach((other) => {
        other.setAttribute('aria-expanded', 'false')
        const panel = document.getElementById(other.getAttribute('aria-controls'))
        if (panel) panel.hidden = true
      })
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true')
        const panel = document.getElementById(btn.getAttribute('aria-controls'))
        if (panel) panel.hidden = false
      }
    })
  })
}

function bindScrollFades() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const sections = document.querySelectorAll('main > section:not(.hero)')
  sections.forEach((section) => {
    section.classList.add('fade-section')
    if (reduce) {
      section.classList.add('is-visible')
      return
    }
  })
  if (reduce) return
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )
  sections.forEach((s) => io.observe(s))
}

function bindShell() {
  initAnalytics()
  bindHeader()
  bindFaq()
  bindWhatsAppTracking(document)
  bindLeadForm()
  bindScrollFades()
}

function bindLeadForm() {
  const form = document.querySelector('[data-lead-form]')
  if (!form) return

  const status = form.querySelector('[data-lead-status]')
  const submit = form.querySelector('button[type="submit"]')
  const setStatus = (message, tone = 'info') => {
    if (!status) return
    status.textContent = message
    status.dataset.tone = tone
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const fields = new FormData(form)

    const consentGiven = fields.get('consentGiven') === 'on'
    if (!consentGiven) {
      setStatus('Debes autorizar el tratamiento de datos para enviar la solicitud.', 'error')
      return
    }

    const contactValue = String(fields.get('contactValue') || '').trim()
    if (contactValue.length < 3) {
      setStatus('Ingresa un dato de contacto válido.', 'error')
      return
    }

    submit?.setAttribute('disabled', 'disabled')
    setStatus('Enviando tu solicitud...', 'info')

    try {
      await persistLeadSubmission({
        name: String(fields.get('name') || '').trim(),
        contactChannel: String(fields.get('contactChannel') || 'whatsapp'),
        contactValue,
        interestChannel: String(fields.get('interestChannel') || 'general'),
        messageShort: String(fields.get('messageShort') || '').trim(),
        consentText: String(fields.get('consentText') || '').trim()
      })
      form.reset()
      setStatus('Gracias. Tu solicitud fue enviada y te responderé pronto.', 'success')
    } catch (error) {
      setStatus('No fue posible enviar el formulario. Intenta por WhatsApp mientras lo revisamos.', 'error')
    } finally {
      submit?.removeAttribute('disabled')
    }
  })
}

export function mountHome() {
  const app = document.querySelector('#app')
  if (!app) return
  setMeta({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: '' })
  injectSchema()
  app.innerHTML = `
    ${renderHeader()}
    <main id="main-content">
      ${renderHero()}
      ${renderAbout()}
      ${renderFamiliar()}
      ${renderServices()}
      ${renderHowItWorks()}
      ${renderFirstSession()}
      ${renderFaq()}
      ${renderUrgency()}
      ${renderContact()}
    </main>
    ${renderFooter()}
    ${renderFloating()}
  `
  bindShell()
}

export function mountPrivacy() {
  const app = document.querySelector('#app')
  if (!app) return
  setMeta({
    title: `Política de privacidad | ${SITE_NAME_SHORT}`,
    description: 'Política de tratamiento de datos personales — Psicóloga Paola Cortés.',
    path: 'privacidad/'
  })
  app.innerHTML = `
    ${renderHeader('privacidad')}
    <main id="main-content">
      ${renderPrivacyContent()}
    </main>
    ${renderFooter()}
    ${renderFloating()}
  `
  bindShell()
}

export function mountNotFound() {
  const app = document.querySelector('#app')
  if (!app) return
  setMeta({
    title: `Página no encontrada | ${SITE_NAME_SHORT}`,
    description: SITE_DESCRIPTION,
    path: '404.html'
  })
  app.innerHTML = `
    ${renderHeader()}
    <main id="main-content" class="section not-found">
      <div class="section-inner narrow">
        <h1>Parece que esta página no existe.</h1>
        <p>Pero si llegaste hasta aquí buscando apoyo, estoy para ayudarte.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${escapeHtml(href(''))}">Ir al inicio</a>
          ${renderWhatsAppButton('Escríbeme por WhatsApp', 'pagina_404', 'outline')}
        </div>
      </div>
    </main>
    ${renderFooter()}
    ${renderFloating()}
  `
  bindShell()
}
