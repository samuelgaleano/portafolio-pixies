import { t } from '@/i18n';
import { credentials, kindGroups } from '@/data/certifications';
import Pending from '@/components/ui/Pending';
import StaggerIn from '@/components/fx/StaggerIn';
import SectionHead from './SectionHead';

// Mapa de conocimiento: nodos agrupados por tipo (§7.3). Rediseño compacto (Samuel 2026-07-18):
// cada credencial es una fila densa (título + institución + año), no una tarjeta grande —
// más comprensible de un vistazo. Solo credenciales con título real; grupos vacíos → estado
// diseñado. Los grupos entran en cascada con GSAP (StaggerIn).
export default function KnowledgeMap() {
  const groups = kindGroups.map((g) => ({
    ...g,
    items: credentials.filter((c) => c.kind === g.kind && !c.title.startsWith('[')),
  }));

  return (
    <section className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6">
        <SectionHead
          index="02 · formación"
          title={t.samuel.knowledgeTitle}
          intro={t.samuel.knowledgeIntro}
          glyph="spark"
        />

        <StaggerIn className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.kind} data-stagger className="depth-card relative overflow-hidden p-5">
              {/* barra de acento superior: da el aire de "nodo del mapa" (más disruptivo) */}
              <span
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pixel to-transparent"
                aria-hidden="true"
              />
              <p className="mb-3 flex items-center gap-2 font-mono text-xs font-medium text-pixel-soft">
                <span className="km-glyph" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                {g.label}
              </p>
              {g.items.length === 0 && (
                <div className="rounded-(--radius-m) border border-dashed border-line p-4">
                  <Pending>{t.common.credsPending}</Pending>
                </div>
              )}
              <ul className="flex flex-col divide-y divide-line/60">
                {g.items.map((c) => (
                  <li key={c.title} className="py-2.5 first:pt-0 last:pb-0">
                    <p className="text-sm font-medium leading-snug text-ink">{c.title}</p>
                    <p className="mt-0.5 flex items-baseline justify-between gap-3 text-xs text-dim">
                      <span className="min-w-0 truncate">{c.institution}</span>
                      <span className="shrink-0 font-mono [font-variant-numeric:tabular-nums]">
                        {c.year.startsWith('[') ? '· · ·' : c.year}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </StaggerIn>
      </div>
    </section>
  );
}
