import './style.css'
import {
  COMPANY_LEGAL_NAME,
  SITE_NAME_SHORT,
  SITE_TITLE,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  BUSINESS_HOURS,
  SITE_URL,
  LEAD_POLICY_VERSION,
  OG_IMAGE,
  BUSINESS_LOCATION,
  BUSINESS_CITY,
  LOCATION_MODALITIES,
  LOCATION_MODALITIES_SHORT,
  PROFESSIONAL_CREDENTIAL,
  PROFESSIONAL_EXPERIENCE,
  PROFESSIONAL_LICENSE,
  href,
  absoluteUrl,
  instagramUrl
} from './legal/constants.js'
import {
  nav,
  familiarPhrases,
  voiceQuotes,
  methodTool,
  authorityMoments,
  services,
  processSteps,
  firstSessionPoints,
  experienceHighlights,
  faq
} from './content/site-content.js'
import { escapeHtml } from './security/html.js'
import { initAnalytics, trackEvent } from './analytics.js'
import { renderWhatsAppButton, bindWhatsAppTracking, isWhatsAppReady } from './whatsapp.js'
import {
  persistLeadSubmission,
  saveLeadDraft,
  readLeadDraft,
  clearLocalLeadData
} from './persistence.js'

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
    image: absoluteUrl(OG_IMAGE),
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS_CITY,
      addressCountry: 'CO'
    },
    areaServed: ['Worldwide', 'Barranquilla', 'Bogotá', 'Colombia', 'Online'],
    availableLanguage: 'Spanish'
  })
  document.head.appendChild(script)
}

/**
 * Renders a responsive picture. `base` is the asset path without extension so
 * the browser can pick WebP and fall back to JPEG.
 */
function responsivePicture(base, alt, { width, height, eager = false, className = '' } = {}) {
  const loading = eager
    ? 'fetchpriority="high" decoding="async"'
    : 'loading="lazy" decoding="async"'
  return `
    <picture${className ? ` class="${escapeHtml(className)}"` : ''}>
      <source srcset="${escapeHtml(href(`${base}.webp`))}" type="image/webp" />
      <img
        src="${escapeHtml(href(`${base}.jpg`))}"
        alt="${escapeHtml(alt)}"
        width="${width}"
        height="${height}"
        ${loading}
      />
    </picture>
  `
}

function portraitImage(base, alt, className = 'portrait-photo') {
  return `
    <figure class="${escapeHtml(className)}">
      ${responsivePicture(base, alt, { width: 913, height: 1186 })}
    </figure>
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
          ${renderWhatsAppButton('Agendar por WhatsApp', 'navbar', 'primary')}
        </nav>
      </div>
    </header>
  `
}

function renderHero() {
  const trustPills = ['Universidad del Norte', 'Gestalt · México', '+20 años']
    .map((item) => `<span class="trust-pill">${escapeHtml(item)}</span>`)
    .join('')

  const primaryCta = isWhatsAppReady()
    ? renderWhatsAppButton(
        'Quiero dar el primer paso',
        'hero',
        'primary',
        'Hola Paola, quiero dar el primer paso y agendar una primera conversación.'
      )
    : '<a class="btn btn-primary" href="#contacto">Quiero dar el primer paso</a>'

  return `
    <section id="inicio" class="hero section">
      <div class="section-inner hero-grid">
        <div class="hero-copy">
          <p class="hero-kicker">Psicóloga · +20 años acompañando procesos</p>
          <h1>Cuando todo se siente demasiado, aquí puedes empezar a aliviarte.</h1>
          <p class="hero-lead">
            Soy Paola Cortés. Te acompaño en terapia individual, de pareja y de familia —con calidez,
            herramientas claras y total confidencialidad. El primer paso es una conversación por WhatsApp,
            sin compromiso.
          </p>
          <div class="hero-trust" aria-label="Señales de confianza">
            ${trustPills}
          </div>
          <div class="hero-actions">
          ${primaryCta}
          <a class="btn btn-outline" href="#es-para-mi">¿Te suena familiar?</a>
          </div>
          <p class="hero-micro">Te respondo el mismo día hábil · En español · Sin presión</p>
        </div>
        <aside class="hero-media" aria-label="Presentación profesional">
          <div class="hero-photo-card">
            ${responsivePicture('images/portrait-hero', 'Retrato profesional de la psicóloga Paola Cortés', {
              width: 960,
              height: 1280,
              eager: true
            })}
          </div>
          <div class="hero-modality-note" aria-label="Modalidades de atención">
            <p class="teaser-title">Empieza donde estés</p>
            <p class="teaser-copy">${escapeHtml(LOCATION_MODALITIES_SHORT)}</p>
          </div>
        </aside>
      </div>
    </section>
  `
}

