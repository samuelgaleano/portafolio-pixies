import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE } from '@/components/og/OgCard';
import { getAllPosts, getPost } from '@/lib/posts';

export const alt = 'Foro de Samuel — Pixies';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return new ImageResponse(
    <OgCard eyebrow="/foro" title={post?.title ?? 'Foro'} subtitle={post?.description ?? 'Notas del ingeniero'} />,
    size
  );
}
