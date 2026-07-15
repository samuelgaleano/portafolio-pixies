import type { CategoryId } from './categories';
import type { TechId } from './tech';

// EL CORAZÓN DATA-DRIVEN (§7.1). Agregar un proyecto = agregar un objeto aquí + un screenshot.
// status decide el link primario y la etiqueta: 'produccion' → liveUrl; 'codigo' → repoUrl.
// preview.src === '' → la tarjeta muestra el placeholder pixelado (no inventamos screenshots).
export interface Project {
  id: string; // slug único
  category: CategoryId;
  name: string;
  tagline: string; // 1–2 líneas de VALOR DE NEGOCIO (no técnicas)
  bullets: string[]; // 3–5 bullets TÉCNICOS: stack, arquitectura, decisiones de ingeniería
  stack: TechId[]; // ids de tech.ts → badges (typo = error de compilación)
  status: 'produccion' | 'codigo';
  liveUrl?: string; // requerido si status === 'produccion'
  repoUrl?: string; // requerido si status === 'codigo'
  demoUrl?: string; // demo en vivo con datos ficticios (proyectos sin sitio público real)
  preview: { src: string; alt: string }; // src '' = placeholder
  featured?: boolean;
}

// Proyectos REALES de Pixies / Samuel Galeano (analizados desde repos y entregas).
// Categorías con exhibición (erp → erp-tour, ia → agent-replay) NO listan tarjetas:
// el ERP real vive en erp-tour.ts. Aquí van los que se muestran como tarjeta.
export const projects: Project[] = [
  // A — Landing Pages
  {
    id: 'xiaomi-cartech',
    category: 'landing',
    name: 'Xiaomi CarTech',
    tagline: 'Landing de venta directa para un accesorio Xiaomi en Colombia, con checkout propio, pago en línea o contra entrega y medición de conversiones para campañas de Meta Ads.',
    bullets: [
      'SPA en Vite + React 19 + TypeScript con backend Express embebido, compilado tanto como servidor Node como función serverless de Vercel desde el mismo código.',
      'Pago con Wompi (pasarela colombiana): firma de integridad SHA-256 en el servidor y verificación del checksum del webhook antes de aprobar cada pedido.',
      'Tracking server-to-server con la Conversions API de Meta, hasheando email y teléfono en SHA-256 antes de enviarlos; email transaccional de confirmación vía Resend.',
      'Soporta pago en línea y contra entrega, con cálculo de fecha estimada de envío en días hábiles.',
    ],
    stack: ['vite', 'react', 'typescript', 'express', 'vercel', 'tailwind'],
    status: 'produccion',
    liveUrl: 'https://xiaomicartech.com.co/',
    repoUrl: 'https://github.com/samuelgaleano/XIAOMI_FINAL',
    preview: { src: '', alt: 'Vista previa de la landing de Xiaomi CarTech' },
    featured: true,
  },
  {
    id: 'specifinance',
    category: 'landing',
    name: 'Specifinance',
    tagline: 'Sitio de una boutique de dirección financiera con diagnóstico embebido y CRM propio: cada lead se captura, prioriza y da seguimiento sin depender de herramientas de terceros.',
    bullets: [
      'Frontend en Vite + React 19 + TypeScript + Tailwind CSS 4, con formulario de diagnóstico multipaso y panel de administración de leads.',
      'Backend serverless en Vercel Functions; almacenamiento de leads sobre Google Sheets vía Apps Script — arquitectura de costo cercano a cero, sin base de datos tradicional.',
      'Login de administración con token de sesión firmado por HMAC-SHA256 y comparación en tiempo constante contra ataques de temporización.',
      'Despliegue en Vercel con rewrites de SPA, cabeceras de seguridad y caché inmutable para assets; dominio propio.',
    ],
    stack: ['react', 'typescript', 'vite', 'tailwind', 'vercel', 'sheets'],
    status: 'produccion',
    liveUrl: 'https://specifinance.com/',
    preview: { src: '', alt: 'Vista previa del sitio de Specifinance' },
  },

  // B — Catálogo / E-commerce
  {
    id: 'fly-and-chill',
    category: 'catalogo',
    name: 'Fly & Chill',
    tagline: 'Tienda en línea con catálogo, carrito, checkout por pasarela de pago y un modelo de membresía aplicado a cada pedido.',
    bullets: [
      'SPA en Vite + React 19 + TypeScript servida por Express con PM2 detrás de nginx en una instancia AWS EC2 — decisión documentada frente a serverless para mantener el costo al mínimo.',
      'Persistencia en Firebase Firestore con reglas de seguridad default-deny, validación de esquema por colección y control de administración por lista blanca de correos verificados.',
      'Pagos con Wompi: creación de orden con firma de integridad y reconciliación idempotente del estado del pedido (consulta + webhook con checksum SHA-256 verificado).',
      'Sistema de códigos promocionales con incremento atómico de uso en Firestore; emails de confirmación solo tras aprobación del pago.',
      'Optimizaciones de infraestructura aplicadas: code-splitting por ruta, caché inmutable para assets con hash y swap para evitar OOM del build en una instancia de 1 GB.',
    ],
    stack: ['vite', 'react', 'typescript', 'firebase', 'express', 'nodejs'],
    status: 'produccion',
    liveUrl: 'https://flyandchill.store/shop',
    repoUrl: 'https://github.com/samuelgaleano/pagina-web-fly-and-chill-repo-',
    preview: { src: '', alt: 'Vista previa de la tienda Fly & Chill' },
    featured: true,
  },

  // F — Soluciones integrales empresariales
  {
    id: 'cic-inmuebles',
    category: 'empresarial',
    name: 'CIC Inmuebles',
    tagline: 'Plataforma inmobiliaria con catálogo público y back-office propio: capta compradores y vendedores por WhatsApp, agenda visitas y centraliza leads e inventario sin depender de portales de pago.',
    bullets: [
      'Next.js 16 (App Router) + React 19 + TypeScript; todas las mutaciones (leads, propiedades, agenda, plantillas) por Server Actions, sin una capa REST intermedia.',
      'Patrón repositorio con dos implementaciones intercambiables: Supabase (Postgres + RLS) en producción y una en memoria con datos semilla para desarrollo sin credenciales.',
      'Autenticación de administración construida a medida: cookie de sesión firmada con HMAC-SHA256 y comparación en tiempo constante contra ataques de temporización.',
      'Integraciones con Google Drive (fotos) y Google Sheets (sincronización de catálogo por cron diario), con Cloudinary como CDN opcional de imágenes.',
      'Tests con Vitest, validación con Zod y decisiones explícitas de portabilidad para no atarse a APIs propietarias de una sola nube.',
    ],
    stack: ['nextjs', 'react', 'typescript', 'tailwind', 'supabase', 'vercel', 'sheets'],
    status: 'produccion',
    liveUrl: 'https://www.cicinmuebles.com/',
    repoUrl: 'https://github.com/samuelgaleano/cic_inmuebles_web',
    preview: { src: '', alt: 'Vista previa de la plataforma CIC Inmuebles' },
    featured: true,
  },
  {
    id: 'senalizacion-digital-tv',
    category: 'empresarial',
    name: 'Sincronización de televisores en red local',
    tagline: 'Convierte un PC en servidor de cartelera digital que sincroniza contenido en tiempo real a varios televisores por WiFi, sin instalar nada en las pantallas.',
    bullets: [
      'Servidor Node.js (Express + Socket.io) que orquesta N pantallas por WebSockets: cada TV se une a su room y recibe el estado nuevo por push al subir, reordenar o borrar imágenes, sin polling.',
      'Panel de administración con carga de imágenes (validación de tipo y saneo de nombres), reordenamiento drag & drop e intervalo de rotación por pantalla; estado persistido en JSON, sin base de datos.',
      'Control del hardware Samsung Tizen implementado a mano (Wake-on-LAN + el protocolo WebSocket propietario del TV, con fallback a DIAL) porque las librerías existentes no cubrían los modelos objetivo.',
      'Emparejamiento persistente por TV y frontend de pantalla con precarga, transición cross-fade y reconexión automática ante cortes de red, pensado para correr indefinidamente en el navegador del Smart TV.',
    ],
    stack: ['nodejs', 'express', 'socketio', 'javascript'],
    status: 'codigo',
    repoUrl: 'https://github.com/samuelgaleano/sincronizacion-tv-red-local', // publicado sanitizado (sin datos del cliente)
    preview: { src: '/proyectos/tv-panel.png', alt: 'Panel de control del sistema de señalización: tres pantallas con controles de TV y carga de imágenes' },
    featured: true,
  },
  {
    id: 'pos-restaurante',
    category: 'empresarial',
    name: 'Sistema POS para restaurantes',
    tagline: 'Punto de venta completo para restaurantes: mesas, comandas de cocina, turnos de caja e inventario con trazabilidad, en un solo sistema con permisos por rol.',
    bullets: [
      'PHP con separación por rol (administrador, cajero, mesero) y una capa AJAX independiente para operaciones asíncronas; acceso a datos 100 % por PDO con sentencias preparadas.',
      'Modelo relacional de 13 tablas en MySQL: usuarios y roles, productos y categorías con kardex de inventario, mesas y zonas, órdenes con estados de cocina, turnos de caja y facturación.',
      'Flujo real end-to-end: el mesero abre mesa y crea la orden, el cajero cobra contra el turno abierto (incluye pagos mixtos) y el turno cierra con cálculo automático de diferencia de caja.',
      'Numeración de factura consecutiva con transacción y bloqueo de fila para evitar duplicados en concurrencia; autenticación por sesión con bcrypt y control de acceso por rol verificado en cada módulo.',
    ],
    stack: ['php', 'mysql', 'javascript'],
    status: 'codigo',
    repoUrl: 'https://github.com/samuelgaleano/sistema-pos-restaurante',
    preview: { src: '', alt: 'Vista previa del sistema POS para restaurantes' },
  },
];

export const projectsByCategory = (id: CategoryId): Project[] =>
  projects
    .filter((p) => p.category === id)
    .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