function trustExpertIcon(kind) {
  const icons = {
    formation:
      '<path d="M12 3l9 5-9 5-9-5 9-5zm0 10l9-5v6.5a1.5 1.5 0 01-.8 1.3L12 21l-8.2-5.2A1.5 1.5 0 013 14.5V8l9 5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    method:
      '<path d="M12 21a9 9 0 100-18 9 9 0 000 18z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 12.5l2.2 2.2L15.5 9.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    care:
      '<path d="M12 20s-7-4.3-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.7-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>'
  }
  return `<svg class="trust-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[kind]}</svg>`
}

function renderTrustHighlights() {
  const experts = [
    {
      kind: 'formation',
      role: 'Psicóloga clínica',
      title: 'Formación sólida',
      body: `${PROFESSIONAL_CREDENTIAL[0].toUpperCase()}${PROFESSIONAL_CREDENTIAL.slice(1)}. Especialidad Gestalt · ${PROFESSIONAL_EXPERIENCE}.`
    },
    {
      kind: 'method',
      role: 'Método humano',
      title: 'Enfoque práctico',
      body: 'Humanista + Gestalt: amor propio, emociones y comunicación familiar con herramientas aplicables.'
    },
    {
      kind: 'care',
      role: 'Ética profesional',
      title: 'Confianza real',
      body: PROFESSIONAL_LICENSE
        ? `Tarjeta profesional No. ${PROFESSIONAL_LICENSE}. Atención confidencial y centrada en ti.`
        : 'Atención confidencial y centrada en ti. Credenciales verificables al agendar.'
    }
  ]

  const cards = experts
    .map(
      (item) => `
      <article class="trust-card">
        <div class="trust-card-top">
          <span class="trust-icon-wrap">${trustExpertIcon(item.kind)}</span>
          <span class="trust-role">${escapeHtml(item.role)}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>`
    )
    .join('')

  return `
    <section class="trust-strip" aria-label="Por qué confiar en este acompañamiento">
      <div class="section-inner">
        <div class="trust-grid">
          ${cards}
        </div>
      </div>
    </section>
  `
}

function renderAbout() {
  const trustLine = PROFESSIONAL_LICENSE
    ? `Tarjeta profesional No. ${escapeHtml(PROFESSIONAL_LICENSE)}`
    : 'Credenciales profesionales disponibles para verificación al momento de agendar.'

  const aboutCta = isWhatsAppReady()
    ? renderWhatsAppButton(
        'Quiero empezar con Paola',
        'sobre-mi',
        'primary',
        'Hola Paola, leí tu perfil y quiero agendar una primera conversación.'
      )
    : '<a class="btn btn-primary" href="#contacto">Quiero empezar con Paola</a>'

  return `
    <section id="sobre-mi" class="section section-alt">
      <div class="section-inner about-grid">
        <div class="about-photo">
          ${portraitImage(
            'images/portrait-about',
            'Paola Cortés en conferencia en la Universidad del Norte',
            'about-portrait'
          )}
        </div>
        <div class="about-copy">
          <h2>Hola, soy Paola.</h2>
          <p>
            Psicóloga ${escapeHtml(PROFESSIONAL_CREDENTIAL)}, con especialidad en Orientación y
            Psicoterapia Gestalt (México) y ${escapeHtml(PROFESSIONAL_EXPERIENCE)} acompañando a
            adolescentes, adultos, parejas y familias.
          </p>
          <p>
            En consulta encontrarás un espacio sin juicios y con herramientas concretas: amor propio,
            emociones, comunicación familiar y relaciones más sanas. No vienes a “cumplir un protocolo”:
            vienes a entenderte y a estar mejor.
          </p>
          <ul class="soft-bullets about-experience">
            ${experienceHighlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
          <p class="trust-line">${trustLine}</p>
          <div class="section-actions">${aboutCta}</div>
        </div>
      </div>
    </section>
  `
}

