import { LETRAS, ICONOS, GLYPH_COLS, rolesDeCeldas, type DivisionLetra } from '@/lib/division-glyph';

interface DivisionGlyphProps {
  letra: DivisionLetra;
  variant: 'marketing' | 'web';
  /** true = queda FIJO en ícono (división activa); false = letra en reposo, ícono al
   * hover/foco/teaser del anfitrión `[data-glyph-host]`. */
  fijo?: boolean;
  className?: string;
}

// El glifo de división (mockup 15-final-ajustado.html): bitmap 7×9 de la inicial (C/W)
// que se REORGANIZA en su ícono propio (corazón / cursor). Morph progresivo, no cambio de
// frame (Samuel, 2026-09-21): las 63 celdas se pintan una sola vez con su ROL — las que
// quedan, las que se apagan (c-out), las que se encienden (c-in) — y el CSS anima cada
// celda por separado con desfase diagonal (--gi = fila + columna) y un pequeño overshoot
// en la escala. Sin estado ni JS: lo dispara :hover/:focus-within/.is-teasing del
// anfitrión, o `fijo` cuando esa división es la activa.
export default function DivisionGlyph({ letra, variant, fijo = false, className }: DivisionGlyphProps) {
  const roles = rolesDeCeldas(LETRAS[letra], ICONOS[letra]);
  return (
    <span className={`division-glyph division-glyph--${variant} ${fijo ? 'is-fijo' : ''} ${className ?? ''}`} aria-hidden="true">
      {roles.map((rol, i) => (
        <i key={i} className={rol === 'off' ? undefined : `c-${rol}`} style={{ '--gi': Math.floor(i / GLYPH_COLS) + (i % GLYPH_COLS) } as React.CSSProperties} />
      ))}
    </span>
  );
}
