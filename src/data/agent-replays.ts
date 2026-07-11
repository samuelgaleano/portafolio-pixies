// Exhibición de sistemas agénticos (§12.B: diagrama animado + replay de consola).
// TODO son datos quemados: cero llamadas a APIs, cero riesgo, siempre funciona.
// Samuel ajusta el pipeline/logs a su sistema real (los datos de ejemplo van marcados).

export interface PipelineStage {
  label: string;
  description: string;
}

export interface ReplayStep {
  stage: number; // índice en pipeline[] — sincroniza consola y diagrama
  kind: 'cmd' | 'info' | 'skill' | 'ok' | 'output';
  text: string;
}

export interface AgentReplay {
  name: string;
  tagline: string;
  repoUrl: string;
  pipeline: PipelineStage[];
  steps: ReplayStep[];
}

// Ejemplo: pipeline de contenido para marketing (un brief entra, sale un paquete de posts).
export const agentReplay: AgentReplay = {
  name: '[COMPLETAR: nombre del sistema de IA]',
  tagline: 'Un agente que convierte un brief en contenido listo para publicar, en minutos.',
  repoUrl: '', // [COMPLETAR: URL del repo, si aplica]
  pipeline: [
    { label: 'Brief', description: 'Entra la intención: tema, tono, canal.' },
    { label: 'Investiga', description: 'El agente reúne datos y ángulos relevantes.' },
    { label: 'Redacta', description: 'Genera el borrador siguiendo la guía de marca.' },
    { label: 'Adapta', description: 'Recorta a cada formato: post, reel, correo.' },
    { label: 'Entrega', description: 'Devuelve el paquete listo para revisar.' },
  ],
  steps: [
    { stage: 0, kind: 'cmd', text: '$ agente publicar --brief "lanzamiento producto X"' },
    { stage: 0, kind: 'info', text: 'brief recibido · canal: instagram + correo · tono: cercano' },
    { stage: 1, kind: 'skill', text: '→ skill:investigar  reuniendo ángulos y datos de soporte' },
    { stage: 1, kind: 'ok', text: '  ✓ 5 ángulos priorizados · 3 datos verificables [ejemplo]' },
    { stage: 2, kind: 'skill', text: '→ skill:redactar  borrador según guía de marca' },
    { stage: 2, kind: 'ok', text: '  ✓ borrador 280 palabras · voz de marca aplicada' },
    { stage: 3, kind: 'skill', text: '→ skill:adaptar  recortando a cada formato' },
    { stage: 3, kind: 'output', text: '  · post IG (120c) · guion reel (30s) · asunto correo (6 palabras)' },
    { stage: 4, kind: 'ok', text: '✓ paquete listo para revisión humana — 0 publicaciones automáticas' },
  ],
};
