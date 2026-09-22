import { celdasWordmark, WORDMARK_COLS, WORDMARK_PALABRA } from '@/lib/division-glyph';

interface BitmapWordmarkProps {
  /** Desplaza la banda diagonal de acento (distinto por división, para que Creative y
   * Web no pinten exactamente las mismas celdas). */
  desplazamiento?: number;
  /** false cuando la página ya tiene su propio <h1> (p. ej. "Pixies Creative"): el
   * texto accesible del wordmark pasa a ser un span, no un segundo h1. */
  comoTitulo?: boolean;
  className?: string;
}

// Wordmark PIXIES del mockup 15-final-ajustado.html, renderizado en el servidor (el mockup lo
// pintaba con JS; aquí sale en el HTML y el JS no es requisito). 35×7 celdas; las de la
// banda diagonal usan --acento, así el mismo wordmark se ve neutro en Grupo, violeta en Web
// y ámbar en Creative, y se recolorea con transición al cambiar de ruta. La entrada (cada
// celda aparece con desfase por columna, izquierda→derecha) es CSS: ver .wm-px en globals.css.
// El <h1> real queda en texto para lectores de pantalla y para el sitio sin CSS.
export default function BitmapWordmark({ desplazamiento = 0, comoTitulo = true, className }: BitmapWordmarkProps) {
  const celdas = celdasWordmark(desplazamiento);
  return (
    <div className={`wm ${className ?? ''}`} data-wordmark-bitmap>
      {comoTitulo ? <h1 className="sr-only">{WORDMARK_PALABRA}</h1> : <span className="sr-only">{WORDMARK_PALABRA}</span>}
      <div className="wm-grid" aria-hidden="true" style={{ '--cols': WORDMARK_COLS } as React.CSSProperties}>
        {celdas.map((c, i) => (
          <i
            key={i}
            className={c === 'off' ? 'wm-px wm-px--0' : c === 'acento' ? 'wm-px wm-px--a' : 'wm-px'}
            style={{ '--c': i % WORDMARK_COLS } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
