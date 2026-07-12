import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import SchemaOrg from '@/components/seo/SchemaOrg';
import { getAllPosts, getPost } from '@/lib/posts';
import { readingTime } from '@/lib/reading-time';
import { formatDate } from '@/lib/utils';
import { site } from '@/data/site';
import { t } from '@/i18n';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Foro de Samuel`,
    description: post.description,
    openGraph: { type: 'article', title: post.title, description: post.description, publishedTime: post.pubDate.toISOString() },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const mins = readingTime(post.content);
  const url = `${site.url}/samuel/posts/${post.slug}`;

  return (
    <article className="mx-auto w-full max-w-[720px] px-4 pt-28 pb-20 sm:px-6">
      <SchemaOrg
        type="blogPosting"
        post={{ title: post.title, description: post.description, pubDate: post.pubDate, url }}
      />
      <a href="/samuel#foro" className="font-mono text-xs text-dim transition-colors hover:text-ink">
        {t.post.backToForum}
      </a>

      <header className="mt-6 border-b border-line pb-6">
        <p className="font-mono text-xs text-data">
          {formatDate(post.pubDate)} · {mins} {t.post.readingTime}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-ink text-balance">{post.title}</h1>
      </header>

      <div className="prose mt-8">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
