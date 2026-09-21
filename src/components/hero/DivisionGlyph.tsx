import { LETRAS, ICONOS, celdasEncendidas, type DivisionLetra } from '@/lib/division-glyph';

interface DivisionGlyphProps {
  letra: DivisionLetra;
  variant: 'marketing' | 'web';
  className?: string;
}

function Celdas({ bitmap }: { bitmap: string[] }) {
  const encendidas = new Set(celdasEncendidas(bitmap));
  return (
    <>
      {Array.from({ length: 35 }, (_, i) => (
        <i key={i} className={encendidas.has(i) ? 'on' : undefined} style={{ '--gi': i % 5 } as React.CSSProperties} />
      ))}
    </>
  );
}

// El glifo de división: bitmap 5×7 de la inicial (M/W) que se reorganiza en su ícono
// propio (corazón / cursor) al hover/foco del panel padre `.grupo-cap` — mismo lenguaje
// de píxeles del wordmark del hero, aplicado a las dos letras. CSS puro (sin estado ni
// JS): las dos capas (letra e ícono) se renderizan siempre; `.grupo-cap:hover`/
// `:focus-within` en globals.css decide cuál se ve.
export default function DivisionGlyph({ letra, variant, className }: DivisionGlyphProps) {
  return (
    <span className={`division-glyph division-glyph--${variant} ${className ?? ''}`} aria-hidden="true">
      <span className="division-glyph__capa division-glyph__capa--letra">
        <Celdas bitmap={LETRAS[letra]} />
      </span>
      <span className="division-glyph__capa division-glyph__capa--icono">
        <Celdas bitmap={ICONOS[letra]} />
      </span>
    </span>
  );
}
