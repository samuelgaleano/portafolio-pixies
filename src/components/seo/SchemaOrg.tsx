import { site } from '@/data/site';
import { projects } from '@/data/projects';
import { apps, appPath } from '@/data/apps';

// JSON-LD (§9): Organization en /, Person en /samuel, BlogPosting por post, CreativeWork por
// proyecto. 2026-09-24 (auditoría SEO): + SoftwareApplication por app propia y Article para
// informes técnicos publicados (hoy solo el de Saber 11) — antes esas dos páginas no llevaban
// ningún structured data.
interface Props {
  type: 'person' | 'organization' | 'blogPosting' | 'softwareApplication' | 'article';
  post?: { title: string; description: string; pubDate: Date; url: string };
  /** type: 'softwareApplication' — slug en src/data/apps.ts (única fuente de la ficha) */
  appSlug?: string;
  /** type: 'article' — sin post propio (no es del foro): informes y proyectos técnicos */
  article?: { title: string; description: string; url: string };
}

const clean = (v: string) => (v.startsWith('[COMPLETAR') ? undefined : v);
const sameAs = [clean(site.social.github), clean(site.social.linkedin), clean(site.social.instagram)].filter(Boolean);

export default function SchemaOrg({ type, post, appSlug, article }: Props) {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Samuel Galeano',
    jobTitle: 'Ingeniero de Sistemas',
    worksFor: { '@type': 'Organization', name: site.name, url: site.url },
    url: `${site.url}/samuel`,
    sameAs,
  };

  // Organization (el grupo) con sus dos divisiones como subOrganization + un CreativeWork por
  // proyecto (los que ya están en producción llevan url)
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    alternateName: 'Pixies',
    url: site.url,
    logo: `${site.url}/favicon.svg`,
    founder: { '@type': 'Person', name: 'Samuel Galeano', jobTitle: 'Ingeniero de Sistemas' },
    subOrganization: site.divisiones.map((d) => ({
      '@type': 'Organization',
      name: d.name,
      url: `${site.url}${d.path}`,
      parentOrganization: { '@type': 'Organization', name: site.name, url: site.url },
    })),
    sameAs,
  };
  const creativeWorks = projects
    .filter((p) => !p.name.startsWith('[COMPLETAR'))
    .map((p) => ({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: p.name,
      abstract: p.tagline,
      creator: { '@type': 'Person', name: 'Samuel Galeano' },
      ...(clean(p.liveUrl ?? '') || clean(p.repoUrl ?? '') ? { url: p.liveUrl || p.repoUrl } : {}),
    }));

  const blogPosting = post && {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.pubDate.toISOString(),
    author: { '@type': 'Person', name: 'Samuel Galeano' },
    url: post.url,
  };

  // Deliberadamente SIN aggregateRating ni ratingCount: no existen valoraciones reales y
  // Google trata un rating inventado como structured data engañosa (misma regla que ya
  // aplica en la ficha visual — "no dejar como si tuviera estrellas si no las tenemos").
  const app = appSlug && apps.find((a) => a.slug === appSlug);
  const softwareApplication = app && {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.nombre,
    description: app.descripcion,
    url: `${site.url}${appPath(app.slug)}`,
    applicationCategory: app.ficha.categoria,
    operatingSystem: app.ficha.plataforma,
    softwareVersion: app.ficha.version,
    author: { '@type': 'Organization', name: site.name, url: site.url },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const articleSchema = article && {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: { '@type': 'Person', name: 'Samuel Galeano' },
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    url: article.url,
  };

  const data =
    type === 'person'
      ? person
      : type === 'organization'
        ? [organization, ...creativeWorks]
        : type === 'softwareApplication'
          ? softwareApplication
          : type === 'article'
            ? articleSchema
            : blogPosting;
  if (!data) return null;

  // Escapar < evita que un título con "</script>" rompa el DOM (hardening estándar de JSON-LD)
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
