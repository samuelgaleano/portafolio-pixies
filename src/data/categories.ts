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
    corto: 'Quiero una página que venda',
    evidencia: '3 sitios en producción',
    icono: ['11111','10001','11111','00100','01110'],
    heroLabel: 'landing pages',
    title: 'Landing Pages',
    description: 'Páginas de aterrizaje que convierten: rápidas, medibles, hechas para una acción.',
    projectType: 'Landing page',
    preview: '/proyectos/xiaomi-cartech.webp',
  },
  {
    id: 'erp',
    corto: 'Quiero un sistema para mi operación',
    evidencia: 'Demo en vivo · 45 módulos',
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
    corto: 'Quiero vender por internet',
    evidencia: '2 tiendas con inventario real',
    icono: ['01110','11111','10101','11111','01010'],
    heroLabel: 'e-commerce',
    title: 'Catálogo / E-commerce',
    description: 'Tiendas, catálogos y plataformas con base de datos y administración propia: inventario real, no maquetas.',
    projectType: 'Catálogo / E-commerce',
    preview: '/proyectos/fly-and-chill.webp',
  },
  {
    id: 'empresarial',
    corto: 'Quiero conectar lo que ya uso',
    evidencia: '2 integraciones en red local',
    icono: ['10001','01110','00100','01110','10001'],
    heroLabel: 'integraciones',
    title: 'Soluciones integrales empresariales',
    description: 'Integraciones que conectan lo que la empresa ya usa, en su propia red.',
    projectType: 'Integraciones empresariales',
    preview: '/proyectos/tv-panel.webp',
  },
  {
    id: 'datos',
    corto: 'Quiero entender mis datos',
    evidencia: 'Informe completo y código R',
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
    corto: 'Quiero automatizar con IA',
    evidencia: 'Agente real, paso a paso',
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
    corto: 'Quiero probar algo ya hecho',
    evidencia: 'App propia, gratis en el navegador',
    icono: ['11111','10001','10101','10001','11111'],
    heroLabel: 'apps by pixies',
    title: 'Aplicaciones by Pixies',
    description: 'Herramientas que construí para mi propio uso — entra, pruébalas en vivo o descárgalas.',
    projectType: 'Producto propio (escuchacomprendiendo.IA)',
    seccionPropia: true,
  },
];
