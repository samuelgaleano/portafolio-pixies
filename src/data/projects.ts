import type { CategoryId } from './categories';

// EL CORAZÓN DATA-DRIVEN (§7.1). Agregar un proyecto = agregar un objeto aquí + un screenshot.
// status decide el link primario y la etiqueta: 'produccion' → liveUrl; 'codigo' → repoUrl.
// preview.src === '' → la tarjeta muestra el placeholder pixelado (no inventamos screenshots).
export interface Project {
  id: string; // slug único
  category: CategoryId;
  name: string;
  tagline: string; // 1–2 líneas de VALOR DE NEGOCIO (no técnicas)
  bullets: string[]; // 3–5 bullets TÉCNICOS: stack, arquitectura, decisiones de ingeniería
  stack: string[]; // ids de tech.ts → badges
  status: 'produccion' | 'codigo';
  liveUrl?: string; // requerido si status === 'produccion'
  repoUrl?: string; // requerido si status === 'codigo'
  preview: { src: string; alt: string }; // src '' = placeholder
  exhibit?: 'erp-tour' | 'agent-replay'; // exhibición especial (F3)
  featured?: boolean;
}

// Proyectos placeholder realistas. Samuel reemplaza los [COMPLETAR] con datos reales (§13).
// Categorías A (landing), B (catalogo) y F (empresarial) se pueblan en Fase 2.
// C (erp), D (datos), E (ia) llegan en Fase 3.
export const projects: Project[] = [
  // A — Landing Pages
  {
    id: 'landing-ejemplo-1',
    category: 'landing',
    name: '[COMPLETAR: nombre del proyecto]',
    tagline: 'Landing de campaña con captación de leads y medición de conversión de punta a punta.',
    bullets: [
      '[COMPLETAR: stack real, ej. Astro + Cloudflare Pages]',
      '[COMPLETAR: decisión de arquitectura, ej. formularios a Google Sheets sin backend]',
      '[COMPLETAR: métrica o resultado, ej. Lighthouse 100, LCP < 1s]',
    ],
    stack: ['astro', 'tailwind', 'cloudflare'],
    status: 'produccion',
    liveUrl: '', // [COMPLETAR: URL en producción]
    preview: { src: '', alt: 'Vista previa de [COMPLETAR: nombre del proyecto]' },
    featured: true,
  },
  {
    id: 'landing-ejemplo-2',
    category: 'landing',
    name: '[COMPLETAR: nombre del proyecto]',
    tagline: 'Sitio de presentación para un servicio profesional, optimizado para móvil.',
    bullets: [
      '[COMPLETAR: stack real]',
      '[COMPLETAR: decisión de ingeniería relevante]',
      '[COMPLETAR: integración, ej. WhatsApp Business API]',
    ],
    stack: ['react', 'tailwind', 'vercel'],
    status: 'codigo',
    repoUrl: '', // [COMPLETAR: URL del repo]
    preview: { src: '', alt: 'Vista previa de [COMPLETAR: nombre del proyecto]' },
  },

  // B — Catálogo / E-commerce
  {
    id: 'catalogo-ejemplo-1',
    category: 'catalogo',
    name: '[COMPLETAR: nombre del catálogo]',
    tagline: 'Catálogo con inventario en base de datos y panel para actualizar productos.',
    bullets: [
      '[COMPLETAR: stack, ej. React + Supabase (Postgres)]',
      '[COMPLETAR: modelo de datos, ej. productos, categorías, stock en tiempo real]',
      '[COMPLETAR: decisión, ej. imágenes optimizadas en CDN, búsqueda del lado del cliente]',
    ],
    stack: ['react', 'supabase', 'postgres', 'tailwind'],
    status: 'produccion',
    liveUrl: '', // [COMPLETAR]
    preview: { src: '', alt: 'Vista previa de [COMPLETAR: nombre del catálogo]' },
    featured: true,
  },

  // F — Soluciones integrales empresariales
  {
    id: 'empresarial-tvs-red-local',
    category: 'empresarial',
    name: 'Sincronización de televisores en red local',
    tagline: 'Transmisión simultánea del mismo contenido a varias pantallas, sin internet.',
    bullets: [
      '[COMPLETAR: stack real, ej. Node.js + WebSocket en red local]',
      '[COMPLETAR: arquitectura, ej. un servidor local orquesta N clientes en display]',
      '[COMPLETAR: reto de ingeniería, ej. sincronía de reproducción entre pantallas]',
    ],
    stack: ['nodejs', 'javascript'],
    status: 'codigo',
    repoUrl: '', // [COMPLETAR: URL del repo]
  preview: { src: '', alt: 'Diagrama del sistema de sincronización de televisores' },
    featured: true,
  },
  {
    id: 'empresarial-capa-red-local',
    category: 'empresarial',
    name: '[CONFIRMAR NOMBRE: "Capa"]',
    tagline: 'Comunicación interna en red local: mensajería y coordinación sin depender de la nube.',
    bullets: [
      '[COMPLETAR: stack real]',
      '[COMPLETAR: arquitectura de red, ej. descubrimiento de nodos en LAN]',
      '[COMPLETAR: por qué en red local, ej. privacidad, latencia, sin costo de servidor]',
    ],
    stack: ['nodejs', 'javascript'],
    status: 'codigo',
    repoUrl: '', // [COMPLETAR]
    preview: { src: '', alt: 'Diagrama del sistema de comunicación en red local' },
  },
];

export const projectsByCategory = (id: CategoryId): Project[] =>
  projects.filter((p) => p.category === id);
