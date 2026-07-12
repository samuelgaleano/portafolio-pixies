import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { site } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/samuel'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));
  const posts = getAllPosts().map((p) => ({
    url: `${site.url}/samuel/posts/${p.slug}`,
    lastModified: p.pubDate,
  }));
  return [...routes, ...posts];
}
