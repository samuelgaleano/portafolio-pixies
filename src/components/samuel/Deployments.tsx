import { deployments } from '@/data/deployments';
import { t } from '@/i18n';
import StaggerIn from '@/components/fx/StaggerIn';
import SectionHead from './SectionHead';

// "En producción" (rediseño Samuel 2026-07-18 ronda 2): comunica el ángulo OPS/INFRA —
// CÓMO lleva y mantiene el software en producción (AWS, serverless, seguridad, presupuesto).
// Distinto de "Cómo y por qué" (que cuenta la DECISIÓN de cada proyecto). Formato de LISTA
// compacta con barra de acento — ocupa menos y se distingue visualmente de las tarjetas.
export default function Deployments() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6">
        <SectionHead
          index="03 · producción"
          title={t.samuel.deploymentsTitle}
          intro={t.samuel.deploymentsIntro}
          glyph="cursor"
        />

        <StaggerIn className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {deployments.map((d) => (
            <article
              key={d.title}
              data-stagger
              className="flex gap-3 rounded-(--radius-m) border border-line bg-surface/60 p-4 transition-colors hover:border-pixel/50"
            >
              <span className="w-0.5 shrink-0 self-stretch rounded bg-pixel" aria-hidden="true" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <h3 className="font-display text-base font-semibold text-ink">{d.title}</h3>
                  <span className="font-mono text-[0.62rem] text-pixel-soft">· {d.tag}</span>
                </div>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-dim">{d.detail}</p>
              </div>
            </article>
          ))}
        </StaggerIn>
      </div>
    </section>
  );
}