function renderAuthority() {
  const cards = authorityMoments
    .map(
      (item, index) => `
      <figure class="authority-card${item.featured ? ' authority-card-featured' : ''}">
        <button
          type="button"
          class="authority-trigger"
          data-lightbox-index="${index}"
          aria-label="Ampliar imagen: ${escapeHtml(item.title)}"
        >
          ${responsivePicture(item.src, item.alt, { width: 640, height: 800 })}
          <span class="authority-zoom" aria-hidden="true">+</span>
        </button>
        <figcaption>
          <span class="authority-title">${escapeHtml(item.title)}</span>
          <span class="authority-caption">${escapeHtml(item.caption)}</span>
        </figcaption>
      </figure>`
    )
    .join('')

  const authorityCta = isWhatsAppReady()
    ? renderWhatsAppButton(
        'Quiero agendar con Paola',
        'autoridad',
        'primary',
        'Hola Paola, vi tu trayectoria y quiero agendar una primera conversación.'
      )
    : '<a class="btn btn-primary" href="#contacto">Quiero agendar con Paola</a>'

  const stats = [
    { value: '+20', label: 'años acompañando procesos' },
    { value: 'Congreso', label: 'y universidades nacionales' },
    { value: 'Virtual', label: 'desde cualquier parte del mundo' }
  ]
    .map(
      (stat) => `
      <div class="authority-stat">
        <span class="authority-stat-value">${escapeHtml(stat.value)}</span>
        <span class="authority-stat-label">${escapeHtml(stat.label)}</span>
      </div>`
    )
    .join('')

  return `
    <section id="trayectoria" class="section">
      <div class="section-inner">
        <h2>Trayectoria en pocas imágenes</h2>
        <p class="section-lead">
          Congreso, universidades, medios y educación emocional: la misma profesional que te acompaña en consulta.
        </p>
        <div class="authority-stats">${stats}</div>
        <div class="authority-grid">${cards}</div>
        <div class="section-actions">${authorityCta}</div>
      </div>
    </section>
  `
}

function renderLightbox() {
  return `
    <div class="lightbox" data-lightbox hidden>
      <div class="lightbox-backdrop" data-lightbox-close></div>
      <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
        <button type="button" class="lightbox-close" data-lightbox-close aria-label="Cerrar imagen">×</button>
        <button type="button" class="lightbox-nav lightbox-prev" data-lightbox-prev aria-label="Imagen anterior">‹</button>
        <figure class="lightbox-figure">
          <img data-lightbox-image src="" alt="" />
          <figcaption>
            <span id="lightbox-title" class="lightbox-title" data-lightbox-title></span>
            <span class="lightbox-caption" data-lightbox-caption></span>
          </figcaption>
        </figure>
        <button type="button" class="lightbox-nav lightbox-next" data-lightbox-next aria-label="Imagen siguiente">›</button>
      </div>
    </div>
  `
}

function bindLightbox(root = document) {
  const lightbox = root.querySelector('[data-lightbox]')
  if (!lightbox) return

  const image = lightbox.querySelector('[data-lightbox-image]')
  const titleEl = lightbox.querySelector('[data-lightbox-title]')
  const captionEl = lightbox.querySelector('[data-lightbox-caption]')
  const closeButton = lightbox.querySelector('.lightbox-close')
  const triggers = Array.from(root.querySelectorAll('[data-lightbox-index]'))
  let current = 0
  let lastFocused = null

  function show(index) {
    const total = authorityMoments.length
    current = (index + total) % total
    const item = authorityMoments[current]
    image.src = href(`${item.src}.jpg`)
    image.alt = item.alt
    titleEl.textContent = item.title
    captionEl.textContent = item.caption
  }

  function open(index) {
    lastFocused = document.activeElement
    show(index)
    lightbox.hidden = false
    document.body.classList.add('lightbox-open')
    closeButton.focus()
  }

  function close() {
    lightbox.hidden = true
    document.body.classList.remove('lightbox-open')
    if (lastFocused instanceof HTMLElement) lastFocused.focus()
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      open(Number(trigger.getAttribute('data-lightbox-index')) || 0)
    })
  })

  lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => {
    el.addEventListener('click', close)
  })
  lightbox.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(current - 1))
  lightbox.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(current + 1))

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return
    if (event.key === 'Escape') close()
    if (event.key === 'ArrowLeft') show(current - 1)
    if (event.key === 'ArrowRight') show(current + 1)
    if (event.key === 'Tab') {
      // Keep focus inside the dialog while it is open.
      const focusables = lightbox.querySelectorAll('button')
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  })
}

