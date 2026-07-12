import { site } from '@/data/site';
import { projects } from '@/data/projects';

// JSON-LD (§9): Organization en /, Person en /samuel, BlogPosting por post, CreativeWork por proyecto.
interface Props {
  type: 'person' | 'organization' | 'blogPosting';
  post?: { title: string; description: string; pubDate: Date; url: string };
}

const clean = (v: string) => (v.startsWith('[COMPLETAR') ? undefined : v);
const sameAs = [clean(site.social.github), clean(site.social.linkedin), clean(site.social.instagram)].filter(Boolean);

export default function SchemaOrg({ type, post }: Props) {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Samuel Galeano',
    jobTitle: 'Ingeniero de Sistemas',
    worksFor: { '@type': 'Organization', name: site.name, url: site.url },
    url: `${site.url}/samuel`,
    sameAs,
  };

  // Organization + un CreativeWork por proyecto (los que ya están en producción llevan url)
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: `${site.url}/favicon.svg`,
    founder: { '@type': 'Person', name: 'Samuel Galeano', jobTitle: 'Ingeniero de Sistemas' },
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

  const data =
    type === 'person' ? person : type === 'organization' ? [organization, ...creativeWorks] : blogPosting;
  if (!data) return null;

  // Escapar < evita que un título con "</script>" rompa el DOM (hardening estándar de JSON-LD)
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
