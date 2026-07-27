/** Public website copy — conversion-focused, warm clinical voice. */

export const nav = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#sobre-mi', label: 'Sobre mí' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#preguntas', label: 'Preguntas' },
  { href: '#contacto', label: 'Contacto' }
]

/**
 * Neon mock placeholders (#01–#20) for Paola to replace with real data.
 * See site/PLACEHOLDERS.md. Do not ship to production until cleared.
 */
export const todoPlaceholders = {
  '01': {
    label: 'Credencial profesional',
    text:
      'MOCK — Psicóloga egresada de [Universidad exacta], con especialización en [nombre exacto]. Tarjeta profesional No. [XXXXXX-T]. Completar universidad, título de posgrado y número de tarjeta.'
  },
  '02': {
    label: 'Años de experiencia',
    text: 'MOCK — [XX] años de experiencia clínica (desde [año]). Confirmar cifra exacta o año de inicio.'
  },
  '03': {
    label: 'Enfoque terapéutico',
    text:
      'MOCK — Enfoque humanista-gestáltico: trabajo en el aquí y ahora, con herramientas claras para el día a día. (Reemplazar por tu frase de una línea.)'
  },
  '04': {
    label: 'Para quién sí / no',
    si: 'Adultos, adolescentes, parejas y familias que buscan claridad emocional, mejor comunicación o acompañamiento en duelo.',
    no: 'No es servicio de emergencias ni atención psiquiátrica de crisis. Tampoco terapia para niños pequeños: en ese caso te oriento a otro profesional.'
  },
  '05': {
    label: 'Precio (MOCK)',
    text:
      'MOCK PRECIO — Sesión individual orientativa desde $180.000 COP. Pareja o familia: consultar rango. Este valor es inventado para revisión; no es el precio real.'
  },
  '06': {
    label: 'Qué incluye la sesión',
    text:
      'MOCK — Sesión de 50–60 minutos, espacio confidencial, acuerdos claros del proceso y una herramienta práctica para entre sesiones. Completar con tu checklist real.'
  },
  '07': {
    label: 'Al escribir por WhatsApp',
    text:
      'MOCK — Te respondo personalmente, te pido un breve contexto (sin formularios largos) y te propongo horarios posibles + el valor con claridad, para que decidas sin presión.'
  },
  '08': {
    label: 'Próximas franjas',
    slots: [
      'Martes 10:00 (hora Colombia)',
      'Miércoles 16:30 (hora Colombia)',
      'Viernes 09:00 (hora Colombia)'
    ],
    note: 'MOCK cupos — horarios inventados para revisión. Reemplazar con agenda real.'
  },
  '09': {
    name: 'Laura',
    quote:
      'MOCK — “Encontré un espacio donde pude hablar sin miedo a ser juzgada. Salí con más claridad en casa y en el trabajo.” — Laura · COMPLETAR con testimonio real.'
  },
  '10': {
    name: 'Camila',
    quote:
      'MOCK — “La terapia con Paola me ayudó a poner límites con calma. Noté cambios reales en cómo me hablo a mí misma.” — Camila · COMPLETAR con testimonio real.'
  },
  '11': {
    name: 'Andrés',
    quote:
      'MOCK — “Como pareja llegamos agotados de discutir. Aprendimos a escucharnos sin pelear cada conversación.” — Andrés · COMPLETAR con testimonio real.'
  },
  '12': {
    label: 'Reseñas Google',
    href: 'https://g.page/mock-paola-cortes-reseñas',
    text: 'MOCK — Ver reseñas en Google (enlace inventado). Completar URL real de reseñas.'
  },
  '13': {
    label: 'Instagram',
    handle: 'paola.cortes.psicologa',
    text: 'MOCK Instagram — @paola.cortes.psicologa (handle inventado). Completar con tu cuenta real.'
  },
  '14': {
    label: 'Frase de posicionamiento',
    text: 'MOCK — Terapia cercana y clara para volver a confiar en ti y en tus vínculos. (Completar con tu frase de posicionamiento.)'
  },
  '15': {
    q: '¿La terapia virtual realmente funciona?',
    a: 'MOCK — Sí, para la mayoría de procesos puede ser tan efectiva como la presencial, con la misma confidencialidad, desde un lugar donde te sientas en confianza. Completar con tu respuesta.'
  },
  '16': {
    q: '¿Cuántas sesiones voy a necesitar?',
    a: 'MOCK — Depende de tu proceso y tus objetivos. En las primeras sesiones acordamos un ritmo realista; no hay paquetes forzados. Completar con tu criterio.'
  },
  '17': {
    q: '¿Atiendes parejas y adolescentes?',
    a: 'MOCK — Sí. Trabajo con parejas y con adolescentes; cuando hay menores, el contacto inicial y las autorizaciones van con el adulto responsable. Completar matices.'
  },
  '18': {
    q: '¿Emites factura o documento de pago?',
    a: 'MOCK — Consultar: [sí/no y bajo qué modalidad]. Completar si emites factura, recibo o soporte de pago.'
  },
  '19': {
    label: 'Confidencialidad WhatsApp',
    text:
      'MOCK — Lo que me escribas por WhatsApp se trata con confidencialidad profesional; úsalo solo para agendar y un breve contexto (evita detalles clínicos sensibles en el primer mensaje).'
  },
  '20': {
    label: 'Google Business',
    href: 'https://maps.google.com/?cid=mock-paola-cortes-business',
    text: 'MOCK — Ficha de Google Business (URL inventada). Completar con el enlace real del perfil.'
  }
}

