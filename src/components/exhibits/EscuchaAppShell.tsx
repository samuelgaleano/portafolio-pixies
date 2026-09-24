'use client';

import { useState } from 'react';
import { t } from '@/i18n';
import type { EscuchaStructured, TranscriptSegment } from '@/lib/escucha';
import EscuchaResultView from './EscuchaResultView';
import EscuchaGrafo from './EscuchaGrafo';

// Carcasa tipo APLICACIÓN DE ESCRITORIO para el resultado de la demo (Samuel, 2026-09-23:
// "cuando la descarga y la abre en el ordenador, que se vea así igual"). No es decoración:
// es lo que hace entendible la lógica del producto — barra de ventana, panel lateral con el
// proyecto y sus notas, y un panel principal con vistas. Es la misma gramática de Obsidian,
// que es la referencia que Samuel usa para explicar la app.
//
// El contenido sigue siendo el resultado REAL del audio que subió el usuario; la carcasa no
// añade ni inventa nada, solo lo coloca donde estaría en la app instalada.
type Vista = 'contexto' | 'grafo' | 'transcripcion';

export default function EscuchaAppShell({
  structured,
  transcript,
  onCiteClick,
}: {
  structured: EscuchaStructured;
  transcript: { text: string; segments: TranscriptSegment[] } | null;
  onCiteClick?: (seconds: number) => void;
}) {
  const hayGrafo = Boolean(structured.nodos?.length && structured.vinculos?.length);
  const [vista, setVista] = useState<Vista>(hayGrafo ? 'grafo' : 'contexto');

  const vistas: { id: Vista; label: string; visible: boolean }[] = [
    { id: 'grafo', label: t.escucha.vistaGrafo, visible: hayGrafo },
    { id: 'contexto', label: t.escucha.vistaContexto, visible: true },
    { id: 'transcripcion', label: t.escucha.vistaTranscripcion, visible: Boolean(transcript?.text) },
  ];

  return (
    <div className="app-shell">
      <div className="app-shell__barra">
        <span className="app-shell__semaforo" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="app-shell__titulo">{t.escucha.shellTitulo}</span>
        <span className="app-shell__etiqueta">{t.escucha.shellDemo}</span>
      </div>

      <div className="app-shell__cuerpo">
        <aside className="app-shell__lateral" aria-label={t.escucha.shellLateral}>
          <p className="app-shell__grupo">{t.escucha.shellProyectos}</p>
          <p className="app-shell__proyecto">{t.escucha.shellProyectoActual}</p>

          <p className="app-shell__grupo">{t.escucha.shellNotas}</p>
          <ul className="app-shell__notas">
            {structured.areas.map((a, i) => (
              <li key={i}>{a.nombre}</li>
            ))}
          </ul>

          <p className="app-shell__nota-pie">{t.escucha.shellAcumula}</p>
        </aside>

        <div className="app-shell__principal">
          <div role="tablist" aria-label={t.escucha.shellVistas} className="app-shell__pestanas">
            {vistas
              .filter((v) => v.visible)
              .map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={vista === v.id}
                  onClick={() => setVista(v.id)}
                  className={`app-shell__pestana${vista === v.id ? ' is-activa' : ''}`}
                >
                  {v.label}
                </button>
              ))}
          </div>

          <div className="app-shell__panel">
            {vista === 'grafo' && hayGrafo && <EscuchaGrafo nodos={structured.nodos!} vinculos={structured.vinculos!} />}
            {vista === 'contexto' && <EscuchaResultView structured={structured} onCiteClick={onCiteClick} />}
            {vista === 'transcripcion' && transcript && (
              <div className="app-shell__transcripcion">
                {/* la transcripción va la ÚLTIMA a propósito: es lo que ya hace Whisper, no
                    es el valor de esta app. Aquí abajo, como materia prima citable. */}
                <p className="app-shell__aviso">{t.escucha.transcripcionAviso}</p>
                <p className="app-shell__texto">{transcript.text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
