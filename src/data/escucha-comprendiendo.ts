import type { EscuchaStructured, TranscriptSegment } from '@/lib/escucha';

// Producto propio "escuchacomprendiendo.IA" (§ plan "productos propios"): convierte audio en
// contexto estructurado y citado. La app real corre en escritorio (Electron, con Claude); acá
// se muestra un ejemplo real ya procesado y se ofrece una versión liviana en el navegador.
export interface EscuchaExample {
  ready: boolean; // Samuel: pasar a true cuando audioSrc/transcript/structured sean reales
  audioSrc: string;
  transcript: { text: string; segments: TranscriptSegment[] };
  structured: EscuchaStructured;
}

export interface EscuchaProduct {
  tagline: string;
  descripcion: string;
  example: EscuchaExample;
}

export const escuchaProduct: EscuchaProduct = {
  // 2026-09-23 (Samuel): la frase ya no puede quedarse en "transcribe y resume" — eso lo hace
  // Whisper y media docena de apps más. Lo que distingue a esta es lo que pasa DESPUÉS: la
  // estructuración, el grafo y el contexto acumulado por proyecto.
  tagline: 'Tus notas de voz y reuniones, convertidas en un segundo cerebro: no solo transcritas — estructuradas y conectadas entre sí.',
  // No promete "un ejemplo real" acá: eso lo anuncia la pestaña sola cuando example.ready sea true.
  descripcion:
    'Producto propio. Transcribe como Whisper, pero no se detiene ahí: un motor propio de IA arma el grafo de conceptos, decisiones, tareas y riesgos de cada audio, lo enlaza con lo que ya sabías y marca qué tan sostenida está cada afirmación. Entra y pruébalo con tu propio audio, o descárgalo para tu computador.',
  example: {
    ready: false,
    audioSrc: '',
    transcript: { text: '', segments: [] },
    structured: { resumen: '', areas: [] },
  },
};