/** Six high-intent pains — fewer cards, stronger recognition. */
export const familiarPhrases = [
  'Siento que la ansiedad me está ganando terreno.',
  'Perdí a alguien y no sé cómo seguir.',
  'Con mi pareja ya no sabemos hablarnos sin discutir.',
  'Mi hijo adolescente se está alejando y no sé cómo acercarme.',
  'Siento que estoy perdiendo el amor propio y me juzgo demasiado.',
  'El fracaso me paraliza y ya no confío en mí.'
]

/** Short quotes from Paola’s own essays — her voice, not invented patient reviews. */
export const voiceQuotes = [
  {
    title: 'Amor propio',
    quote:
      'Necesitamos trabajar en autodescubrirnos: enriquecer el autoconcepto, amarnos y creer que sí podemos.'
  },
  {
    title: 'Emociones',
    quote:
      'Las emociones nos indican, nos hablan, te quieren enseñar. No las ignores más: atiéndelas y regúlalas con inteligencia.'
  },
  {
    title: 'Fracaso',
    quote:
      'Si tomas las lecciones del fracaso y decides seguir, ya no será fracaso: será un peldaño para lo más hermoso de tus años.'
  }
]

/** Concrete tool highlighted on the site (from Paola’s psychoeducation material). */
export const methodTool = {
  title: 'POPLA: un freno antes de reaccionar',
  lead: 'Una herramienta simple de educación emocional para pausar en medio del conflicto familiar o de pareja.',
  steps: [
    { letter: 'P', word: 'Para' },
    { letter: 'O', word: 'Observa' },
    { letter: 'P', word: 'Piensa' },
    { letter: 'L', word: 'Luego' },
    { letter: 'A', word: 'Actúa' }
  ],
  close: 'No es magia: es práctica. En sesión lo adaptamos a tu caso.'
}

/**
 * Compact gallery of public work. Featured items render large in the mosaic.
 */
export const authorityMoments = [
  {
    src: 'images/authority-congreso',
    alt: 'Paola Cortés conversando en el Congreso de la República sobre salud mental',
    title: 'Congreso de la República',
    caption: 'Mesa de trabajo sobre política de salud mental en Colombia.',
    featured: true
  },
  {
    src: 'images/authority-unilibre',
    alt: 'Panel “Un café que inspira” en la Universidad Libre',
    title: 'Universidad Libre',
    caption: 'Panel por el Día Mundial de la Salud Mental.',
    featured: true
  },
  {
    src: 'images/authority-radio',
    alt: 'Paola Cortés en radio conversando sobre salud mental',
    title: 'Medios y salud mental',
    caption: 'Conversaciones públicas para acercar la psicología a más personas.',
    featured: true
  },
  {
    src: 'images/authority-talleres',
    alt: 'Paola Cortés en un taller de educación emocional con una niña',
    title: 'Educación emocional',
    caption: 'Talleres con niñas, niños y familias.'
  },
  {
    src: 'images/authority-virtual',
    alt: 'Paola Cortés atendiendo una sesión virtual',
    title: 'Atención virtual',
    caption: 'La misma cercanía, desde donde estés.'
  }
]

