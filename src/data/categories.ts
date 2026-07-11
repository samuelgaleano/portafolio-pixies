// Categorías del portafolio (A–F del plan §4.2). Bloques secuenciales con mini-nav de anclas.
// `projectType` pre-selecciona el select del formulario de leads (§6) según la sección de origen.
export type CategoryId = 'landing' | 'catalogo' | 'erp' | 'datos' | 'ia' | 'empresarial';

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  projectType: string; // valor para el select del lead form
  phase: 2 | 3; // en qué fase se puebla; las de F3 muestran "próximamente" por ahora
}

export const categories: Category[] = [
  {
    id: 'landing',
    title: 'Landing Pages',
    description: 'Páginas de aterrizaje que convierten: rápidas, medibles, hechas para una acción.',
    projectType: 'Landing page',
    phase: 2,
  },
  {
    id: 'catalogo',
    title: 'Catálogo / E-commerce',
    description: 'Tiendas y catálogos con base de datos: inventario real, no maquetas.',
    projectType: 'Catálogo / E-commerce',
    phase: 2,
  },
  {
    id: 'erp',
    title: 'Sistema ERP',
    description: 'Software a medida que corre la operación: módulos, permisos, procesos.',
    projectType: 'ERP / Software a medida',
    phase: 3,
  },
  {
    id: 'datos',
    title: 'Analítica e ingeniería de datos',
    description: 'De datos crudos a decisiones: pipelines, modelos y reportes que se leen.',
    projectType: 'Analítica de datos',
    phase: 3,
  },
  {
    id: 'ia',
    title: 'Implementaciones de IA',
    description: 'Sistemas agénticos que ejecutan procesos reales, no demos de chat.',
    projectType: 'IA',
    phase: 3,
  },
  {
    id: 'empresarial',
    title: 'Soluciones integrales empresariales',
    description: 'Integraciones que conectan lo que la empresa ya usa, en su propia red.',
    projectType: 'Integraciones empresariales',
    phase: 2,
  },
];
