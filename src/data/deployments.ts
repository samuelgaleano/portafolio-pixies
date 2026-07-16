// "En producción" para /samuel (rediseño Samuel 2026-07-18): reemplaza la experiencia
// laboral genérica por lo que de verdad diferencia a un ingeniero — desplegar, asegurar y
// decidir infraestructura. Cada punto sale de un proyecto REAL (ver projects.ts / stories).
export interface Deployment {
  title: string;
  detail: string;
  tag: string; // proyecto o criterio que lo respalda
}

export const deployments: Deployment[] = [
  {
    title: 'Servidor propio en AWS',
    detail:
      'Instancia EC2 administrada por terminal: SSH, nginx como proxy inverso y PM2 manteniendo el proceso Node vivo. Configuré swap para que el build no muriera en 1 GB de RAM.',
    tag: 'Fly & Chill · producción',
  },
  {
    title: 'Serverless de costo casi cero',
    detail:
      'Páginas pregeneradas servidas por CDN global y funciones bajo demanda: nada de servidor que pagar por hora. Este mismo portafolio cuesta ~0 al mes y escala solo.',
    tag: 'Xiaomi · Specifinance · este sitio',
  },
  {
    title: 'Bases de datos con reglas',
    detail:
      'Postgres con Row-Level Security en Supabase y Firestore default-deny con validación por colección: los datos se protegen en la base, no en el cliente.',
    tag: 'CIC Inmuebles · Fly & Chill',
  },
  {
    title: 'Contenedores y demos en vivo',
    detail:
      'Los tres sistemas —POS, ERP y señalización de TVs— empaquetados en Docker (Apache/PHP/MariaDB o Node, autocontenidos y sembrados al arrancar) y desplegados en Render; embebidos en este portafolio para que cualquiera pruebe la demo real con datos de ejemplo, sin instalar nada.',
    tag: 'POS · ERP · TVs · Render en vivo',
  },
  {
    title: 'Pagos y seguridad en producción',
    detail:
      'Wompi con firma de integridad y webhooks idempotentes (un pago no se duplica aunque lleguen dos avisos); sesiones de administración firmadas con HMAC-SHA256 en tiempo constante.',
    tag: 'Wompi · paneles admin',
  },
  {
    title: 'IA y agentes que ejecutan',
    detail:
      'Integraciones con la API de Claude (Anthropic) y OpenAI, agentes con skills y RAG sobre embeddings: sistemas que ejecutan procesos reales de punta a punta, no demos de chat.',
    tag: 'Claude · OpenAI · agentes',
  },
  {
    title: 'Analítica que se lee',
    detail:
      'De datos crudos a decisiones: limpieza y modelado en R/Python, SQL analítico y tableros en Looker/GCP — reproducibles y listos para presentar a quien decide.',
    tag: 'R · Python · GCP · Looker',
  },
  {
    title: 'Presupuesto en la nube',
    detail:
      'Elijo la infraestructura por costo real: servidor propio cuando conviene fijar el gasto, serverless cuando conviene que escale solo. La decisión queda documentada, no improvisada.',
    tag: 'criterio de ingeniería',
  },
];
