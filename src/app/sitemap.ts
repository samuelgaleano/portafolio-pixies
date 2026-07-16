import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { site } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  // Señal estable para crawlers: la fecha del último post, no "cada build" (auditoría).
  const lastContentDate = posts[0]?.pubDate;
  // Rutas indexables (las /demos/* y /alternativas son noindex y quedan fuera a propósito).
  const routes = ['', '/samuel', '/samuel/casos', '/proyectos/analisis-saber11'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: lastContentDate,
  }));
  const postEntries = posts.map((p) => ({
    url: `${site.url}/samuel/posts/${p.slug}`,
    lastModified: p.pubDate,
  }));
  return [...routes, ...postEntries];
}
