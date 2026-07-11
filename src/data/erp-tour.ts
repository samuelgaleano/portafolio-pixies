// Recorrido guiado del ERP (§12.A: scrollytelling, cero riesgo de demo rota).
// Samuel reemplaza los [COMPLETAR] con screenshots reales y detalles del ERP real.
import type { TechId } from './tech';

export interface ErpStep {
  id: string;
  title: string;
  business: string; // qué resuelve para el negocio
  tech: string; // decisión de arquitectura / técnica
  screenshot: string; // ruta en src/assets/erp/ — '' = placeholder pixelado
  alt: string;
}

export interface ErpTour {
  name: string;
  tagline: string;
  repoUrl: string;
  stack: TechId[];
  modules: string[]; // badges de módulos
  steps: ErpStep[];
}

export const erpTour: ErpTour = {
  name: '[COMPLETAR: nombre del ERP]',
  tagline: 'El software que corre la operación completa: facturación, inventario y decisiones en un solo lugar.',
  repoUrl: '', // [COMPLETAR: URL del repo del ERP]
  stack: ['react', 'supabase', 'postgres', 'tailwind'],
  modules: ['Facturación', 'Inventario', 'Clientes', 'Reportes', 'Roles y permisos'],
  steps: [
    {
      id: 'panel',
      title: 'Panel de control',
      business: 'El dueño ve el estado del negocio al abrir: ventas del día, alertas de stock, pendientes.',
      tech: '[COMPLETAR: ej. vistas materializadas en Postgres para KPIs sin recalcular en cada carga]',
      screenshot: '',
      alt: 'Panel principal del ERP con indicadores del negocio',
    },
    {
      id: 'facturacion',
      title: 'Facturación',
      business: 'Emitir una factura toma segundos y queda registrada, numerada y lista para el cliente.',
      tech: '[COMPLETAR: ej. numeración transaccional con constraint en BD para evitar saltos/duplicados]',
      screenshot: '',
      alt: 'Módulo de facturación del ERP',
    },
    {
      id: 'inventario',
      title: 'Inventario',
      business: 'El stock se descuenta solo con cada venta; el sistema avisa antes de quedarse sin producto.',
      tech: '[COMPLETAR: ej. triggers en BD que ajustan existencias de forma atómica al facturar]',
      screenshot: '',
      alt: 'Módulo de inventario del ERP',
    },
    {
      id: 'reportes',
      title: 'Reportes',
      business: 'Preguntas del negocio (qué se vende, cuándo, a quién) respondidas sin exportar a Excel.',
      tech: '[COMPLETAR: ej. consultas agregadas parametrizadas + export a CSV bajo demanda]',
      screenshot: '',
      alt: 'Módulo de reportes del ERP',
    },
    {
      id: 'permisos',
      title: 'Roles y permisos',
      business: 'Cada persona ve solo lo suyo: el cajero factura, el dueño ve todo, nadie toca lo que no debe.',
      tech: '[COMPLETAR: ej. Row Level Security en Supabase por rol, aplicada en la base, no en el cliente]',
      screenshot: '',
      alt: 'Configuración de roles y permisos del ERP',
    },
  ],
};
