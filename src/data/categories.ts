// Categorías del portafolio (A–F del plan §4.2). Bloques secuenciales con mini-nav de anclas.
// `projectType` pre-selecciona el select del formulario de leads (§6) según la sección de origen.
// `exhibit` marca las categorías con exhibición especial (§12): erp, datos e ia no usan tarjetas.
// El ORDEN del array ES el orden de la home (y del selector del portafolio). Decisión de Samuel
// (2026-07-18): el Sistema ERP sube a 2ª posición — es el proyecto insignia y debe verse pronto,
// justo tras el gancho de las landings. Luego catálogo y lo empresarial, y de ahí analítica e IA.
export type CategoryId = 'landing' | 'catalogo' | 'erp' | 'datos' | 'ia' | 'empresarial' | 'productos';

export interface Category {
  id: CategoryId;
  title: string;
  heroLabel: string; // etiqueta corta mono para los chips del hero
  description: string;
  /** Título DIRECTO para el catálogo (Samuel, 2026-09-22: "títulos directos, que puedan
   * oprimir de una vez"): lo que el cliente busca, no el nombre de la categoría. */
  corto: string;
  /** Qué hay ahí dentro, concreto y verificable — se muestra bajo el título en el catálogo. */
  evidencia: string;
  /** Ícono en píxeles 5×5 (mismo lenguaje del wordmark), una fila por string. */
  icono: string[];
  projectType: string; // valor para el select del lead form
  exhibit?: 'erp-tour' | 'agent-replay' | 'data-tour'; // si existe, se renderiza la isla en vez de tarjetas
  preview?: string; // imagen representativa que aparece al hover del tile del launcher
  /** La categoría NO se apila dentro del portafolio: tiene su propia sección arriba de /web y
   * el catálogo sigue enlazándola por su ancla (Samuel, 2026-09-23: "está muy abajo, cuando
   * lleguen ahí ya van a estar saturados; quiero que sea una sección directa al inicio"). */
  seccionPropia?: true;
}

export const categories: Category[] = [
  {
    id: 'landing',
    corto: 'Una landing page que venda',
    evidencia: 'Landing page · 3 en producción',
    icono: ['11111','10001','11111','00100','01110'],
    heroLabel: 'landing pages',
    title: 'Landing Pages',
    description: 'Páginas de aterrizaje que convierten: rápidas, medibles, hechas para una acción.',
    projectType: 'Landing page',
    preview: '/proyectos/xiaomi-cartech.webp',
  },
  {
    id: 'erp',
    corto: 'Un ERP que organice mi pyme',
    evidencia: 'ERP · 45 módulos, con demo en vivo',
    icono: ['11011','11011','00000','11011','11011'],
    heroLabel: 'erp a medida',
    title: 'Sistema ERP',
    description: 'Software a medida que corre la operación: módulos, permisos, procesos.',
    projectType: 'ERP / Software a medida',
    exhibit: 'erp-tour',
    preview: '/proyectos/erp/dashboard.webp',
  },
  {
    id: 'catalogo',
    corto: 'Un e-commerce que venda',
    evidencia: 'E-commerce · 2 vendiendo hoy',
    icono: ['01110','11111','10101','11111','01010'],
    heroLabel: 'e-commerce',
    title: 'Catálogo / E-commerce',
    description: 'Tiendas, catálogos y plataformas con base de datos y administración propia: inventario real, no maquetas.',
    projectType: 'Catálogo / E-commerce',
    preview: '/proyectos/fly-and-chill.webp',
  },
  {
    id: 'empresarial',
    corto: 'Conectar los sistemas que ya uso',
    evidencia: 'Integraciones · 2 en red local',
    icono: ['10001','01110','00100','01110','10001'],
    heroLabel: 'integraciones',
    title: 'Soluciones integrales empresariales',
    description: 'Integraciones que conectan lo que la empresa ya usa, en su propia red.',
    projectType: 'Integraciones empresariales',
    preview: '/proyectos/tv-panel.webp',
  },
  {
    id: 'datos',
    corto: 'Un análisis que explique mis datos',
    evidencia: 'Analítica · informe y código abiertos',
    icono: ['00001','00101','01101','11101','11111'],
    heroLabel: 'datos',
    title: 'Analítica e ingeniería de datos',
    description: 'De datos crudos a decisiones: pipelines, modelos y reportes que se leen.',
    projectType: 'Analítica de datos',
    exhibit: 'data-tour',
    preview: '/proyectos/datos/regresion.webp',
  },
  {
    id: 'ia',
    corto: 'Un agente de IA que haga el trabajo',
    evidencia: 'IA · un agente real, paso a paso',
    icono: ['00100','01110','11111','01110','00100'],
    heroLabel: 'ia',
    title: 'Implementaciones de IA',
    description: 'Sistemas agénticos que ejecutan procesos reales, no demos de chat.',
    projectType: 'IA',
    exhibit: 'agent-replay',
    preview: '/proyectos/ia/agente.webp',
  },
  {
    id: 'productos',
    corto: 'Una app lista para usar hoy',
    evidencia: 'Apps propias · gratis en el navegador',
    icono: ['11111','10001','10101','10001','11111'],
    heroLabel: 'apps by pixies',
    title: 'Aplicaciones by Pixies',
    description: 'Herramientas que construí para mi propio uso — entra, pruébalas en vivo o descárgalas.',
    projectType: 'Producto propio (escuchacomprendiendo.IA)',
    seccionPropia: true,
  },
];
