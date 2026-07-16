import type { NextConfig } from 'next';

// Origen del backend del POS dockerizado. En local, el contenedor expone :8080;
// en producción se define POS_DEMO_ORIGIN con el subdominio/host de la demo.
const POS_DEMO_ORIGIN = process.env.POS_DEMO_ORIGIN || 'http://localhost:8080';
// Origen del backend del ERP dockerizado (mismo patrón que el POS). En local :8082.
const ERP_DEMO_ORIGIN = process.env.ERP_DEMO_ORIGIN || 'http://localhost:8082';

const nextConfig: NextConfig = {
  // El contenido MDX se procesa con next-mdx-remote en runtime de build (lib/posts.ts),
  // no via @next/mdx: los posts viven en src/content/posts como archivos, no como rutas.

  // Proxy same-origin de la demo del POS: el portafolio sirve el POS bajo /pos-demo,
  // así el iframe es del mismo origen (cookies de sesión first-party = login estable) y
  // la demo se prueba embebida dentro del portafolio. El POS genera sus enlaces con
  // BASE_URL=/pos-demo (POS_BASE_PATH), que casan con esta reescritura.
  async rewrites() {
    return [
      { source: '/pos-demo/:path*', destination: `${POS_DEMO_ORIGIN}/:path*` },
      // Mismo esquema para el ERP: se sirve same-origin bajo /erp-demo. La app usa
      // enlaces relativos, así que resuelven bajo este prefijo; el iframe queda del
      // mismo origen y satisface X-Frame-Options SAMEORIGIN / CSP frame-ancestors 'self'.
      { source: '/erp-demo/:path*', destination: `${ERP_DEMO_ORIGIN}/:path*` },
    ];
  },

  // Cabeceras de seguridad base para todo el sitio (Vercel ya añade HSTS). SAMEORIGIN
  // no rompe las demos: las embebidas son same-origin (proxy /pos-demo · /erp-demo) y la
  // del TV es un iframe cross-origin cuyo permiso lo da el propio servicio, no esta cabecera.
  // Se omite un CSP completo a propósito: GSAP, estilos/So inline y los iframes de demo
  // exigirían una política amplia que da falsa seguridad; mejor las cabeceras de alto valor.
  async headers() {
    return [
      {
        // todas las rutas MENOS los proxies de demo (/pos-demo, /erp-demo): esos contenedores
        // traen sus propias cabeceras (el ERP, ISO 27001) y duplicarlas podría romper el iframe.
        source: '/((?!pos-demo|erp-demo).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
