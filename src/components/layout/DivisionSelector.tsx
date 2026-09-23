'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DIVISIONES, ORDEN_SELECTOR, divisionDeRuta } from '@/lib/division';

// Selector "ver como" del header (mockup 15-final-ajustado.html → producción). Tres
// destinos reales (Creative / Web / Grupo): el indicador se desliza al que está activo y
// toma el color de esa división (--acento, ver globals.css). El punto de color de cada
// opción comunica la división al instante sin depender del indicador. Sin JS de medida:
// las tres opciones miden igual y el indicador se posiciona con --i.
export default function DivisionSelector() {
  const activa = divisionDeRuta(usePathname());
  const i = ORDEN_SELECTOR.indexOf(activa);

  return (
    <div className="selector-div" role="navigation" aria-label="Ver como">
      <div className="seg" style={{ '--i': i } as React.CSSProperties}>
        <span className="seg__ind" aria-hidden="true" />
        {ORDEN_SELECTOR.map((d) => (
          <Link
            key={d}
            href={DIVISIONES[d].href}
            data-div={d}
            aria-current={d === activa ? 'page' : undefined}
            className="seg__opt"
          >
            {DIVISIONES[d].etiqueta}
          </Link>
        ))}
      </div>
    </div>
  );
}
