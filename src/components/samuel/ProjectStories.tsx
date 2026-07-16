import Link from 'next/link';
import { t } from '@/i18n';
import { stories } from '@/data/stories';
import SectionHead from './SectionHead';

// "Casos de ingeniería" (Samuel r5 2026-07-18): acceso a la bitácora tipo feed. La tarjeta se
// presenta como una "entrada de perfil" (avatar SG + handle + conteo) que redirige al feed en
// /samuel/casos. Menos monótono en /samuel; el detalle innovador vive en la subpágina.
export default function ProjectStories() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6">
        <SectionHead index="04 · casos" title={t.samuel.storiesTitle} intro={t.samuel.storiesIntro} glyph="spark" />

        <Link
          href="/samuel/casos"
          className="group mt-8 flex flex-col gap-5 rounded-(--radius-m) border border-line bg-surface/60 p-6 transition-all hover:-translate-y-1 hover:border-pixel/60 hover:shadow-[0_22px_50px_-30px_var(--color-pixel)] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="foro-avatar" aria-hidden="true">
              SG
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-ink">
                Samuel Galeano <span className="font-mono text-xs font-normal text-dim">@samuelgaleano</span>
              </p>
              <p className="font-mono text-xs text-pixel-soft">{stories.length} casos · bitácora abierta</p>
            </div>
          </div>

          <ul className="hidden flex-wrap gap-2 md:flex">
            {stories.map((s) => (
              <li
                key={s.projectName}
                className="inline-flex items-center gap-1.5 rounded-(--radius-s) border border-line px-2.5 py-1 font-mono text-xs text-dim"
              >
                <span className="inline-block size-1.5 bg-pixel" aria-hidden="true" />
                {s.projectName}
              </li>
            ))}
          </ul>

          <span className="inline-flex shrink-0 items-center gap-1 font-mono text-sm font-medium text-pixel-soft transition-transform group-hover:translate-x-0.5">
            {t.samuel.storiesCta}
          </span>
        </Link>
      </div>
    </section>
  );
}
