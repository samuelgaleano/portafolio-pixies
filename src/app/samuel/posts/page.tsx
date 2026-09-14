import type { Metadata } from 'next';
import Link from 'next/link';
import { t } from '@/i18n';
import { getAllPosts } from '@/lib/posts';
import { readingTime } from '@/lib/reading-time';
import { formatDate } from '@/lib/utils';
import StaggerIn from '@/components/fx/StaggerIn';
import Spotlight from '@/components/fx/Spotlight';

// Listado del foro (mismo patrón que /samuel/casos): bitácora tipo feed, un "post" por entrada.
export const metadata: Metadata = {
  title: t.post.indexMetaTitle,
  description: t.post.indexMetaDescription,
  alternates: { canonical: '/samuel/posts' },
};

export default function PostsIndexPage() {
  const posts = getAllPosts();

  return (
    <article className="mx-auto w-full max-w-[720px] px-4 pt-28 pb-20 sm:px-6">
      <p className="font-mono text-sm text-data">{t.post.indexEyebrow}</p>
      <h1 className="mt-3 font-display text-hero font-bold text-ink">{t.samuel.foroTitle}</h1>
      <p className="mt-4 text-lg text-dim">{t.samuel.foroIntro}</p>

      <StaggerIn className="mt-10 flex flex-col gap-4">
        {posts.map((p) => (
          <Spotlight key={p.slug} data-stagger className="foro-post group">
            <Link href={`/samuel/posts/${p.slug}`} className="block">
              <header className="flex items-center gap-3">
                <span className="foro-avatar" aria-hidden="true">
                  SG
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold text-ink">
                    Samuel Galeano <span className="font-mono text-xs font-normal text-dim">@samuelgaleano</span>
                  </p>
                  <p className="font-mono text-[0.7rem] text-pixel-soft">
                    {formatDate(p.pubDate)} · {readingTime(p.content)} {t.post.readingTime}
                  </p>
                </div>
              </header>

              <h2 className="mt-3 font-display text-xl font-semibold text-ink">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-dim">{p.description}</p>
            </Link>
          </Spotlight>
        ))}
      </StaggerIn>

      <Link
        href="/samuel"
        className="mt-12 inline-block rounded-(--radius-s) border border-line px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
      >
        {t.post.indexBack}
      </Link>
    </article>
  );
}
