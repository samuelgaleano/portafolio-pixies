// Logo de escuchacomprendiendo.IA (Samuel, 2026-09-23: "un logo mucho más lindo, más
// comprensible, más lógico en cuanto a lo que hace la aplicación; morado, pero otros colores
// también disruptivos").
//
// Qué dice el dibujo, de izquierda a derecha: una ONDA de audio (ámbar) entra, y de ella
// salen NODOS CONECTADOS (violeta, cian, ámbar) — el grafo de contexto. Eso es exactamente
// lo que hace la app: no se queda en transcribir, convierte lo que dijiste en piezas
// relacionadas entre sí. Un solo vistazo tiene que bastar para entenderlo.
//
// Los hexadecimales van explícitos y no por token: los tokens están calibrados para
// CONTRASTE DE TEXTO sobre fondo claro, y aquí es una ilustración sobre una placa oscura.
// Son las mismas familias de la marca, subidas de luminosidad para que se lean sobre tinta.
const VIOLETA = '#7c5cff';
const AMBAR = '#f5b400';
const CIAN = '#35c9e8';

export default function AppLogoEscucha({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} role="img" aria-label="De audio a grafo de contexto">
      <defs>
        <linearGradient id="escucha-placa" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2c2059" />
          <stop offset="100%" stopColor="#171029" />
        </linearGradient>
        <radialGradient id="escucha-brillo" cx="0.72" cy="0.3" r="0.6">
          <stop offset="0%" stopColor={VIOLETA} stopOpacity="0.45" />
          <stop offset="100%" stopColor={VIOLETA} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="96" height="96" rx="22" fill="url(#escucha-placa)" />
      <rect width="96" height="96" rx="22" fill="url(#escucha-brillo)" />

      {/* la onda: lo que entra */}
      <g fill={AMBAR}>
        <rect x="14" y="54" width="6" height="22" rx="3" />
        <rect x="24" y="44" width="6" height="42" rx="3" />
        <rect x="34" y="58" width="6" height="14" rx="3" />
      </g>

      {/* los vínculos: lo que la app añade */}
      <g stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round">
        <path d="M43 65 L60 48" />
        <path d="M60 48 L77 32" />
        <path d="M60 48 L74 64" />
      </g>

      {/* los nodos: el contexto ya estructurado */}
      <circle cx="60" cy="48" r="8" fill={VIOLETA} />
      <circle cx="77" cy="32" r="5.5" fill={CIAN} />
      <circle cx="74" cy="64" r="5.5" fill={AMBAR} />
    </svg>
  );
}
