import { site } from '@/data/site';
import { tech } from '@/data/tech';

// Botones sociales (rediseño Samuel 2026-07-18): suben al hero del ingeniero, sin el
// encabezado "Hablemos". Estilo "tecla 3D" (canto violeta + hundido al pulsar) — llamativo
// e interactivo. Fila reutilizable sin <section>: el Manifesto la coloca junto a lo relevante.
const LINKEDIN_D =
  'M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.5 8h4V23h-4V8zm7 0h3.8v2.05h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.75 2.63 4.75 6.05V23h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V23h-4V8z';

export default function SocialLinks() {
  // wa.me necesita el número sin +, espacios ni guiones; mínimo 10 dígitos = número real
  const waNumber = site.whatsapp.replace(/[^0-9]/g, '');
  const links = [
    { label: 'GitHub', href: site.social.github, d: tech.github.d },
    { label: 'LinkedIn', href: site.social.linkedin, d: LINKEDIN_D },
    { label: 'WhatsApp', href: waNumber.length >= 10 ? `https://wa.me/${waNumber}` : '', d: tech.whatsapp.d },
  ];
  const valid = (href: string) => Boolean(href) && !href.startsWith('[COMPLETAR');

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((l) => {
        const ok = valid(l.href);
        return (
          <a
            key={l.label}
            href={ok ? l.href : undefined}
            target={ok ? '_blank' : undefined}
            rel={ok ? 'noopener noreferrer' : undefined}
            aria-disabled={!ok}
            aria-label={l.label}
            className={`social-key${ok ? '' : ' social-key--off'}`}
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
              <path d={l.d} />
            </svg>
            <span>{l.label}</span>
          </a>
        );
      })}
    </div>
  );
}
