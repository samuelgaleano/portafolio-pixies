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
  problemPoints: string[]; // 3-4 dolores concretos y escaneables (más visual que un párrafo)
  problem: string; // cierre de una línea que resume el dolor
  solutionLead: string; // titular directo de la solución
  solution: string;
  benefits: { k: string; v: string }[];
  steps: ErpStep[];
}

export const erpTour: ErpTour = {
  name: 'Sistema Integrado de Gestión Empresarial',
  tagline:
    'Un ERP a medida que corre la operación completa de una empresa industrial: 45 módulos sobre ~240 tablas, de la cotización al despacho. Construido módulo a módulo contra la operación real, con 2FA y seguridad endurecida bajo auditoría ISO/IEC 27001.',
  repoUrl: '', // software privado de operación de un cliente — sin repo público
  // Demo embebida: la página /demos/erp gatea el iframe con NEXT_PUBLIC_ERP_DEMO=on (+ ERP_DEMO_ORIGIN).
  // El enlace va SIEMPRE (Samuel r20): así las partes del ERP son oprimibles hacia el demo; si el
  // contenedor no está conectado, la página muestra un aviso amigable de "demo en preparación".
  demoUrl: '/demos/erp',
  stack: ['php', 'mysql', 'javascript'],
  modules: ['Producción', 'Comercial', 'Almacén', 'Compras', 'Calidad', 'RRHH', 'Auditoría', 'ISO 27001'],
  problemLead: 'Tu operación vive en Excels que no se hablan.',
  problemPoints: [
    'Gerencia se entera de los problemas cuando ya explotaron.',
    'El inventario del sistema nunca es el inventario real.',
    'Cotizaciones y pedidos se pierden en correos y WhatsApp.',
    'Una auditoría son semanas armando papeles a mano.',
  ],
  problem: 'Cada área trabaja en su archivo y nadie ve el conjunto: se decide a ciegas.',
  solutionLead: 'Un solo sistema corre todo.',
  solution:
    'De la cotización a la factura y de la orden de producción al despacho, con permisos por rol y trazabilidad de cada cambio — seguridad endurecida para pasar auditoría de verdad, no para aparentar.',
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
        'La respuesta a "¿cómo vamos?" apenas inicias sesión: órdenes activas y retrasadas, cotizaciones abiertas, alertas de stock y PQR, en una sola pantalla. Sin perseguir a cada área ni exportar nada a Excel — y con un buscador (Ctrl+K) para saltar a cualquier módulo.',
      tech: 'PHP 8 con patrón página↔API por módulo: el frontend consume ~45 endpoints api_*.php por fetch, con PDO y sentencias preparadas. Cada rol ve solo los módulos que le tocan.',
      screenshot: '/proyectos/erp/dashboard.webp',
      alt: 'Tablero principal del ERP con los KPIs del negocio y la grilla de módulos por área',
    },
    {
      id: 'produccion',
      title: 'Producción y Gantt',
      business:
        'Cada pedido se vuelve una orden de producción con fechas, áreas y responsables en un Gantt vivo. El jefe de planta ve qué se retrasa ANTES de que el cliente llame, y cada avance queda trazado por área y operario — con un portal aparte para que el operario reporte desde el piso.',
      tech: '~240 tablas InnoDB con 331 llaves foráneas y 53 triggers; los consecutivos de orden se administran de forma transaccional para no duplicar folios bajo concurrencia.',
      screenshot: '/proyectos/erp/produccion.webp',
      alt: 'Módulo de producción con diagrama de Gantt y las órdenes de producción activas',
    },
    {
      id: 'comercial',
      title: 'Comercial y cotizaciones',
      business:
        'Cada cotización tiene estado, versión y responsable, ligada a su cliente y sus tareas. El comercial sabe qué está por vencer y qué, ya aprobado, pasa directo a producción — nada vive en el correo de una sola persona.',
      tech: 'Módulos página↔API (api_comercial, api_cotizaciones, api_crm) por fetch, con estados y consecutivos controlados en el servidor; CRM y embudo de negocios integrados al flujo.',
      screenshot: '/proyectos/erp/comercial.webp',
      alt: 'Módulo comercial con el listado de cotizaciones, clientes y los KPIs de ventas',
    },
    {
      id: 'almacen',
      title: 'Almacén e inventario',
      business:
        'Se acaba el "creí que había": entradas, salidas, conversiones y solicitudes dejan rastro, así el stock del sistema ES el stock real. Producción pide material desde su módulo y almacén despacha con soporte — sin faltantes sorpresa ni compras dobles.',
      tech: 'Subida de archivos validada por tipo real (bytes) + nombre aleatorio con PHP deshabilitado en la carpeta de subidas; ~25 tablas *_historial para auditar cada movimiento de stock.',
      screenshot: '/proyectos/erp/almacen.webp',
      alt: 'Módulo de almacén con control de inventario, entradas, salidas y solicitudes',
    },
    {
      id: 'auditoria',
      title: 'Auditoría y seguridad',
      business:
        'La respuesta a "¿quién hizo esto?": cada acceso, cambio de precio y acción admin queda con usuario, IP y fecha, exportable a CSV. La empresa pasa controles ISO/IEC 27001 con evidencia, no con promesas — y los permisos por rol evitan el problema de raíz.',
      tech: 'Login por sesión con bcrypt, 2FA TOTP opcional con secreto cifrado AES-256-GCM, CSRF centralizado, CORS con lista blanca y cabeceras CSP/HSTS; endurecido bajo ISO/IEC 27001:2022.',
      screenshot: '/proyectos/erp/auditoria.webp',
      alt: 'Panel de auditoría general del ERP: registro de accesos, eventos de seguridad y tendencia',
    },
  ],
};
