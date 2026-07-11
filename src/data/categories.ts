// Categorías del portafolio (A–F del plan §4.2). Bloques secuenciales con mini-nav de anclas.
// `projectType` pre-selecciona el select del formulario de leads (§6) según la sección de origen.
// `exhibit` marca las categorías con exhibición especial (§12): erp y ia no usan tarjetas.
export type CategoryId = 'landing' | 'catalogo' | 'erp' | 'datos' | 'ia' | 'empresarial';

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  projectType: string; // valor para el select del lead form
  exhibit?: 'erp-tour' | 'agent-replay'; // si existe, se renderiza la isla en vez de tarjetas
}

export const categories: Category[] = [
  {
    id: 'landing',
    title: 'Landing Pages',
    description: 'Páginas de aterrizaje que convierten: rápidas, medibles, hechas para una acción.',
    projectType: 'Landing page',
  },
  {
    id: 'catalogo',
    title: 'Catálogo / E-commerce',
    description: 'Tiendas y catálogos con base de datos: inventario real, no maquetas.',
    projectType: 'Catálogo / E-commerce',
  },
  {
    id: 'erp',
    title: 'Sistema ERP',
    description: 'Software a medida que corre la operación: módulos, permisos, procesos.',
    projectType: 'ERP / Software a medida',
    exhibit: 'erp-tour',
  },
  {
    id: 'datos',
    title: 'Analítica e ingeniería de datos',
    description: 'De datos crudos a decisiones: pipelines, modelos y reportes que se leen.',
    projectType: 'Analítica de datos',
  },
  {
    id: 'ia',
    title: 'Implementaciones de IA',
    description: 'Sistemas agénticos que ejecutan procesos reales, no demos de chat.',
    projectType: 'IA',
    exhibit: 'agent-replay',
  },
  {
    id: 'empresarial',
    title: 'Soluciones integrales empresariales',
    description: 'Integraciones que conectan lo que la empresa ya usa, en su propia red.',
    projectType: 'Integraciones empresariales',
  },
];
