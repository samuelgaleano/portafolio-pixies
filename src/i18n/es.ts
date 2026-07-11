// Todos los strings de UI del sitio. i18n-ready: agregar inglés = crear en.ts
// y resolver por locale en index.ts. Hoy solo español.
// Los textos de contenido (proyectos, categorías) viven en src/data/ — eso es content-as-data, no UI.
export const es = {
  meta: {
    title: 'Pixies · Digital Web Design',
    description:
      'Pixies Digital Web Design: desarrollo web, software a medida, integraciones de IA y analítica de datos. Design Group by Samuel Galeano, Ingeniero de Sistemas.',
  },
  nav: {
    mainLabel: 'Principal',
    skip: 'Saltar al contenido',
    portfolio: 'Portafolio',
    engineer: 'El Ingeniero',
    cta: 'Trabajemos juntos',
    ctaShort: 'Hablemos',
  },
  hero: {
    title: 'PIXIES',
    subtitle: 'Digital Web Design',
    bylinePre: 'Design Group by',
    bylineName: 'Samuel Galeano',
    bylinePost: ', Ingeniero de Sistemas',
    cta: 'Quiero trabajar con Pixies',
    photoCta: 'Conoce al ingeniero',
    photoPlaceholder: '[COMPLETAR: FOTO_SAMUEL]',
    scroll: 'El trabajo habla. Desliza',
  },
  portfolio: {
    eyebrow: '/portafolio',
    title: 'Proyectos que ya corren',
    intro: 'Cada uno es real: stack a la vista, decisión de ingeniería explicada, enlace que funciona.',
    navLabel: 'Categorías del portafolio',
    statusLive: '● En producción',
    statusCode: '⌥ Ver código',
    openLive: 'Abrir sitio →',
    openRepo: 'Ver en GitHub →',
    missingLink: '[COMPLETAR: enlace del proyecto]',
    missingShot: '[COMPLETAR: screenshot]',
  },
  midCta: {
    title: '¿Tienes un proyecto en mente?',
    body: 'Cuéntanos qué necesitas. Respondemos con opciones concretas, no con un tarifario genérico.',
    cta: 'Hablemos de tu proyecto',
  },
  exhibit: {
    viewCode: 'Ver el código en GitHub →',
    erpRepoMissing: '[COMPLETAR: enlace al repo del ERP]',
    replay: '↻ Reproducir',
    running: '· ejecutando',
    consoleLabel: 'agente · replay (datos de ejemplo)',
  },
  contact: {
    title: 'Cuéntanos tu proyecto',
    hint: 'Formulario de contacto (Fase 5). Mientras tanto:',
  },
  samuel: {
    title: 'El Ingeniero',
    soon: 'Esta página se está ensamblando (Fase 4).',
    body: 'Aquí va la historia del cerebro detrás de Pixies: trayectoria, capacidades por dominio y su foro personal. Mientras tanto, el trabajo ya habla en el portafolio.',
    back: 'Ver el portafolio',
  },
  footer: {
    tagline: 'Construimos cosas digitales que funcionan.',
    madeBy: 'Hecho por Pixies. Sí, este sitio también.',
    navLabel: 'Pie de página',
    navHome: 'Inicio',
    navContact: 'Contacto',
  },
  notFound: {
    title: '404: píxel no encontrado',
    body: 'Esta página todavía no se ensambla. El resto del sitio, sí.',
    back: 'Volver al inicio',
  },
} as const;
