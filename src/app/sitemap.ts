import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { site } from '@/data/site';
import { apps, appPath } from '@/data/apps';

// Señal estable para crawlers: fecha REAL del último cambio de contenido por ruta, no "cada
// build" — un lastmod que cambia en cada despliegue (aunque solo se tocó CSS) es la señal
// clásica que Google aprende a ignorar. Se actualiza a mano cuando el contenido de una ruta
// cambia de verdad (copy, estructura, nueva sección) — no en cada ajuste visual.
//
// 2026-09-24 (auditoría SEO): el sitemap llevaba TODAS las rutas ancladas a la fecha del
// último post del foro (2026-09-14), aunque `/`, `/web` y la página de la app se reescribieron
// varias veces desde entonces (reestructuración del grupo, ficha de aplicaciones, grafo de
// contexto). Un lastmod que miente hacia atrás es tan malo como uno que miente "hoy" siempre.
const LAST_CONTENT_CHANGE: Record<string, string> = {
  '': '2026-09-23',
  '/web': '2026-09-24',
  '/marketing': '2026-09-22',
  '/samuel': '2026-09-14',
  '/samuel/casos': '2026-09-14',
  '/samuel/posts': '2026-09-14',
  '/proyectos/analisis-saber11': '2026-09-14',
  '/aplicaciones/escuchacomprendiendo-ai': '2026-09-24',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  // Rutas indexables (las /demos/* y /alternativas son noindex y quedan fuera a propósito).
  // Las apps salen de src/data/apps.ts, igual que los posts de getAllPosts(): una sola lista.
  const routes = [
    '',
    '/web',
    '/marketing',
    '/samuel',
    '/samuel/casos',
    '/samuel/posts',
    '/proyectos/analisis-saber11',
    ...apps.map((a) => appPath(a.slug)),
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(LAST_CONTENT_CHANGE[path] ?? posts[0]!.pubDate),
  }));
  const postEntries = posts.map((p) => ({
    url: `${site.url}/samuel/posts/${p.slug}`,
    lastModified: p.pubDate,
  }));
  return [...routes, ...postEntries];
}
