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
      { name: 'Astro', depth: 'produccion', note: 'este sitio' },
      { name: 'React', depth: 'produccion' },
      { name: 'TypeScript', depth: 'produccion' },
      { name: 'Tailwind CSS', depth: 'produccion' },
      { name: 'Next.js', depth: 'solido' },
    ],
  },
  {
    id: 'software',
    title: 'Software a medida',
    blurb: 'Sistemas que corren la operación: ERP, paneles, procesos.',
    items: [
      { name: 'Node.js', depth: 'produccion' },
      { name: 'PostgreSQL', depth: 'produccion' },
      { name: 'Supabase', depth: 'produccion' },
      { name: 'Firebase', depth: 'solido' },
      { name: '[COMPLETAR: otra tecnología real]', depth: 'solido' },
    ],
  },
  {
    id: 'datos',
    title: 'Datos e ingeniería',
    blurb: 'De datos crudos a decisiones: limpieza, análisis, visualización.',
    items: [
      { name: 'Python', depth: 'produccion' },
      { name: 'pandas', depth: 'solido' },
      { name: 'SQL analítico', depth: 'produccion' },
      { name: '[COMPLETAR: herramienta de BI/viz]', depth: 'explorando' },
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
      { name: '[COMPLETAR: framework de IA que uses]', depth: 'explorando' },
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
      { name: '[COMPLETAR: otra integración real]', depth: 'solido' },
    ],
  },
];
