import type { EscuchaNodo, EscuchaVinculo } from '@/lib/escucha';

// Grafo de contexto: lo que la app hace DESPUÉS de transcribir (Samuel, 2026-09-23). Sin
// librería de grafos — un layout radial determinista en SVG: el nodo con más vínculos manda
// al centro y el resto se reparte en un anillo. Determinista a propósito: el mismo resultado
// siempre se dibuja igual, así que una captura de pantalla es reproducible.
const ANCHO = 460;
const ALTO = 270;
const RADIO = 128;

const COLOR: Record<EscuchaNodo['tipo'], string> = {
  concepto: '#7c5cff',
  decision: '#15803d',
  tarea: '#0d7490',
  riesgo: '#dc2626',
  persona: '#f5b400',
};

function recortar(s: string, max = 22) {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

export default function EscuchaGrafo({ nodos, vinculos }: { nodos: EscuchaNodo[]; vinculos: EscuchaVinculo[] }) {
  // grado de cada nodo = cuántos vínculos lo tocan; el más conectado va al centro
  const grado = new Map(nodos.map((n) => [n.id, 0]));
  for (const v of vinculos) {
    grado.set(v.de, (grado.get(v.de) ?? 0) + 1);
    grado.set(v.a, (grado.get(v.a) ?? 0) + 1);
  }
  const centro = [...nodos].sort((a, b) => (grado.get(b.id) ?? 0) - (grado.get(a.id) ?? 0))[0];
  const anillo = nodos.filter((n) => n.id !== centro?.id);

  // posición del nodo y, aparte, dónde va su etiqueta. Las etiquetas del anillo se empujan
  // HACIA AFUERA siguiendo su propio ángulo y se alinean según el lado en el que caen; si se
  // dejan todas centradas encima del nodo, la del centro y las de los lados se pisan (se vio
  // en la primera captura: "Recortar pauta" quedaba encima de "Menos leads").
  const pos = new Map<string, { x: number; y: number }>();
  const etiquetaPos = new Map<string, { x: number; y: number; anchor: 'start' | 'middle' | 'end' }>();

  if (centro) {
    pos.set(centro.id, { x: ANCHO / 2, y: ALTO / 2 });
    // la del centro va DEBAJO del nodo: arriba chocaría con el radio vertical
    etiquetaPos.set(centro.id, { x: ANCHO / 2, y: ALTO / 2 + 26, anchor: 'middle' });
  }
  anillo.forEach((n, i) => {
    const ang = (i / anillo.length) * Math.PI * 2 - Math.PI / 2;
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);
    pos.set(n.id, { x: ANCHO / 2 + cos * RADIO, y: ALTO / 2 + sin * RADIO * 0.8 });
    etiquetaPos.set(n.id, {
      x: ANCHO / 2 + cos * (RADIO + 14),
      y: ALTO / 2 + sin * RADIO * 0.8 + (Math.abs(cos) < 0.35 ? (sin < 0 ? -14 : 20) : 4),
      anchor: Math.abs(cos) < 0.35 ? 'middle' : cos > 0 ? 'start' : 'end',
    });
  });

  return (
    <figure className="escucha-grafo">
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="escucha-grafo__svg" role="img" aria-label="Grafo de contexto del audio">
        <g stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.4">
          {vinculos.map((v, i) => {
            const a = pos.get(v.de);
            const b = pos.get(v.a);
            if (!a || !b) return null;
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
          })}
        </g>
        {nodos.map((n) => {
          const p = pos.get(n.id);
          const e = etiquetaPos.get(n.id);
          if (!p || !e) return null;
          const esCentro = n.id === centro?.id;
          return (
            <g key={n.id}>
              <circle cx={p.x} cy={p.y} r={esCentro ? 9 : 6} fill={COLOR[n.tipo]} />
              <text x={e.x} y={e.y} textAnchor={e.anchor} className="escucha-grafo__etiqueta" fontSize={esCentro ? 13 : 11}>
                {recortar(n.etiqueta, esCentro ? 22 : 16)}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="escucha-grafo__pie">
        <ul className="escucha-grafo__leyenda">
          {(Object.keys(COLOR) as EscuchaNodo['tipo'][])
            .filter((tipo) => nodos.some((n) => n.tipo === tipo))
            .map((tipo) => (
              <li key={tipo}>
                <span style={{ background: COLOR[tipo] }} aria-hidden="true" />
                {tipo}
              </li>
            ))}
        </ul>
        <ul className="escucha-grafo__relaciones">
          {vinculos.slice(0, 6).map((v, i) => {
            const de = nodos.find((n) => n.id === v.de)?.etiqueta;
            const a = nodos.find((n) => n.id === v.a)?.etiqueta;
            if (!de || !a) return null;
            return (
              <li key={i}>
                <b>{de}</b>
                <span>{v.relacion || '→'}</span>
                <b>{a}</b>
              </li>
            );
          })}
        </ul>
      </figcaption>
    </figure>
  );
}
