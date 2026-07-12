import Link from 'next/link';
import { t } from '@/i18n';
import { stories } from '@/data/stories';

// Lista editorial full-width: rompe el ritmo de tarjetas idénticas de la página (critique P2).
export default function ProjectStories() {
  return (
    <section className="border-t border-line">
      <div data-reveal className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <h2 className="font-display text-h2 font-semibold">{t.samuel.storiesTitle}</h2>
        <p className="mt-3 max-w-xl text-dim">{t.samuel.storiesIntro}</p>

        <div className="mt-10 flex flex-col divide-y divide-line border-y border-line">
          {stories.map((s) => (
            <article key={s.projectName} className="grid gap-4 py-8 md:grid-cols-[1.2fr_1fr_1fr] md:gap-8">
              <h3 className="font-display text-xl font-semibold text-ink md:text-2xl">{s.projectName}</h3>
              <div>
                <p className="font-mono text-xs text-pixel-soft">{t.samuel.storyRole}</p>
                <p className="mt-1 text-sm text-dim">{s.role}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-data">{t.samuel.storyDecision}</p>
                <p className="mt-1 text-sm text-dim">{s.decision}</p>
                <Link
                  href={`/#${s.category}`}
                  className="mt-3 inline-block font-mono text-xs text-pixel-soft hover:underline"
                >
                  {t.samuel.storyLink}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
