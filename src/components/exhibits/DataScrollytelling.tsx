import { dataCase } from '@/data/data-tour';
import { t } from '@/i18n';

// Sección de analítica en la home (rediseño Samuel 2026-07-18): NARRATIVA primero — con qué
// fin, cómo, y qué concluí — EMPAQUETADA como un proyecto (habrá más de analítica, como los
// demás productos del portafolio). Las visualizaciones (gráficas, código, informe) se abren
// con botones ENFOCADOS que llevan a la parte específica del informe. Server component.
export default function DataScrollytelling() {
  const c = dataCase;
  return (
    <div className="mt-6">
      {/* paquete del proyecto: marco propio con encabezado, para que lea como UNA unidad */}
      <article className="overflow-hidden rounded-(--radius-m) border border-line bg-surface/60">
        <header className="border-b border-line px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-xs text-pixel-soft">
              <span className="inline-block size-2 bg-pixel" aria-hidden="true" />
              {c.project}
            </span>
            <span className="font-mono text-xs text-dim">{c.eyebrow}</span>
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold text-ink">{c.title}</h3>
          <p className="mt-0.5 text-sm text-dim">{c.subtitle}</p>
        </header>

        <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[1.35fr_1fr]">
          {/* narrativa: lo importante, contado en tres preguntas */}
          <div className="flex flex-col gap-6">
            {c.blocks.map((b, i) => (
              <div key={i} className={i === c.blocks.length - 1 ? 'data-case__conclusion' : ''}>
                <p className="font-mono text-xs font-medium text-pixel-soft">{b.label}</p>
                <p className="mt-2 max-w-2xl leading-relaxed text-ink/90">{b.body}</p>
              </div>
            ))}
          </div>

          {/* cifras clave + accesos ENFOCADOS al detalle */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3">
              {c.stats.map((s, i) => (
                <div key={i} className="depth-card rounded-(--radius-m) p-4">
                  <p className="font-display text-2xl font-bold text-ink [font-variant-numeric:tabular-nums]">{s.v}</p>
                  <p className="mt-1 font-mono text-[0.7rem] leading-tight text-dim">{s.k}</p>
                </div>
              ))}
            </div>

            <div className="rounded-(--radius-m) border border-line bg-surface p-5">
              <p className="font-mono text-xs text-dim">{t.exhibit.dataDeeper}</p>
              <div className="mt-3 flex flex-col gap-2">
                <a
                  href={c.reportUrl}
                  className="press inline-flex items-center justify-between rounded-(--radius-s) bg-signal px-4 py-2.5 font-mono text-xs font-medium text-void transition hover:brightness-110"
                >
                  {t.exhibit.viewReport}
                </a>
                <a
                  href={`${c.reportUrl}#resultados`}
                  className="inline-flex items-center justify-between rounded-(--radius-s) border border-line px-4 py-2.5 font-mono text-xs text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
                >
                  {t.exhibit.viewResults}
                </a>
                <a
                  href={`${c.reportUrl}#codigo`}
                  className="inline-flex items-center justify-between rounded-(--radius-s) border border-line px-4 py-2.5 font-mono text-xs text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
                >
                  {t.exhibit.viewCodeR}
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