function renderFamiliar() {
  const cards = familiarPhrases
    .map((phrase) => `<blockquote class="quote-card"><p>“${escapeHtml(phrase)}”</p></blockquote>`)
    .join('')

  return `
    <section id="es-para-mi" class="section">
      <div class="section-inner">
        <h2>¿Te suena familiar?</h2>
        <p class="section-lead">Si alguna de estas frases te atraviesa, no tienes que cargar con esto en soledad.</p>
        <div class="quote-grid">${cards}</div>
        <p class="section-close">
          No necesitas esperar a “estar peor”. Pedir apoyo a tiempo también es cuidarte.
        </p>
        <div class="section-actions">
          ${
            isWhatsAppReady()
              ? renderWhatsAppButton(
                  'Sí, quiero hablarlo',
                  'es_para_mi',
                  'primary',
                  'Hola Paola, me identifiqué con lo que describiste y quiero dar el primer paso.'
                )
              : '<a class="btn btn-primary" href="#contacto">Sí, quiero hablarlo</a>'
          }
        </div>
      </div>
    </section>
  `
}

function renderVoiceQuotes() {
  const cards = voiceQuotes
    .map(
      (item) => `
      <article class="voice-card">
        <h3>${escapeHtml(item.title)}</h3>
        <blockquote><p>“${escapeHtml(item.quote)}”</p></blockquote>
      </article>`
    )
    .join('')

  return `
    <section id="en-sus-palabras" class="section section-alt">
      <div class="section-inner">
        <h2>En sus palabras</h2>
        <p class="section-lead">Ideas de Paola sobre amor propio, emociones y fracaso — el tono con el que trabaja en consulta.</p>
        <div class="voice-grid">${cards}</div>
      </div>
    </section>
  `
}

