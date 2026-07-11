// Todos los strings de UI del sitio. i18n-ready: agregar inglés = crear en.ts
// y resolver por locale en index.ts. Hoy solo español.
export const es = {
  meta: {
    title: 'Pixies · Digital Web Design',
    description:
      'Pixies Digital Web Design: desarrollo web, software a medida, integraciones de IA y analítica de datos. Design Group by Samuel Galeano, Ingeniero de Sistemas.',
  },
  nav: {
    portfolio: 'Portafolio',
    engineer: 'El Ingeniero',
    cta: 'Trabajemos juntos',
  },
  hero: {
    title: 'PIXIES',
    subtitle: 'Digital Web Design',
    cta: 'Quiero trabajar con Pixies',
    photoAlt: '[COMPLETAR: foto profesional del Ing. Samuel Galeano]',
    photoCta: 'Conoce al ingeniero',
    scroll: 'El trabajo habla. Desliza',
  },
  placeholder: {
    contact: 'Formulario de contacto (Fase 5). Mientras tanto:',
  },
  footer: {
    tagline: 'Construimos cosas digitales que funcionan.',
    madeBy: 'Hecho por Pixies. Sí, este sitio también.',
  },
  notFound: {
    title: '404: píxel no encontrado',
    body: 'Esta página todavía no se ensambla. El resto del sitio, sí.',
    back: 'Volver al inicio',
  },
} as const;
