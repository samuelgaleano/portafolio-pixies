// Recorrido guiado del ERP (§12.A: scrollytelling, cero riesgo de demo rota).
// ERP real de operación privada de un cliente: se muestra ANONIMIZADO y sin capturas
// reales (la entrega contiene PII y datos del cliente). repoUrl vacío a propósito.
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
  name: 'Sistema Integrado de Gestión Empresarial',
  tagline: 'ERP a medida que corre la operación completa de una empresa industrial: 45 módulos sobre una base de ~240 tablas, endurecido y auditado bajo ISO/IEC 27001.',
  repoUrl: '', // software privado de operación de un cliente — sin repo público
  stack: ['php', 'mysql', 'javascript'],
  modules: ['Producción', 'Almacén', 'Compras', 'CRM', 'Facturación', 'Calidad', 'RRHH', 'Auditoría'],
  steps: [
    {
      id: 'dashboard',
      title: 'Tablero y KPIs',
      business: 'La operación se lee de un vistazo: indicadores por área, alertas y pendientes al abrir, sin exportar nada a Excel.',
      tech: 'PHP 8 puro con patrón página↔API por módulo: el frontend consume ~45 endpoints api_*.php por fetch; datos por PDO con sentencias preparadas.',
      screenshot: '',
      alt: 'Tablero principal del ERP con indicadores del negocio',
    },
    {
      id: 'produccion',
      title: 'Producción',
      business: 'Del pedido a la planta: órdenes de producción con Gantt, master de producción, vaciado e histórico, todo trazable.',
      tech: 'Modelo relacional de ~240 tablas InnoDB con prefijos por dominio, 331 llaves foráneas y 53 triggers; consecutivos administrados de forma transaccional.',
      screenshot: '',
      alt: 'Módulo de producción con diagrama de Gantt',
    },
    {
      id: 'almacen',
      title: 'Almacén y compras',
      business: 'Inventario, cotizaciones y órdenes de compra conectados: el stock refleja lo que entra y sale, en el momento.',
      tech: 'Subida de archivos validada por MIME + extensión + nombre aleatorio, con PHP deshabilitado en uploads; ~25 tablas *_historial para auditoría de cambios.',
      screenshot: '',
      alt: 'Módulo de almacén e inventario del ERP',
    },
    {
      id: 'seguridad',
      title: 'Seguridad y auditoría',
      business: 'Software empresarial serio: acceso protegido, cambios registrados y una auditoría externa que lo respalda.',
      tech: 'Login por sesión con bcrypt, 2FA TOTP con secreto cifrado AES-256-GCM, CSRF centralizado, CORS con lista blanca y cabeceras de seguridad (CSP/HSTS); auditado contra ISO/IEC 27001:2022.',
      screenshot: '',
      alt: 'Panel de auditoría y seguridad del ERP',
    },
    {
      id: 'permisos',
      title: 'Roles y disciplina de ingeniería',
      business: 'Cada persona ve solo lo suyo, y el sistema se mantiene sin sorpresas: probado, versionado y con respaldos.',
      tech: 'RBAC de 11 roles, rate-limiting de login por IP; análisis estático con PHPStan (0 errores), suite de pruebas propia, migraciones versionadas y scripts de backup/restauración.',
      screenshot: '',
      alt: 'Configuración de roles y permisos del ERP',
    },
  ],
};
