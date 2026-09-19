import type { EscuchaStructured, TranscriptSegment } from '@/lib/escucha';

// Producto propio "escuchacomprendiendo.ai" (§ plan "productos propios"): convierte audio en
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
  tagline:
    'Grabas una nota de voz. Te devuelve las decisiones y tareas que dijiste, cada una con el segundo exacto en que la dijiste.',
  // No promete "un ejemplo real" acá: eso lo anuncia la pestaña sola cuando example.ready sea true.
  descripcion:
    'Convierte audio (notas de voz, reuniones) en contexto estructurado y citado — conceptos, decisiones, tareas, riesgos y lo que no se sabe — listo para cargar en un asistente de IA. La versión completa corre en tu computador; aquí puedes probar una versión ligera en el navegador, con tu propio audio o con uno de muestra.',
  example: {
    ready: false,
    audioSrc: '',
    transcript: { text: '', segments: [] },
    structured: { resumen: '', areas: [] },
  },
};
