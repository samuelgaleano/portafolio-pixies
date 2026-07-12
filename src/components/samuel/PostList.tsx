import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { readingTime } from '@/lib/reading-time';
import { formatDate } from '@/lib/utils';
import { t } from '@/i18n';

export default function PostList() {
  const posts = getAllPosts();

  return (
    <section id="foro" className="scroll-mt-20 border-t border-line">
      <div data-reveal className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <h2 className="font-display text-h2 font-semibold">{t.samuel.postsTitle}</h2>
        <p className="mt-3 max-w-xl text-dim">{t.samuel.postsIntro}</p>

        {posts.length === 0 ? (
          <p className="mt-8 font-mono text-sm text-dim">{t.samuel.postsEmpty}</p>
        ) : (
          <ul className="mt-10 flex flex-col divide-y divide-line border-y border-line">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/samuel/posts/${post.slug}`} className="group block py-6 transition-colors hover:bg-surface/50">
                  <p className="font-mono text-xs text-dim">
                    {formatDate(post.pubDate)} · {readingTime(post.content)} {t.post.readingTime}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-ink group-hover:text-pixel-soft">
                    {post.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-dim">{post.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
