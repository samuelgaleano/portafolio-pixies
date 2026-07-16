'use client';

import { useRef } from 'react';
import { skillDomains, depthLabel, type Depth } from '@/data/skills';

// Deslizador horizontal de Capacidades por dominio (Samuel r5 2026-07-18): mismo contenido,
// pero ahora se desliza hacia el lado (scroll-snap) con flechas y transiciones. Cada dominio
// es una diapositiva; el hover eleva la tarjeta y las flechas mueven de a ~una pantalla.
const depthClass: Record<Depth, string> = {
  produccion: 'text-ok',
  solido: 'text-data',
  explorando: 'text-dim',
};

export default function SkillsSlider() {
  const ref = useRef<HTMLDivElement>(null);

  const nudge = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className="skills-wrap mt-6">
      <div ref={ref} className="skills-slider">
        {skillDomains.map((d) => (
          <article key={d.id} className="skills-slide">
            <h3 className="font-display text-lg font-semibold text-ink">{d.title}</h3>
            <p className="mt-1 text-sm text-dim">{d.blurb}</p>
            <ul className="mt-4 flex flex-col gap-2 font-mono text-xs">
              {d.items
                .filter((it) => !it.name.startsWith('['))
                .map((it) => (
                  <li key={it.name} className="flex items-baseline justify-between gap-3 border-t border-line/60 pt-2">
                    <span className="text-ink">{it.name}</span>
                    <span className={`shrink-0 ${depthClass[it.depth]}`}>{depthLabel[it.depth]}</span>
                  </li>
                ))}
            </ul>
          </article>
        ))}
      </div>

      {/* flechas translúcidas a los lados (desktop); en móvil se desliza con el dedo */}
      <button type="button" onClick={() => nudge(-1)} aria-label="Capacidad anterior" className="skills-arrow skills-arrow--left">
        ←
      </button>
      <button type="button" onClick={() => nudge(1)} aria-label="Siguiente capacidad" className="skills-arrow skills-arrow--right">
        →
      </button>
    </div>
  );
}