function renderMethodTool() {
  const steps = methodTool.steps
    .map(
      (step) => `
      <li class="popla-step">
        <span class="popla-letter" aria-hidden="true">${escapeHtml(step.letter)}</span>
        <span>${escapeHtml(step.word)}</span>
      </li>`
    )
    .join('')

  return `
    <section id="herramienta" class="section">
      <div class="section-inner narrow">
        <h2>${escapeHtml(methodTool.title)}</h2>
        <p class="section-lead">${escapeHtml(methodTool.lead)}</p>
        <ol class="popla-list">${steps}</ol>
        <p class="section-close">${escapeHtml(methodTool.close)}</p>
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
        <p class="section-lead">Un proceso a tu medida — individual, pareja, familia o duelo — con claridad desde el primer contacto.</p>
        <div class="services-grid">${cards}</div>
        <p class="section-close">
          Atiendo virtual desde cualquier parte del mundo. Presencial en mis oficinas permanentes de
          Barranquilla y, con citas anticipadas, en Bogotá.
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
        <div class="how-grid">
          <ol class="steps-list">${steps}</ol>
          <aside class="process-visual">
            <img src="${escapeHtml(href('process-journey.svg'))}" alt="Infografía del proceso terapéutico en tres pasos" />
            <p class="process-note">
              Tres pasos. Sin formularios eternos. Tú decides el ritmo.
            </p>
          </aside>
        </div>
        <div class="section-actions">
          ${
            isWhatsAppReady()
              ? renderWhatsAppButton(
                  'Empezar por WhatsApp',
                  'primera_sesion',
                  'primary',
                  'Hola Paola, quiero agendar mi primera sesión.'
                )
              : '<a class="btn btn-primary" href="#contacto">Empezar por WhatsApp</a>'
          }
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
        <h2>Tu primera sesión (sin sorpresas)</h2>
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
        : 'Te respondo esta pregunta personalmente al momento de agendar, según tu caso.'
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
  const urgencyCta = isWhatsAppReady()
    ? renderWhatsAppButton(
        'Pedir consulta prioritaria',
        'consulta_prioritaria',
        'primary',
        'Hola Paola, necesito una consulta prioritaria según tu disponibilidad.'
      )
    : '<a class="btn btn-primary" href="#contacto">Pedir consulta prioritaria</a>'

  return `
    <section id="urgencias" class="section section-urgency">
      <div class="section-inner narrow">
        <h2>¿Necesitas hablar pronto?</h2>
        <p class="urgency-crisis">
          Si hay riesgo inmediato para tu vida o la de otra persona, llama ahora a la
          <strong>Línea 123</strong> o la <strong>Línea 106</strong>, o acude al servicio de urgencias más cercano.
          Esta web no es un servicio de emergencias.
        </p>
        <p>
          Si lo que buscas es una <strong>consulta prioritaria</strong> (no emergencia),
          escríbeme y coordinamos según disponibilidad — a veces con horario extendido.
        </p>
        <div class="section-actions">
          ${urgencyCta}
        </div>
      </div>
    </section>
  `
}

function renderContact() {
  const ig = instagramUrl()
  const emailBlock = CONTACT_EMAIL
    ? `<p><a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a></p>`
    : ''
  const hoursBlock = BUSINESS_HOURS
    ? `<p>Horarios: ${escapeHtml(BUSINESS_HOURS)}</p>`
    : ''
  const igBlock = ig
    ? `<p><a href="${escapeHtml(ig)}" target="_blank" rel="noopener noreferrer">Instagram @${escapeHtml(ig.split('/').filter(Boolean).pop())}</a></p>`
    : ''
  const hasDirectChannels = Boolean(CONTACT_EMAIL || ig || isWhatsAppReady())
  const fallbackMeta = hasDirectChannels
    ? ''
    : '<p>Canales directos de contacto en actualización temporal.</p>'
  const contactMeta = [emailBlock, hoursBlock, igBlock, fallbackMeta].filter(Boolean).join('')
  const primaryCta = isWhatsAppReady()
    ? renderWhatsAppButton(
        'Escribirme por WhatsApp',
        'contacto',
        'primary',
        'Hola Paola, quiero agendar una primera conversación.'
      )
    : '<a class="btn btn-primary" href="#contacto-form">Dejar mis datos</a>'
  const secondaryCta = ig
    ? `<a class="btn btn-outline" href="${escapeHtml(ig)}" target="_blank" rel="noopener noreferrer">Ver Instagram</a>`
    : CONTACT_EMAIL
      ? `<a class="btn btn-outline" href="mailto:${escapeHtml(CONTACT_EMAIL)}">Escribirme por correo</a>`
      : ''

  return `
    <section id="contacto" class="section">
      <div class="section-inner narrow contact-block">
        <h2>Da el primer paso hoy</h2>
        <p class="section-lead">
          Una conversación por WhatsApp basta para empezar. Te respondo personalmente
          (habitualmente el mismo día hábil), con claridad sobre modalidad, horarios y valor — sin presión.
        </p>
        <div class="section-actions contact-primary-actions">
          ${primaryCta}
          ${secondaryCta}
        </div>
        <p class="contact-proof">+20 años · Confidencial · Virtual mundial · Barranquilla · Bogotá anticipada</p>
        <div class="contact-meta">
          ${contactMeta}
          <p class="contact-location">${escapeHtml(BUSINESS_LOCATION)} · ${escapeHtml(LOCATION_MODALITIES)}</p>
        </div>
        ${renderLeadForm()}
      </div>
    </section>
  `
}

function renderLeadForm() {
  const consentText =
    'Autorizo el tratamiento de mis datos de contacto para responder mi solicitud, conforme a la Ley 1581 de 2012.'

  return `
    <details class="lead-form-details">
      <summary data-lead-draft-summary>Borrador local (no me llega a mí — opcional)</summary>
    <form id="contacto-form" class="lead-form-panel lead-form" data-lead-form novalidate>
      <p class="lead-form-disclaimer">
        Esto <strong>no envía</strong> tu mensaje. Solo guarda un borrador en este navegador.
        Para que te responda, usa WhatsApp o correo. Evita detalles clínicos sensibles.
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
          <option value="urgencia">Consulta prioritaria</option>
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
          Acepto el tratamiento de mis datos de contacto para que me respondas esta solicitud.
          Leí la <a href="${escapeHtml(href('privacidad/'))}" target="_blank" rel="noopener noreferrer">política de privacidad</a>.
        </span>
      </label>
      <input type="hidden" name="consentText" value="${escapeHtml(consentText)}" />
      <input type="hidden" name="policyVersion" value="${escapeHtml(LEAD_POLICY_VERSION || 'v1.0')}" />
      <div class="section-actions">
        <button class="btn btn-outline" type="submit">Guardar en este dispositivo</button>
        <button class="btn-link" type="button" data-clear-local-data>Limpiar datos locales</button>
      </div>
      <p class="lead-form-status" data-lead-status role="status" aria-live="polite"></p>
    </form>
    </details>
  `
}

function renderFooter() {
  const links = nav
    .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
    .join('')

  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <p class="footer-brand">${escapeHtml(COMPANY_LEGAL_NAME)} · ${escapeHtml(LOCATION_MODALITIES)}</p>
        <nav aria-label="Pie de página">
          ${links}
          <a href="${escapeHtml(href('privacidad/'))}">Política de privacidad</a>
        </nav>
        <p class="footer-copy">© 2026 · ${escapeHtml(COMPANY_LEGAL_NAME)}.</p>
      </div>
    </footer>
  `
}