export const services = [
  {
    title: 'Terapia individual para adultos',
    body: 'Cuando la ansiedad, el duelo o el autocuestionamiento te pesan: un espacio para entenderte y recuperar claridad, a tu ritmo.'
  },
  {
    title: 'Terapia para adolescentes',
    body: 'Un lugar seguro para que tu hijo o hija ponga en palabras lo que siente, con orientación respetuosa para la familia.'
  },
  {
    title: 'Terapia de pareja',
    body: 'Si las discusiones se repiten o la confianza se rompió: herramientas para hablarse mejor y decidir con respeto.'
  },
  {
    title: 'Terapia de familia',
    body: 'Acompañamiento en crisis, cambios y tensiones del hogar para relacionarse con más calma y cuidado.'
  },
  {
    title: 'Acompañamiento en duelo',
    body: 'Transitar una pérdida sin fórmulas forzadas, con apoyo profesional y el tiempo que tu proceso necesite.'
  },
  {
    title: 'Orientación psicoeducativa',
    body: 'Apoyo en convivencia, educación emocional, escuela de padres y procesos escolares cuando la casa o el colegio lo piden.'
  },
  {
    title: 'Consulta prioritaria',
    body: 'Si necesitas hablar pronto, coordinamos una sesión prioritaria según disponibilidad — no es atención de emergencias.'
  }
]

export const processSteps = [
  {
    title: 'Me escribes por WhatsApp.',
    body: 'Cuéntame en pocas líneas qué te trae. Te respondo personalmente en horario laboral (Colombia), sin presión ni formularios largos.'
  },
  {
    title: 'Agendamos tu primera sesión.',
    body: 'Acordamos modalidad y horario. Te comparto el valor con claridad y los datos de pago (Nequi, Bancolombia o Daviplata) antes de empezar.'
  },
  {
    title: 'Comenzamos tu proceso.',
    body: 'Sesiones confidenciales, a tu ritmo. Virtual desde cualquier parte del mundo; presencial en Barranquilla (oficinas permanentes) y Bogotá con citas anticipadas.'
  }
]

export const firstSessionPoints = [
  'Es una conversación, no un examen. No necesitas “explicarlo todo bien”: a eso llegamos juntos.',
  'Escucho qué te trae, qué esperas del proceso y resolvemos tus dudas —incluido el valor— antes de avanzar.',
  'Todo lo que compartas es confidencial.',
  'Al final decidimos juntos cómo continuar — sin compromisos ni presiones.'
]

export const experienceHighlights = [
  'Coordinadora de Convivencia Escolar y Educación Emocional — Secretaría de Educación de Barranquilla (actual).',
  'Psicóloga en Colegio de Inteligencias Múltiples — Veracruz, México.',
  'Programa de Capacitación y Bienestar Emocional — COMBARRANQUILLA.',
  'Psicóloga clínica — Clínica Renal de la Costa.'
]

export const faq = [
  {
    q: '¿Cuánto cuesta una sesión?',
    a: 'El valor varía según el tipo de proceso (individual, pareja o familia). Antes de agendar te lo comparto por WhatsApp con claridad, sin compromiso ni sorpresas. Así decides con información completa.'
  },
  {
    q: '¿Cómo se realiza el pago?',
    a: 'Puedes pagar por Nequi, Bancolombia o Daviplata. Confirmas el pago al agendar, antes de la sesión.'
  },
  {
    q: '¿Es virtual o presencial?',
    a: 'Virtual desde cualquier parte del mundo. Presencial en mis oficinas permanentes de Barranquilla y, con citas anticipadas, en Bogotá.'
  },
  {
    q: '¿Atiendes si vivo fuera de Colombia?',
    a: 'Sí. Por videollamada te acompaño desde cualquier país, en español.'
  },
  {
    q: '¿Cuánto tarda en responder?',
    a: 'Respondo personalmente en horario laboral de Colombia. En la mayoría de los casos, el mismo día hábil.'
  },
  {
    q: '¿Ofreces consulta prioritaria?',
    a: 'Sí, según disponibilidad — incluso con horarios extendidos cuando es posible. No reemplaza una emergencia médica o de riesgo vital: en ese caso usa la Línea 123 o 106.'
  },
  {
    q: '¿Cuánto dura una sesión?',
    a: 'Individual: entre 50 y 60 minutos. En pareja o familia puede ajustarse según el caso.'
  },
  {
    q: '¿Qué pasa si necesito cancelar o reprogramar?',
    a: 'Avísame con la mayor anticipación posible para ofrecerte otro horario. Si surge algo excepcional, lo revisamos contigo.'
  },
  {
    q: '¿La terapia online funciona?',
    a: 'Sí. Para la mayoría de procesos puede ser tan efectiva como la presencial, y te permite tomar la sesión desde un lugar donde te sientas en confianza.'
  },
  {
    q: '¿Atiendes niños?',
    a: 'Atiendo desde la adolescencia. Si buscas atención para un niño o una niña, escríbeme y te oriento al profesional adecuado.'
  }
]

/** FAQ objections marked as neon mocks (#15–#18). */
export const faqTodo = ['15', '16', '17', '18']
