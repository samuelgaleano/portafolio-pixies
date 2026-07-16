// Categorías del portafolio (A–F del plan §4.2). Bloques secuenciales con mini-nav de anclas.
// `projectType` pre-selecciona el select del formulario de leads (§6) según la sección de origen.
// `exhibit` marca las categorías con exhibición especial (§12): erp, datos e ia no usan tarjetas.
// El ORDEN del array ES el orden de la home (y del selector del portafolio). Decisión de Samuel
// (2026-07-18): el Sistema ERP sube a 2ª posición — es el proyecto insignia y debe verse pronto,
// justo tras el gancho de las landings. Luego catálogo y lo empresarial, y de ahí analítica e IA.
export type CategoryId = 'landing' | 'catalogo' | 'erp' | 'datos' | 'ia' | 'empresarial';

export interface Category {
  id: CategoryId;
  title: string;
  heroLabel: string; // etiqueta corta mono para los chips del hero
  description: string;
  projectType: string; // valor para el select del lead form
  exhibit?: 'erp-tour' | 'agent-replay' | 'data-tour'; // si existe, se renderiza la isla en vez de tarjetas
  preview?: string; // imagen representativa que aparece al hover del tile del launcher
}

export const categories: Category[] = [
  {
    id: 'landing',
    heroLabel: 'landing pages',
    title: 'Landing Pages',
    description: 'Páginas de aterrizaje que convierten: rápidas, medibles, hechas para una acción.',
    projectType: 'Landing page',
    preview: '/proyectos/xiaomi-cartech.jpg',
  },
  {
    id: 'erp',
    heroLabel: 'erp a medida',
    title: 'Sistema ERP',
    description: 'Software a medida que corre la operación: módulos, permisos, procesos.',
    projectType: 'ERP / Software a medida',
    exhibit: 'erp-tour',
    preview: '/proyectos/erp/dashboard.webp',
  },
  {
    id: 'catalogo',
    heroLabel: 'e-commerce',
    title: 'Catálogo / E-commerce',
    description: 'Tiendas, catálogos y plataformas con base de datos y administración propia: inventario real, no maquetas.',
    projectType: 'Catálogo / E-commerce',
    preview: '/proyectos/fly-and-chill.jpg',
  },
  {
    id: 'empresarial',
    heroLabel: 'integraciones',
    title: 'Soluciones integrales empresariales',
    description: 'Integraciones que conectan lo que la empresa ya usa, en su propia red.',
    projectType: 'Integraciones empresariales',
    preview: '/proyectos/tv-panel.png',
  },
  {
    id: 'datos',
    heroLabel: 'datos',
    title: 'Analítica e ingeniería de datos',
    description: 'De datos crudos a decisiones: pipelines, modelos y reportes que se leen.',
    projectType: 'Analítica de datos',
    exhibit: 'data-tour',
    preview: '/proyectos/datos/regresion.webp',
  },
  {
    id: 'ia',
    heroLabel: 'ia',
    title: 'Implementaciones de IA',
    description: 'Sistemas agénticos que ejecutan procesos reales, no demos de chat.',
    projectType: 'IA',
    exhibit: 'agent-replay',
    preview: '/proyectos/ia/agente.webp',
  },
];
