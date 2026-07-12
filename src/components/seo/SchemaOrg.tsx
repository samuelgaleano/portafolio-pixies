import { site } from '@/data/site';

// JSON-LD (§9). type 'person' en /samuel, 'blogPosting' por post.
interface Props {
  type: 'person' | 'blogPosting';
  post?: { title: string; description: string; pubDate: Date; url: string };
}

export default function SchemaOrg({ type, post }: Props) {
  const clean = (v: string) => (v.startsWith('[COMPLETAR') ? undefined : v);

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Samuel Galeano',
    jobTitle: 'Ingeniero de Sistemas',
    worksFor: { '@type': 'Organization', name: site.name, url: site.url },
    url: `${site.url}/samuel`,
    sameAs: [clean(site.social.github), clean(site.social.linkedin), clean(site.social.instagram)].filter(Boolean),
  };

  const blogPosting = post && {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.pubDate.toISOString(),
    author: { '@type': 'Person', name: 'Samuel Galeano' },
    url: post.url,
  };

  const data = type === 'person' ? person : blogPosting;
  if (!data) return null;

  // Escapar < evita que un título con "</script>" rompa el DOM (hardening estándar de JSON-LD)
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
