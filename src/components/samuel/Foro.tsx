import Link from 'next/link';
import { t } from '@/i18n';
import { getAllPosts } from '@/lib/posts';
import SectionHead from './SectionHead';

// Teaser del foro/blog en /samuel (mismo patrón que ProjectStories → /samuel/casos): tarjeta
// tipo "entrada de perfil" que redirige al listado completo en /samuel/posts. id="foro" porque
// el botón "← Volver al foro" de cada post enlaza a /samuel#foro.
export default function Foro() {
  const posts = getAllPosts();
  if (posts.length === 0) return null;

  return (
    <section id="foro" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6">
        <SectionHead index="05 · foro" title={t.samuel.foroTitle} intro={t.samuel.foroIntro} glyph="spark" />

        <Link
          href="/samuel/posts"
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
              <p className="font-mono text-xs text-pixel-soft">{posts.length} artículos · foro abierto</p>
            </div>
          </div>

          <ul className="hidden flex-wrap gap-2 md:flex">
            {posts.map((p) => (
              <li
                key={p.slug}
                className="inline-flex items-center gap-1.5 rounded-(--radius-s) border border-line px-2.5 py-1 font-mono text-xs text-dim"
              >
                <span className="inline-block size-1.5 bg-pixel" aria-hidden="true" />
                {p.title}
              </li>
            ))}
          </ul>

          <span className="inline-flex shrink-0 items-center gap-1 font-mono text-sm font-medium text-pixel-soft transition-transform group-hover:translate-x-0.5">
            {t.samuel.foroCta}
          </span>
        </Link>
      </div>
    </section>
  );
}
