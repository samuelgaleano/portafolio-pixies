import type { Metadata } from 'next';
import Link from 'next/link';
import { t } from '@/i18n';
import { stories } from '@/data/stories';
import { categories } from '@/data/categories';
import StaggerIn from '@/components/fx/StaggerIn';
import Spotlight from '@/components/fx/Spotlight';

// Casos de ingeniería (Samuel r5 2026-07-18): bitácora tipo FEED de red social — cada caso es
// un "post" con avatar, autor, handle y meta; el contenido es rol + decisión, y una barra de
// acciones. Entrada en cascada (StaggerIn / GSAP). Columna angosta como un feed real.
export const metadata: Metadata = {
  title: t.samuel.casosMetaTitle,
  description: t.samuel.casosMetaDescription,
  alternates: { canonical: '/samuel/casos' },
};

const catTitle = (id: string) => categories.find((c) => c.id === id)?.title ?? id;

export default function CasosPage() {
  return (
    <article className="mx-auto w-full max-w-[720px] px-4 pt-28 pb-20 sm:px-6">
      <p className="font-mono text-sm text-data">{t.samuel.casosEyebrow}</p>
      <h1 className="mt-3 font-display text-hero font-bold text-ink">{t.samuel.storiesTitle}</h1>
      <p className="mt-4 text-lg text-dim">{t.samuel.storiesIntro}</p>

      <StaggerIn className="mt-10 flex flex-col gap-4">
        {stories.map((s) => (
          <Spotlight key={s.projectName} data-stagger className="foro-post group">
            <header className="flex items-center gap-3">
              <span className="foro-avatar" aria-hidden="true">
                SG
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold text-ink">
                  Samuel Galeano <span className="font-mono text-xs font-normal text-dim">@samuelgaleano</span>
                </p>
                <p className="font-mono text-[0.7rem] text-pixel-soft">
                  <span className="inline-block size-1.5 translate-y-[-1px] bg-pixel align-middle" aria-hidden="true" />{' '}
                  {catTitle(s.category)} · caso
                </p>
              </div>
            </header>

            <h2 className="mt-3 font-display text-xl font-semibold text-ink">{s.projectName}</h2>
            <p className="mt-2 text-sm leading-relaxed text-dim">
              <span className="font-mono text-xs text-data">Rol: </span>
              {s.role}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-dim">
              <span className="font-mono text-xs text-data">{t.samuel.storyDecision}: </span>
              {s.decision}
            </p>

            <footer className="mt-4 border-t border-line/70 pt-3">
              <Link
                href={`/#${s.category}`}
                className="inline-flex items-center gap-1 font-mono text-xs text-pixel-soft transition-transform hover:translate-x-0.5"
              >
                {t.samuel.storyLink}
              </Link>
            </footer>
          </Spotlight>
        ))}
      </StaggerIn>

      <Link
        href="/samuel"
        className="mt-12 inline-block rounded-(--radius-s) border border-line px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
      >
        {t.samuel.casosBack}
      </Link>
    </article>
  );
}
