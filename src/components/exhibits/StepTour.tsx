'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Pending from '@/components/ui/Pending';
import Collapsible from '@/components/ui/Collapsible';
import { t } from '@/i18n';

gsap.registerPlugin(useGSAP);

// Recorrido guiado genérico (§12): panel sticky con la lámina del paso activo +
// lista de pasos numerados, clicables y con scroll-spy. Lo usan el ERP y el proyecto
// de analítica — misma interacción, distinto contenido. El panel es un <a> (se siente
// tarjeta-botón, clase .proj-card) y la lámina hace crossfade GSAP al cambiar de paso.
// Todo el contenido de los pasos se renderiza en el servidor (legible sin JS).
export interface TourStep {
  id: string;
  title: string;
  business: string;
  tech: string;
  screenshot: string;
  alt: string;
}

export default function StepTour({
  steps,
  modules,
  panelHref,
  panelChip,
  panelAria,
  footer,
}: {
  steps: TourStep[];
  modules: string[];
  panelHref?: string; // sin href, el panel es un marco plano (no promete un clic que no va a ningún lado)
  panelChip?: string; // etiqueta del chip sobre la lámina (p. ej. "▶ probar la demo →")
  panelAria?: string;
  footer?: React.ReactNode; // CTAs bajo los módulos (demo, informe, repo…)
}) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const shotRef = useRef<HTMLDivElement>(null);
  // Tras un clic, el scrollIntoView dispara el observer y pisaba la selección manual
  // (en móvil el tour quedaba clavado en el paso 1). La selección manual gana durante
  // una ventana corta: el spy ignora sus updates hasta que pase el scroll del clic.
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
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Crossfade GSAP al cambiar de paso (clic o scroll): la lámina no salta, se funde.
  // Con reduced-motion no se anima (GSAP ignora el bloqueo CSS global, hay que guardarlo).
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

  const panelInner = (
    <div ref={shotRef} className="relative aspect-[16/10] overflow-hidden rounded-(--radius-m) border border-line bg-surface-2">
      {step.screenshot ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={step.screenshot}
          alt={step.alt}
          width={1500}
          height={938}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-105"
        />
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
      {panelHref && (
        <>
          {/* reflejo al hover (mismo lenguaje que las tarjetas de proyecto) */}
          <span className="proj-sheen" aria-hidden="true" />
          <span className="absolute right-3 top-3 z-[3] rounded-(--radius-s) border border-pixel/50 bg-void/70 px-2.5 py-1 font-mono text-xs font-medium text-pixel-soft backdrop-blur-sm transition-all group-hover:border-pixel group-hover:bg-pixel group-hover:text-void">
            {panelChip}
          </span>
        </>
      )}
      <span className="absolute bottom-3 left-3 z-[3] max-w-[85%] truncate rounded-(--radius-s) border border-line/70 bg-void/75 px-2.5 py-1 font-mono text-xs text-data backdrop-blur-sm [font-variant-numeric:tabular-nums]">
        {String(active + 1).padStart(2, '0')} / {steps.length} · {step.title}
      </span>
    </div>
  );

  return (
    <div className="mt-6 grid gap-8 md:grid-cols-[1.1fr_1fr]">
      {/* Panel sticky con la lámina activa — clicable como un proyecto cuando hay destino */}
      <div ref={panelRef} className="self-start scroll-mt-24 md:sticky md:top-32">
        {panelHref ? (
          <a href={panelHref} aria-label={panelAria} draggable={false} className="proj-card group block overflow-hidden rounded-(--radius-m)">
            {panelInner}
          </a>
        ) : (
          panelInner
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {modules.map((m) => (
            <span key={m} className="rounded-(--radius-s) border border-line px-2 py-1 font-mono text-xs text-dim">
              {m}
            </span>
          ))}
        </div>

        {footer && <div className="mt-4 flex flex-wrap items-center gap-3">{footer}</div>}
      </div>

      {/* Pasos: numerados, clicables y resaltados al entrar al viewport. Al pulsar uno,
          el panel muestra la lámina de esa sección (y se acerca si no está visible). */}
      <ol className="flex flex-col gap-4">
        {steps.map((s, i) => (
          <li
            key={s.id}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-i={i}
          >
            {/* tarjeta del paso: el botón principal SELECCIONA el paso; el detalle técnico
                vive en un desplegable aparte (no satura la primera vista, y evita anidar
                botones — inválido en HTML) */}
            <div
              className={`rounded-(--radius-m) border p-5 transition-all duration-300 ${
                active === i
                  ? 'border-pixel/60 bg-surface'
                  : 'border-line bg-surface/40 hover:-translate-y-1 hover:border-pixel/60 hover:bg-surface/70 hover:shadow-[0_14px_34px_-20px_var(--color-pixel)]'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  manualUntil.current = Date.now() + 1000; // el spy no pisa esta selección
                  setActive(i);
                  panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }}
                aria-current={active === i ? 'step' : undefined}
                className="block w-full cursor-pointer text-left"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-data [font-variant-numeric:tabular-nums]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="font-display text-lg font-semibold text-ink">{s.title}</h4>
                </div>
                <p className="mt-2 text-sm text-dim">{s.business}</p>
              </button>
              <div className="mt-3">
                {s.tech.startsWith('[') ? (
                  <Pending>{t.exhibit.pendingTech}</Pending>
                ) : (
                  <Collapsible label={t.exhibit.techShow} labelOpen={t.exhibit.techHide}>
                    <p className="flex gap-2 pt-3 font-mono text-xs text-data">
                      <span aria-hidden="true">▸</span>
                      <span>{s.tech}</span>
                    </p>
                  </Collapsible>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
