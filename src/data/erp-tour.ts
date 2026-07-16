// Recorrido guiado del ERP (§12.A: scrollytelling). El ERP es software privado de
// operación de un cliente; aquí se muestra la DEMO con marca ficticia ("Corporación
// Andina") y datos ficticios — sin PII real. Cada paso lleva una captura real de esa
// demo por sección. repoUrl vacío a propósito (repo privado).
import type { TechId } from './tech';
import type { TourStep } from '@/components/exhibits/StepTour';

// Un paso del ERP es un paso de tour genérico (misma forma que el de analítica).
export type ErpStep = TourStep;

export interface ErpTour {
  name: string;
  tagline: string;
  repoUrl: string;
  demoUrl?: string; // demo embebida (estructura real + datos ficticios, sin PII)
  stack: TechId[];
  modules: string[]; // badges de módulos
  // gancho problema→solución para VENDER el ERP antes del recorrido técnico
  problemLead: string; // titular directo/general del dolor (lo que llama la atención)
  problem: string;
  solutionLead: string; // titular directo de la solución
  solution: string;
  benefits: { k: string; v: string }[];
  steps: ErpStep[];
}

export const erpTour: ErpTour = {
  name: 'Sistema Integrado de Gestión Empresarial',
  tagline:
    'Un ERP a medida que corre la operación completa de una empresa industrial: 45 módulos sobre ~240 tablas. Lo construí módulo a módulo contra la operación real, y su seguridad pasó por auditoría ISO/IEC 27001.',
  repoUrl: '', // software privado de operación de un cliente — sin repo público
  // Demo embebida: la página /demos/erp gatea el iframe con NEXT_PUBLIC_ERP_DEMO=on (+ ERP_DEMO_ORIGIN).
  // El enlace va SIEMPRE (Samuel r20): así las partes del ERP son oprimibles hacia el demo; si el
  // contenedor no está conectado, la página muestra un aviso amigable de "demo en preparación".
  demoUrl: '/demos/erp',
  stack: ['php', 'mysql', 'javascript'],
  modules: ['Producción', 'Comercial', 'Almacén', 'Compras', 'Calidad', 'RRHH', 'Auditoría', 'ISO 27001'],
  problemLead: 'Cada área en su propio Excel.',
  problem:
    'Gerencia no ve la operación en tiempo real, el inventario nunca cuadra, las ventas se pierden en correos y una auditoría es un dolor de cabeza.',
  solutionLead: 'Un solo sistema corre todo.',
  solution:
    'De la cotización a la factura y de la orden de producción al despacho — con permisos por rol y seguridad endurecida para pasar auditoría, no para aparentar.',
  benefits: [
    { k: '45 módulos', v: 'una operación completa en un lugar' },
    { k: '~240 tablas', v: 'trazabilidad e historial de cada cambio' },
    { k: 'ISO/IEC 27001', v: 'seguridad auditada con evidencia' },
    { k: 'Permisos por rol', v: 'cada quien ve y hace solo lo suyo' },
  ],
  steps: [
    {
      id: 'dashboard',
      title: 'Tablero y KPIs',
      business:
        'Resuelve la pregunta diaria de gerencia: "¿cómo vamos?". Órdenes activas y retrasadas, cotizaciones abiertas, solicitudes de almacén y tareas pendientes en una sola pantalla al iniciar sesión — sin perseguir a cada área ni exportar nada a Excel.',
      tech: 'PHP 8 puro con patrón página↔API por módulo: el frontend consume ~45 endpoints api_*.php por fetch; acceso a datos por PDO con sentencias preparadas.',
      screenshot: '/proyectos/erp/dashboard.webp',
      alt: 'Tablero principal del ERP con los KPIs del negocio y la grilla de módulos por área',
    },
    {
      id: 'produccion',
      title: 'Producción y Gantt',
      business:
        'Resuelve el caos de planta: cada pedido se vuelve una orden de producción con fechas, áreas y responsables en un Gantt vivo. El jefe de producción ve qué está retrasado ANTES de que el cliente llame, y cada avance queda trazado por área y operario.',
      tech: 'Modelo relacional de ~240 tablas InnoDB con 331 llaves foráneas y 53 triggers; los consecutivos de orden se administran de forma transaccional.',
      screenshot: '/proyectos/erp/produccion.webp',
      alt: 'Módulo de producción con diagrama de Gantt y las órdenes de producción activas',
    },
    {
      id: 'comercial',
      title: 'Comercial y cotizaciones',
      business:
        'Resuelve las ventas que se pierden por desorden: cada cotización tiene estado, versión y responsable, ligada a su cliente y a sus tareas. El comercial sabe qué está por vencer y qué aprobado pasa a producción — nada vive en el correo de alguien.',
      tech: 'Cada módulo es una página que consume su propia API (api_comercial, api_cotizaciones, api_crm) por fetch; estados y consecutivos se controlan en el servidor.',
      screenshot: '/proyectos/erp/comercial.webp',
      alt: 'Módulo comercial con el listado de cotizaciones, clientes y los KPIs de ventas',
    },
    {
      id: 'almacen',
      title: 'Almacén e inventario',
      business:
        'Resuelve el "creí que había": entradas, salidas, conversiones y solicitudes de material dejan rastro, así el stock del sistema es el stock real. Producción pide materiales desde su módulo y almacén despacha con soporte — se acaban los faltantes sorpresa y las compras dobles.',
      tech: 'Subida de archivos validada por MIME + extensión + nombre aleatorio con PHP deshabilitado en uploads; ~25 tablas *_historial para auditar cada cambio de stock.',
      screenshot: '/proyectos/erp/almacen.webp',
      alt: 'Módulo de almacén con control de inventario, entradas, salidas y solicitudes',
    },
    {
      id: 'auditoria',
      title: 'Auditoría y seguridad',
      business:
        'Resuelve el "¿quién hizo esto?": cada acceso, cambio de precio y acción administrativa queda registrada con usuario, IP y fecha, exportable para auditorías. La empresa pasa controles (ISO/IEC 27001) con evidencia, no con promesas — y los permisos por rol evitan el problema de raíz.',
      tech: 'Login por sesión con bcrypt, 2FA TOTP con secreto cifrado AES-256-GCM, CSRF centralizado, CORS con lista blanca y cabeceras de seguridad (CSP/HSTS); endurecido bajo ISO/IEC 27001:2022.',
      screenshot: '/proyectos/erp/auditoria.webp',
      alt: 'Panel de auditoría general del ERP: registro de accesos, eventos de seguridad y tendencia',
    },
  ],
};