/** Persistent bottom bar on phones: the primary booking path stays one tap away. */
function renderMobileCta() {
  if (!isWhatsAppReady()) return ''
  return `
    <div class="mobile-cta" data-mobile-cta>
      <div class="mobile-cta-copy">
        <strong>Da el primer paso</strong>
        <span>Te respondo personalmente</span>
      </div>
      ${renderWhatsAppButton(
        'WhatsApp',
        'barra_movil',
        'primary',
        'Hola Paola, quiero agendar una primera conversación.'
      )}
    </div>
  `
}

function renderFloating() {
  // Desktop-only floating bubble; on phones the sticky bar is the single CTA.
  if (!isWhatsAppReady()) {
    return `<div id="chatbot-slot" class="chatbot-slot" data-chatbot-slot hidden aria-hidden="true"></div>`
  }
  return `
    <div class="floating-wa-desktop">
      ${renderWhatsAppButton('WhatsApp', 'flotante', 'floating')}
    </div>
    <div id="chatbot-slot" class="chatbot-slot" data-chatbot-slot hidden aria-hidden="true"><!-- ChatbotSlot: pegar aquí widget externo (convive o reemplaza el flotante WA) --></div>
  `
}

function renderPrivacyContent() {
  const siteContactLink = `<a href="${escapeHtml(href(''))}#contacto">los canales de contacto publicados en este sitio</a>`
  const privacyContactChannel = CONTACT_EMAIL
    ? `<a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a>`
    : siteContactLink
  const privacyToc = [
    ['priv-responsable', 'Responsable del tratamiento'],
    ['priv-marco', 'Marco legal aplicable'],
    ['priv-alcance', 'Alcance y categorías de datos'],
    ['priv-finalidad', 'Finalidades y base jurídica'],
    ['priv-encargados', 'Encargados, terceros y transferencias'],
    ['priv-seguridad', 'Medidas de seguridad'],
    ['priv-retencion', 'Conservación y eliminación'],
    ['priv-derechos', 'Derechos del titular y procedimiento'],
    ['priv-menores', 'Menores de edad'],
    ['priv-cambios', 'Actualizaciones de esta política'],
    ['priv-sic', 'Autoridad de protección de datos']
  ]
    .map(([id, label]) => `<li><a href="#${id}">${escapeHtml(label)}</a></li>`)
    .join('')

  return `
    <section class="section privacy-page">
      <div class="section-inner narrow">
        <p class="privacy-banner">Versión de política: ${escapeHtml(LEAD_POLICY_VERSION || 'v1.0')}</p>
        <h1>Política de privacidad</h1>
        <p>
          Esta política explica cómo trato los datos personales que compartes al usar este sitio web y los
          canales de contacto asociados.
        </p>
        <nav class="privacy-toc" aria-label="Índice de política de privacidad">
          <p class="privacy-toc-title">Índice rápido</p>
          <ol>${privacyToc}</ol>
        </nav>
        <h2 id="priv-responsable">1. Responsable del tratamiento</h2>
        <p>
          Responsable: <strong>${escapeHtml(COMPANY_LEGAL_NAME)}</strong>, ${escapeHtml(BUSINESS_LOCATION)}.
          Canal para asuntos de privacidad y habeas data: ${privacyContactChannel}.
        </p>
        <h2 id="priv-marco">2. Marco legal aplicable</h2>
        <p>
          Esta política se elabora conforme a la Ley 1581 de 2012, el Decreto 1377 de 2013, el Decreto 1074
          de 2015 y demás normas colombianas aplicables en protección de datos personales. En el contexto
          terapéutico, también se atienden los deberes de confidencialidad y secreto profesional propios del
          ejercicio de la psicología.
        </p>
        <h2 id="priv-alcance">3. Alcance y categorías de datos</h2>
        <p>
          Puedo tratar datos de contacto e identificación básica para el primer acercamiento, como nombre,
          teléfono, correo, canal preferido y mensaje breve. En este sitio no se solicita ni se requiere
          información clínica sensible para iniciar contacto.
        </p>
        <p>
          El formulario web guarda borradores localmente en tu dispositivo (almacenamiento local) para evitar
          pérdida de información durante el diligenciamiento.
        </p>
        <h2 id="priv-finalidad">4. Finalidades y base jurídica</h2>
        <p>
          Trato los datos para responder solicitudes, orientar sobre servicios, coordinar agenda, mantener
          trazabilidad básica de autorizaciones y cumplir obligaciones legales de protección de datos.
          La base jurídica puede incluir consentimiento del titular, ejecución de medidas precontractuales y
          cumplimiento de deberes legales.
        </p>
        <h2 id="priv-encargados">5. Encargados, terceros y transferencias</h2>
        <p>
          Para operar este sitio puedo apoyarme en proveedores tecnológicos (por ejemplo, hosting, correo o
          herramientas de analítica y seguridad) bajo deberes de confidencialidad y seguridad. Algunos
          proveedores pueden procesar datos fuera de Colombia; cuando aplique, se implementan medidas
          contractuales y de protección razonables conforme a la normativa vigente.
        </p>
        <h2 id="priv-seguridad">6. Medidas de seguridad</h2>
        <p>
          Se aplican medidas técnicas, humanas y administrativas razonables para prevenir acceso no autorizado,
          pérdida, uso indebido o alteración de la información, con principios de minimización y acceso
          restringido según necesidad.
        </p>
        <h2 id="priv-retencion">7. Conservación y eliminación</h2>
        <p>
          Los borradores locales del formulario se conservan hasta por 180 días y puedes eliminarlos en
          cualquier momento desde el botón “Limpiar datos locales” o borrando datos del navegador.
        </p>
        <p>
          La información recibida por canales de contacto se conserva solo por el tiempo necesario para atender
          tu solicitud y para el cumplimiento de obligaciones legales o de soporte del servicio.
        </p>
        <h2 id="priv-derechos">8. Derechos del titular y procedimiento</h2>
        <p>
          Puedes conocer, actualizar, rectificar, solicitar supresión de tus datos y revocar la autorización
          cuando proceda. Para ejercer estos derechos, envía tu solicitud por ${privacyContactChannel} e
          incluye nombre completo, dato de contacto para respuesta y detalle claro de la petición.
        </p>
        <p>
          Las consultas y reclamos se atienden en los plazos previstos por la normativa colombiana aplicable.
        </p>
        <h2 id="priv-menores">9. Menores de edad</h2>
        <p>
          La orientación profesional se presta con enfoque de protección reforzada cuando intervienen niñas,
          niños o adolescentes. Cuando aplique, el contacto inicial y la autorización deben ser gestionados por
          padre, madre o representante legal.
        </p>
        <h2 id="priv-cambios">10. Actualizaciones de esta política</h2>
        <p>
          Esta política puede actualizarse por cambios normativos, técnicos u operativos. Cualquier cambio
          sustancial se publicará en este sitio con su versión y fecha de vigencia correspondiente.
        </p>
        <h2 id="priv-sic">11. Autoridad de protección de datos</h2>
        <p>
          Si consideras que no se atendieron adecuadamente tus derechos, puedes acudir a la Superintendencia de
          Industria y Comercio (SIC), autoridad nacional en materia de protección de datos personales en
          Colombia.
        </p>
        <p><a class="btn-link" href="${escapeHtml(href(''))}">← Volver al inicio</a></p>
      </div>
    </section>
  `
}

