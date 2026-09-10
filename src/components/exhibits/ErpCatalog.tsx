'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { TourStep } from './StepTour';
import Collapsible from '@/components/ui/Collapsible';
import { t } from '@/i18n';

gsap.registerPlugin(useGSAP);

// Catálogo del ERP (Samuel r24): la grilla de 5 tarjetas sueltas (r23) se veía completa
// de un vistazo y no invitaba a seguir mirando. Ahora es destacado + laterales: un panel
// grande y sticky (mismo lenguaje que las tarjetas de proyecto — captura real, sheen,
// hint de demo) que muestra el módulo activo, y a su lado los demás módulos como
// recuadros con su propia miniatura real (no texto plano). Elegir uno —con clic o
// bajando la página, el mismo scroll-spy del recorrido de datos— cambia el destacado:
// de "Tablero y KPIs" a "Almacén e inventario", etc. Sin perder el catálogo real.
export default function ErpCatalog({
  steps,
  modules,
  demoUrl,
  demoAria,
}: {
  steps: TourStep[];
  modules: string[];
  demoUrl?: string;
  demoAria?: string;
}) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const shotRef = useRef<HTMLDivElement>(null);
  // mismo truco que StepTour: tras un clic, el scroll hacia el item no debe hacer que el
  // observer pise la selección manual con el paso que estaba en viewport antes del salto.
  const manualUntil = useRef(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() < manualUntil.current) return;
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(Number((vis.target as HTMLElement).dataset.i));
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Crossfade al cambiar el destacado (clic o scroll-spy): la captura no salta, se funde.
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        shotRef.current,
        { opacity: 0.3, scale: 1.012 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' }
      );
    },
    { dependencies: [active] }
  );

  const step = steps[active] ?? steps[0];

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-[1.15fr_1fr]">
      {/* destacado: sticky, cambia según el módulo elegido en el lateral */}
      <div className="self-start md:sticky md:top-32">
        <article className="proj-card group relative flex flex-col overflow-hidden rounded-(--radius-m) border border-line bg-surface">
          <div ref={shotRef} className="relative aspect-[16/9] overflow-hidden border-b border-line bg-surface-2">
            {step.screenshot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={step.screenshot}
                alt={step.alt}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-105"
              />
            ) : (
              <div className="pixel-mask absolute inset-0" aria-hidden="true" />
            )}
            <span className="proj-sheen" aria-hidden="true" />
            <span className="absolute left-3 top-3 z-[2] rounded-(--radius-s) border border-line/70 bg-void/80 px-2 py-1 font-mono text-xs text-data backdrop-blur-sm [font-variant-numeric:tabular-nums]">
              {String(active + 1).padStart(2, '0')} / {steps.length}
            </span>
            {demoUrl && (
              <span className="proj-demo-hint" aria-hidden="true">
                <span className="proj-demo-hint__btn">▶ {t.exhibit.chipDemo}</span>
              </span>
            )}
          </div>

          <div className="relative flex flex-1 flex-col gap-2 p-4 md:p-5">
            <h4 className="font-display text-xl font-semibold text-ink">{step.title}</h4>
            <p className="text-sm leading-relaxed text-dim">{step.business}</p>

            {!step.tech.startsWith('[') && (
              <Collapsible label={t.exhibit.techShow} labelOpen={t.exhibit.techHide}>
                <p className="flex gap-2 pt-3 font-mono text-xs text-data">
                  <span aria-hidden="true">▸</span>
                  <span>{step.tech}</span>
                </p>
              </Collapsible>
            )}
          </div>

          {demoUrl && (
            <a href={demoUrl} aria-label={`${demoAria ?? t.exhibit.chipDemo} — ${step.title}`} className="absolute inset-0 z-0" />
          )}
        </article>

        <div className="mt-4 flex flex-wrap gap-2">
          {modules.map((m) => (
            <span key={m} className="rounded-(--radius-s) border border-line px-2 py-1 font-mono text-xs text-dim">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* lateral: un recuadro por módulo, con su propia miniatura — clic o scroll cambian el destacado */}
      <ol className="flex flex-col gap-3">
        {steps.map((s, i) => (
          <li
            key={s.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            data-i={i}
          >
            <button
              type="button"
              onClick={() => {
                manualUntil.current = Date.now() + 1000;
                setActive(i);
              }}
              aria-current={active === i ? 'step' : undefined}
              className={`group flex w-full items-center gap-3 rounded-(--radius-m) border p-3 text-left transition-all duration-300 ${
                active === i
                  ? 'border-pixel/60 bg-surface shadow-[0_14px_34px_-22px_var(--color-pixel)]'
                  : 'border-line bg-surface/40 hover:-translate-y-0.5 hover:border-pixel/40 hover:bg-surface/70'
              }`}
            >
              <span className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-(--radius-s) border border-line bg-surface-2">
                {s.screenshot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.screenshot} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                ) : (
                  <span className="pixel-mask absolute inset-0" aria-hidden="true" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-data [font-variant-numeric:tabular-nums]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-base font-semibold text-ink">{s.title}</span>
                </span>
                <span className="mt-1 line-clamp-2 block text-xs leading-snug text-dim">{s.business}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
