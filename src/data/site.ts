// Configuración global del sitio: identidad y datos de contacto usados en todo el portafolio.

// El dominio se resuelve en este orden:
//  1. NEXT_PUBLIC_SITE_URL  → cuando haya un dominio propio, se define esta variable.
//  2. La URL de producción que asigna la plataforma de despliegue (fallback automático).
//  3. localhost en desarrollo.
// Así el sitio funciona bien sin dominio definido y basta una variable para cambiarlo.
const resolvedUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  'http://localhost:3000';

export const site = {
  name: 'Pixies Digital Web Design',
  url: resolvedUrl,
  whatsapp: '+573012679392',
  email: 'samuel.galeano.alvis@gmail.com',
  social: {
    github: 'https://github.com/samuelgaleano',
    linkedin: 'https://www.linkedin.com/in/samuel-galeano-1a65bb241/',
    instagram: '', // sin cuenta pública por ahora: el footer la oculta cuando está vacía
  },
} as const;