function setNavOpen(open) {
  const toggle = document.querySelector('.nav-toggle')
  const navEl = document.querySelector('#primary-nav')
  document.body.classList.toggle('nav-open', open)
  toggle?.setAttribute('aria-expanded', String(open))
  if (navEl) {
    if (open) navEl.removeAttribute('inert')
    else navEl.setAttribute('inert', '')
  }
}

function bindHeader() {
  const header = document.querySelector('[data-header]')
  const toggle = document.querySelector('.nav-toggle')
  const navEl = document.querySelector('#primary-nav')
  const onScroll = () => {
    if (!header) return
    header.classList.toggle('is-scrolled', window.scrollY > 24)
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  // Closed mobile drawer should not stay in the focus order.
  if (navEl && window.matchMedia('(max-width: 900px)').matches) {
    navEl.setAttribute('inert', '')
  }

  toggle?.addEventListener('click', () => {
    const open = !document.body.classList.contains('nav-open')
    setNavOpen(open)
  })

  document.querySelectorAll('#primary-nav a').forEach((link) => {
    link.addEventListener('click', () => setNavOpen(false))
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
        trackEvent('faq_open', { question: btn.textContent?.trim()?.slice(0, 80) || '' })
      }
    })
  })
}

function bindScrollFades() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const sections = document.querySelectorAll('main > section:not(.hero)')
  sections.forEach((section) => {
    section.classList.add('fade-section')
    if (reduce) section.classList.add('is-visible')
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
    { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
  )
  sections.forEach((s) => io.observe(s))
  // Reveal anything already in view on first paint (avoids blank/stuck sections).
  requestAnimationFrame(() => {
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        section.classList.add('is-visible')
        io.unobserve(section)
      }
    })
  })
}

