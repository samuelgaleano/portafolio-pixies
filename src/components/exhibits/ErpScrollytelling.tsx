'use client';

import { useEffect, useRef, useState } from 'react';
import { erpTour } from '@/data/erp-tour';
import { t } from '@/i18n';

// Recorrido guiado del ERP (§12.A). El JS añade el panel sticky que sigue al scroll;
// todo el contenido de los pasos se renderiza en el servidor (legible sin JS).
export default function ErpScrollytelling() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(Number((vis.target as HTMLElement).dataset.i));
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const step = erpTour.steps[active] ?? erpTour.steps[0];
  const hasRepo = Boolean(erpTour.repoUrl);

  return (
    <div className="mt-6 grid gap-8 md:grid-cols-[1.1fr_1fr]">
      {/* Panel sticky con la pantalla activa */}
      <div className="self-start md:sticky md:top-32">
        <div className="relative aspect-[16/10] overflow-hidden rounded-(--radius-m) border border-line bg-surface-2">
          {step.screenshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={step.screenshot} alt={step.alt} className="h-full w-full object-cover object-top" />
          ) : (
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                backgroundImage:
                  'conic-gradient(color-mix(in srgb, var(--color-pixel) 16%, transparent) 25%, transparent 0 50%, color-mix(in srgb, var(--color-pixel) 16%, transparent) 0 75%, transparent 0), linear-gradient(135deg, var(--color-surface-2), var(--color-surface))',
                backgroundSize: '22px 22px, 100% 100%',
              }}
            />
          )}
          <span className="absolute bottom-3 left-3 font-mono text-xs text-data">
            {String(active + 1).padStart(2, '0')} / {erpTour.steps.length} · {step.title}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {erpTour.modules.map((m) => (
            <span key={m} className="rounded-(--radius-s) border border-line px-2 py-1 font-mono text-xs text-dim">
              {m}
            </span>
          ))}
        </div>

        {hasRepo ? (
          <a
            href={erpTour.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-(--radius-s) border border-line px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
          >
            {t.exhibit.viewCode}
          </a>
        ) : (
          <p className="mt-4 font-mono text-xs text-dim">{t.exhibit.erpRepoMissing}</p>
        )}
      </div>

      {/* Pasos: cada uno resalta al entrar al viewport */}
      <ol className="flex flex-col gap-4">
        {erpTour.steps.map((s, i) => (
          <li
            key={s.id}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-i={i}
            className={`rounded-(--radius-m) border p-5 transition-colors ${
              active === i ? 'border-pixel/60 bg-surface' : 'border-line bg-surface/40'
            }`}
          >
            <h4 className="font-display text-lg font-semibold text-ink">{s.title}</h4>
            <p className="mt-2 text-sm text-dim">{s.business}</p>
            <p className="mt-3 flex gap-2 font-mono text-xs text-data">
              <span aria-hidden="true">▸</span>
              <span>{s.tech}</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
