// Trayectoria y estudios para el "mapa de conocimiento" de /samuel (§7.3).
// Datos REALES del CV de Samuel (2026). Cuando exista enlace verificable, va en url
// y la tarjeta muestra "verificar →". Prohibido inventar credenciales.
export type CredKind = 'titulo' | 'certificado' | 'curso';

export interface Credential {
  title: string;
  institution: string;
  year: string;
  url?: string; // enlace verificable cuando exista
  kind: CredKind;
}

export const kindGroups: { kind: CredKind; label: string }[] = [
  { kind: 'titulo', label: 'Formación' },
  { kind: 'certificado', label: 'Certificaciones' },
  { kind: 'curso', label: 'Cursos y especialización' },
];

export const credentials: Credential[] = [
  // ── Formación ──────────────────────────────────────────────────────────────
  {
    title: 'Ingeniería de Sistemas y Computación',
    institution: 'Universidad Central · Bogotá',
    year: '2026',
    kind: 'titulo',
  },
  {
    title: 'Tecnología en Desarrollo de Software y Aplicativos Móviles',
    institution: 'Politécnico Internacional · Bogotá',
    year: '2022–2024',
    kind: 'titulo',
  },
  {
    // Samuel: es una CARRERA de Computer Science (híbrida), no solo seminarios sueltos
    title: 'Computer Science',
    institution: 'McGill School of Computer Science · híbrido',
    year: '2023–2026',
    kind: 'titulo',
  },
  // ── Certificaciones ────────────────────────────────────────────────────────
  {
    title: 'IA aplicada y agentes con Claude',
    institution: 'Anthropic',
    year: '2024–2026',
    kind: 'certificado',
  },
  {
    title: 'ChatGPT y desarrollo con la API',
    institution: 'OpenAI',
    year: '2024–2026',
    kind: 'certificado',
  },
  {
    title: 'GitHub Copilot',
    institution: 'GitHub',
    year: '2024–2026',
    kind: 'certificado',
  },
  // ── Cursos y especialización ───────────────────────────────────────────────
  {
    // Samuel: además de la carrera, los seminarios de la misma escuela (McGill)
    title: 'Seminarios de Computer Science',
    institution: 'McGill School of Computer Science',
    year: '2023–2026',
    kind: 'curso',
  },
  {
    title: 'Agentes de IA: implementación y automatización',
    institution: 'Coderhouse',
    year: '2024–2026',
    kind: 'curso',
  },
  {
    title: 'Data Analytics en GCP: regresión logística + Looker Studio',
    institution: 'Universidad Central · proyecto académico',
    year: '2025',
    kind: 'curso',
  },
];