function bindLeadDraftDetails() {
  const details = document.querySelector('details.lead-form-details')
  details?.addEventListener('toggle', () => {
    if (details.open) trackEvent('lead_draft_open')
  })
}

function bindShell() {
  initAnalytics()
  bindHeader()
  bindFaq()
  bindWhatsAppTracking(document)
  bindLeadForm()
  bindLeadDraftDetails()
  bindScrollFades()
}

function bindLeadForm() {
  const form = document.querySelector('[data-lead-form]')
  if (!form) return

  const status = form.querySelector('[data-lead-status]')
  const submit = form.querySelector('button[type="submit"]')
  const clearBtn = form.querySelector('[data-clear-local-data]')
  const setStatus = (message, tone = 'info') => {
    if (!status) return
    status.textContent = message
    status.dataset.tone = tone
  }

  const draft = readLeadDraft()
  if (draft) {
    const setValue = (name, value) => {
      const field = form.elements.namedItem(name)
      if (!field) return
      field.value = value
    }
    setValue('name', draft.name || '')
    setValue('contactChannel', draft.contactChannel || 'whatsapp')
    setValue('contactValue', draft.contactValue || '')
    setValue('interestChannel', draft.interestChannel || 'general')
    setValue('messageShort', draft.messageShort || '')
    setStatus('Recuperamos tu borrador guardado en este navegador.', 'info')
  }

  form.addEventListener('input', () => {
    const fields = new FormData(form)
    saveLeadDraft({
      name: String(fields.get('name') || '').trim(),
      contactChannel: String(fields.get('contactChannel') || 'whatsapp'),
      contactValue: String(fields.get('contactValue') || '').trim(),
      interestChannel: String(fields.get('interestChannel') || 'general'),
      messageShort: String(fields.get('messageShort') || '').trim()
    })
  })

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
    setStatus('Guardando en este navegador...', 'info')

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
      setStatus('Guardado localmente. Para recibir respuesta, escríbeme por WhatsApp o correo.', 'success')
    } catch (error) {
      setStatus('No fue posible guardar localmente. Revisa permisos del navegador.', 'error')
    } finally {
      submit?.removeAttribute('disabled')
    }
  })

  clearBtn?.addEventListener('click', () => {
    clearLocalLeadData()
    form.reset()
    setStatus('Se eliminaron los datos guardados en este navegador.', 'success')
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
      ${renderTrustHighlights()}
      ${renderFamiliar()}
      ${renderServices()}
      ${renderHowItWorks()}
      ${renderMethodTool()}
      ${renderAbout()}
      ${renderVoiceQuotes()}
      ${renderAuthority()}
      ${renderFirstSession()}
      ${renderFaq()}
      ${renderUrgency()}
      ${renderContact()}
    </main>
    ${renderFooter()}
    ${renderFloating()}
    ${renderMobileCta()}
    ${renderLightbox()}
  `
  bindShell()
  bindLightbox()
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
