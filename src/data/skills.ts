// Capacidades por dominio para /samuel (§7.3). Profundidad con etiquetas HONESTAS de 3 niveles,
// nunca barras de progreso genéricas. Samuel ajusta items y niveles a la realidad.
export type Depth = 'produccion' | 'solido' | 'explorando';

export const depthLabel: Record<Depth, string> = {
  produccion: 'En producción',
  solido: 'Base sólida',
  explorando: 'Explorando',
};

export interface SkillItem {
  name: string;
  depth: Depth;
  note?: string;
}

export interface SkillDomain {
  id: string;
  title: string;
  blurb: string;
  items: SkillItem[];
}

export const skillDomains: SkillDomain[] = [
  {
    id: 'web',
    title: 'Desarrollo web',
    blurb: 'Sitios y apps que cargan rápido, se ven bien y se indexan.',
    items: [
      { name: 'Next.js', depth: 'produccion', note: 'este sitio' },
      { name: 'React', depth: 'produccion', note: 'este sitio' },
      { name: 'TypeScript', depth: 'produccion' },
      { name: 'Tailwind CSS', depth: 'produccion' },
      { name: 'Astro', depth: 'solido' },
    ],
  },
  {
    id: 'software',
    title: 'Software a medida',
    blurb: 'Sistemas que corren la operación: ERP, paneles, procesos.',
    items: [
      { name: 'Node.js', depth: 'produccion' },
      { name: 'PostgreSQL', depth: 'produccion' },
      { name: 'PHP', depth: 'produccion', note: 'ERP y POS' },
      { name: 'MySQL / MariaDB', depth: 'produccion' },
      { name: 'Supabase', depth: 'produccion' },
      { name: 'Firebase', depth: 'solido' },
    ],
  },
  {
    id: 'infra',
    title: 'Infraestructura y despliegue',
    blurb: 'Empaquetar, desplegar y mantener sistemas en producción, con criterio de costo.',
    items: [
      { name: 'Docker', depth: 'produccion', note: 'contenedores autocontenidos' },
      { name: 'Render', depth: 'produccion', note: 'demos POS · ERP · TVs en vivo' },
      { name: 'Vercel', depth: 'produccion', note: 'este sitio' },
      { name: 'AWS EC2 · nginx · PM2', depth: 'produccion', note: 'Fly & Chill' },
      { name: 'CI/CD y despliegue por Git', depth: 'solido' },
    ],
  },
  {
    id: 'datos',
    title: 'Datos e ingeniería',
    blurb: 'De datos crudos a decisiones: limpieza, análisis, visualización.',
    items: [
      { name: 'Python · pandas / numpy', depth: 'solido' },
      { name: 'SQL analítico', depth: 'produccion' },
      { name: 'R · tidyverse', depth: 'solido', note: 'análisis Saber 11' },
      { name: 'Excel / Sheets avanzado', depth: 'produccion', note: 'reporting operativo diario' },
      { name: 'Google Cloud Platform', depth: 'solido' },
      { name: 'Looker Studio', depth: 'solido' },
      { name: 'Power BI', depth: 'explorando' },
    ],
  },
  {
    id: 'ia',
    title: 'Inteligencia artificial',
    blurb: 'Sistemas agénticos que ejecutan procesos reales, no demos de chat.',
    items: [
      { name: 'Agentes con skills', depth: 'produccion', note: 'pipelines estructurados' },
      { name: 'Integración de LLMs', depth: 'produccion' },
      { name: 'RAG / embeddings', depth: 'solido' },
      { name: 'API de Anthropic (Claude)', depth: 'solido' },
    ],
  },
  {
    id: 'integraciones',
    title: 'Integraciones empresariales',
    blurb: 'Conectar lo que la empresa ya usa, incluso en su propia red local.',
    items: [
      { name: 'WhatsApp Business API', depth: 'solido' },
      { name: 'Google Workspace / Sheets', depth: 'produccion' },
      { name: 'Redes locales (LAN)', depth: 'produccion', note: 'sincronización, mensajería' },
      { name: 'Wompi (pagos en línea)', depth: 'produccion' },
    ],
  },
];
