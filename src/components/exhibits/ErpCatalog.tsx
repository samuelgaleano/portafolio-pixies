import type { TourStep } from './StepTour';
import Collapsible from '@/components/ui/Collapsible';
import { t } from '@/i18n';

// Catálogo del ERP (Samuel r23): reemplaza la lista larga y monótona de 5 pasos idénticos
// (mismo bloque blanco, mismo tipo de letra, uno tras otro) por una grilla tipo catálogo —
// cada módulo es su propia tarjeta CON su captura real (no texto solo), la primera destacada
// (más grande, es el "wow" del tablero) y las demás parejas. Reutiliza .proj-card/.proj-sheen/
// .proj-demo-hint: mismo lenguaje visual que las tarjetas de proyecto, así se siente parte
// del mismo sitio y no un componente aparte. Cada tarjeta ya es un link directo al demo — ver
// algo que interesa y poder tocarlo YA, sin tener que llegar al final de una lista.
export default function ErpCatalog({
  steps,
  modules,
  demoUrl,
  demoAria,
  footer,
}: {
  steps: TourStep[];
  modules: string[];
  demoUrl?: string;
  demoAria?: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => {
          const featured = i === 0;
          return (
            <article
              key={s.id}
              className={`proj-card group relative flex flex-col overflow-hidden rounded-(--radius-m) border border-line bg-surface ${
                featured ? 'sm:col-span-2' : ''
              }`}
            >
              <div className={`relative overflow-hidden border-b border-line bg-surface-2 ${featured ? 'aspect-[16/8]' : 'aspect-[16/10]'}`}>
                {s.screenshot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.screenshot}
                    alt={s.alt}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-105"
                  />
                ) : (
                  <div className="pixel-mask absolute inset-0" aria-hidden="true" />
                )}
                <span className="proj-sheen" aria-hidden="true" />
                <span className="absolute left-3 top-3 z-[2] rounded-(--radius-s) border border-line/70 bg-void/80 px-2 py-1 font-mono text-xs text-data backdrop-blur-sm [font-variant-numeric:tabular-nums]">
                  {String(i + 1).padStart(2, '0')} / {steps.length}
                </span>
                {demoUrl && (
                  <span className="proj-demo-hint" aria-hidden="true">
                    <span className="proj-demo-hint__btn">▶ {t.exhibit.chipDemo}</span>
                  </span>
                )}
              </div>

              <div className="relative flex flex-1 flex-col gap-2 p-4 md:p-5">
                <h4 className={`font-display font-semibold text-ink ${featured ? 'text-xl' : 'text-lg'}`}>{s.title}</h4>
                <p className="text-sm leading-relaxed text-dim">{s.business}</p>

                {!s.tech.startsWith('[') && (
                  <Collapsible label={t.exhibit.techShow} labelOpen={t.exhibit.techHide}>
                    <p className="flex gap-2 pt-3 font-mono text-xs text-data">
                      <span aria-hidden="true">▸</span>
                      <span>{s.tech}</span>
                    </p>
                  </Collapsible>
                )}
              </div>

              {demoUrl && (
                <a href={demoUrl} aria-label={`${demoAria ?? t.exhibit.chipDemo} — ${s.title}`} className="absolute inset-0 z-0" />
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {modules.map((m) => (
          <span key={m} className="rounded-(--radius-s) border border-line px-2 py-1 font-mono text-xs text-dim">
            {m}
          </span>
        ))}
      </div>

      {footer && <div className="mt-5 flex flex-wrap items-center gap-3">{footer}</div>}
    </div>
  );
}
