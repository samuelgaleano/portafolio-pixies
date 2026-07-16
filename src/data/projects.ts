import type { CategoryId } from './categories';
import type { TechId } from './tech';

// EL CORAZÓN DATA-DRIVEN (§7.1). Agregar un proyecto = agregar un objeto aquí + un screenshot.
// status decide el link primario y la etiqueta: 'produccion' → liveUrl; 'codigo' → repoUrl.
// preview.src === '' → la tarjeta muestra el placeholder pixelado (no inventamos screenshots).
// La copy va en primera persona (la voz del ingeniero): concreta, verificable y sin humo.
// Regla: las descripciones no dicen dónde está desplegado cada proyecto — la excepción es
// Fly & Chill, donde administrar el servidor (AWS EC2, por terminal) ES parte del mérito.
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
  // gancho problema→solución opcional (Samuel r21): si el proyecto lo trae, su categoría muestra
  // el flip interactivo sobre la grilla (mismo patrón que el ERP). Copy general y concreta.
  problemLead?: string;
  problem?: string;
  solutionLead?: string;
  solution?: string;
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
    tagline:
      'Landing de venta directa de un cargador Xiaomi para carro en Colombia: el cliente paga en línea o contra entrega, y cada pedido queda medido para las campañas de Meta.',
    bullets: [
      'SPA en Vite + React 19 + TypeScript con el backend Express embebido en el mismo repo: un solo código que compila como servidor Node o como función serverless, según haga falta.',
      'Cobros con Wompi (pasarela colombiana): la firma de integridad se calcula en el servidor con SHA-256 y el webhook no aprueba nada sin verificar su checksum — nadie se inventa un pago.',
      'Tracking servidor-a-servidor con la Conversions API de Meta: email y teléfono viajan hasheados, nunca en claro; la confirmación de compra sale por Resend.',
      'El pedido calcula su fecha estimada de entrega en días hábiles — detalle pequeño, pero es lo primero que pregunta quien compra contra entrega.',
    ],
    stack: ['vite', 'react', 'typescript', 'express', 'tailwind'],
    status: 'produccion',
    liveUrl: 'https://xiaomicartech.com.co/',
    repoUrl: 'https://github.com/samuelgaleano/XIAOMI_FINAL',
    preview: { src: '/proyectos/xiaomi-cartech.jpg', alt: 'Landing de Xiaomi CarTech: cargador inalámbrico Mi 20W con precio y checkout' },
    featured: true,
  },
  {
    id: 'specifinance',
    category: 'landing',
    name: 'Specifinance',
    tagline:
      'El sitio de una boutique de dirección financiera, con un diagnóstico embebido que captura leads y un mini-CRM propio para darles seguimiento. Sin depender de herramientas de terceros.',
    bullets: [
      'Frontend en Vite + React 19 + TypeScript + Tailwind CSS 4; el diagnóstico es un formulario multipaso pensado para que no se sienta como un formulario.',
      'Los leads se guardan en Google Sheets vía Apps Script, detrás de un backend serverless: costo de operación cercano a cero y el cliente revisa sus datos donde ya sabe moverse.',
      'El login del panel firma la sesión con HMAC-SHA256 y compara en tiempo constante: un panel con datos de clientes no podía ser la puerta débil del sitio.',
      'Cabeceras de seguridad, caché inmutable para los assets con hash y dominio propio.',
    ],
    stack: ['react', 'typescript', 'vite', 'tailwind', 'sheets'],
    status: 'produccion',
    liveUrl: 'https://specifinance.com/',
    preview: { src: '/proyectos/specifinance.jpg', alt: 'Sitio de Specifinance: dirección financiera y crecimiento corporativo basado en datos' },
  },

  // B — Catálogo / E-commerce
  {
    id: 'fly-and-chill',
    category: 'catalogo',
    name: 'Fly & Chill',
    tagline:
      'Tienda en línea con catálogo, carrito, pagos y membresía por pedido. La monté completa: frontend, backend, base de datos y el servidor donde vive.',
    bullets: [
      'Desplegada en AWS sobre una instancia EC2 que administro por terminal: SSH, nginx de proxy inverso y PM2 manteniendo vivo el proceso Node. Sin paneles — todo por consola.',
      'SPA en Vite + React 19 + TypeScript servida por Express; elegí servidor propio en vez de serverless para dejar el costo fijo en lo mínimo, y la decisión quedó documentada.',
      'Firestore con reglas default-deny y validación de esquema por colección; al panel de administración solo entra una lista blanca de correos verificados.',
      'Pagos con Wompi: firma de integridad al crear la orden y reconciliación idempotente del estado (consulta + webhook con checksum verificado) — aunque lleguen dos avisos, el pedido no se duplica.',
      'La instancia tiene 1 GB de RAM: tocó configurar swap para que el build no muriera y dejar code-splitting por ruta. Barato y estable.',
    ],
    stack: ['vite', 'react', 'typescript', 'firebase', 'express', 'nodejs'],
    status: 'produccion',
    liveUrl: 'https://flyandchill.store/shop',
    repoUrl: 'https://github.com/samuelgaleano/pagina-web-fly-and-chill-repo-',
    preview: { src: '/proyectos/fly-and-chill.jpg', alt: 'Tienda Fly & Chill: catálogo de productos con filtros de categoría y precio' },
    featured: true,
  },

  {
    // Vive en Catálogo/E-commerce: es una plataforma web de catálogo con administración
    // propia (decisión de ubicación de Samuel) — aunque su alcance sea empresarial.
    id: 'cic-inmuebles',
    category: 'catalogo',
    name: 'CIC Inmuebles',
    tagline:
      'Plataforma inmobiliaria con catálogo público y back-office propio: los leads llegan por WhatsApp, las visitas se agendan y el inventario vive en un solo lugar — sin pagar portales.',
    bullets: [
      'Next.js 16 (App Router) + React 19 + TypeScript; todas las mutaciones (leads, propiedades, agenda, plantillas) van por Server Actions — no hay una capa REST que mantener.',
      'Patrón repositorio con dos implementaciones intercambiables: Supabase (Postgres + RLS) en producción y una en memoria con datos semilla para desarrollar sin credenciales.',
      'La sesión de administración se firma con HMAC-SHA256 y se compara en tiempo constante; preferí entender la autenticación línea a línea antes que instalar una caja negra.',
      'Se integra con Google Drive (fotos) y Google Sheets (sincronización del catálogo por cron diario), con Cloudinary opcional como CDN de imágenes.',
      'Tests con Vitest, validación con Zod, y decisiones de portabilidad escritas para no casarse con una sola nube.',
    ],
    stack: ['nextjs', 'react', 'typescript', 'tailwind', 'supabase', 'sheets'],
    status: 'produccion',
    liveUrl: 'https://www.cicinmuebles.com/',
    repoUrl: 'https://github.com/samuelgaleano/cic_inmuebles_web',
    preview: { src: '/proyectos/cic-inmuebles.jpg', alt: 'Plataforma CIC Inmuebles: apartamentos y casas en venta en Colombia' },
    featured: true,
  },

  // F — Soluciones integrales empresariales
  {
    id: 'senalizacion-digital-tv',
    category: 'empresarial',
    name: 'Sincronización de televisores en red local',
    tagline:
      'Convierte un PC en servidor de cartelera digital: los televisores del local muestran y rotan contenido sincronizado por WiFi, sin instalar nada en las pantallas.',
    bullets: [
      'Servidor Node (Express + Socket.io) que orquesta N pantallas por WebSockets: cada TV se une a su sala y recibe el estado por push al subir, reordenar o borrar imágenes, sin hacer polling.',
      'Panel con carga de imágenes (validación de tipo y saneo de nombres), drag & drop e intervalo de rotación por pantalla; el estado persiste en JSON — para tres TVs, una base de datos era matar moscas a cañonazos.',
      'El control del hardware Samsung lo implementé a mano (Wake-on-LAN + el protocolo WebSocket propietario del TV, con DIAL de respaldo) porque ninguna librería cubría los modelos del cliente.',
      'Las pantallas precargan, transicionan con cross-fade y se reconectan solas si se cae la red: están pensadas para quedarse semanas encendidas en el navegador del Smart TV.',
    ],
    stack: ['nodejs', 'express', 'socketio', 'javascript'],
    status: 'codigo',
    repoUrl: 'https://github.com/samuelgaleano/sincronizacion-tv-red-local', // publicado sanitizado (sin datos del cliente)
    // demo embebida (TV en Render): define NEXT_PUBLIC_TV_DEMO_URL y aparece "Ver demo en vivo" → /demos/tv
    demoUrl: '/demos/tv', // enlace SIEMPRE (Samuel r20); la página gatea el iframe con NEXT_PUBLIC_TV_DEMO_URL
    preview: { src: '/proyectos/tv-panel.png', alt: 'Panel de control del sistema de señalización: tres pantallas con controles de TV y carga de imágenes' },
    featured: true,
  },
  {
    id: 'pos-restaurante',
    category: 'empresarial',
    name: 'Sistema POS para restaurantes',
    tagline:
      'Punto de venta completo para restaurantes: mesas, comandas de cocina, turnos de caja e inventario con trazabilidad — cada rol con su pantalla y sus permisos.',
    bullets: [
      'PHP con separación por rol (administrador, cajero, mesero) y una capa AJAX aparte para lo asíncrono; todo el acceso a datos va por PDO con sentencias preparadas.',
      'Modelo relacional de 13 tablas en MySQL: productos y categorías con kardex de inventario, mesas y zonas, órdenes con estados de cocina, turnos de caja y facturación.',
      'El flujo completo funciona de punta a punta: el mesero abre la mesa y comanda, el cajero cobra contra su turno (acepta pagos mixtos) y el cierre calcula solo la diferencia de caja.',
      'La numeración de factura usa transacción con bloqueo de fila: dos cajas cobrando a la vez jamás repiten consecutivo. Contraseñas con bcrypt y rol verificado en cada módulo.',
    ],
    stack: ['php', 'mysql', 'javascript'],
    status: 'codigo',
    repoUrl: 'https://github.com/samuelgaleano/sistema-pos-restaurante',
    // demo embebida (POS dockerizado, proxeado bajo /pos-demo): activa con NEXT_PUBLIC_POS_DEMO=on
    demoUrl: '/demos/pos', // enlace SIEMPRE (Samuel r20); la página gatea el iframe con NEXT_PUBLIC_POS_DEMO=on
    // gancho problema→solución interactivo (Samuel r21): se muestra sobre la grilla empresarial
    problemLead: 'Comandas a gritos y una caja que no cuadra.',
    problem:
      'El pedido se pierde entre la mesa y la cocina, el cierre de caja nunca da, y a fin de mes nadie sabe con certeza qué se vendió ni cuánto queda en inventario.',
    solutionLead: 'Cada rol con su pantalla; la caja cuadra sola.',
    solution:
      'Mesero, cocina y cajero en un solo flujo: la comanda llega sin errores, el consecutivo de factura nunca se repite y el cierre calcula la diferencia de caja por ti.',
    preview: { src: '/proyectos/pos-dashboard.webp', alt: 'Dashboard del POS tras iniciar sesión: ventas del día, gráfica de los últimos 7 días, top de productos, últimas facturas y alertas de stock bajo' },
  },
];

export const projectsByCategory = (id: CategoryId): Project[] =>
  projects
    .filter((p) => p.category === id)
    .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
