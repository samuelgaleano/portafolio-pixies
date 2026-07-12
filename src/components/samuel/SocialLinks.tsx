import { t } from '@/i18n';
import { site } from '@/data/site';
import { tech } from '@/data/tech';

export default function SocialLinks() {
  // wa.me necesita el número sin +, espacios ni guiones
  const waNumber = site.whatsapp.replace(/[^0-9]/g, '');
  const links = [
    { label: 'GitHub', href: site.social.github, icon: tech.github.d },
    { label: 'LinkedIn', href: site.social.linkedin, icon: null },
    { label: 'WhatsApp', href: waNumber ? `https://wa.me/${waNumber}` : '', icon: tech.whatsapp.d },
    { label: 'Instagram', href: site.social.instagram, icon: null },
  ];
  const valid = (href: string) => Boolean(href) && !href.startsWith('[COMPLETAR');

  return (
    <section id="contacto-samuel" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <h2 className="font-display text-h2 font-semibold">{t.samuel.socialTitle}</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {links.map((l) => {
            const ok = valid(l.href);
            return (
              <a
                key={l.label}
                href={ok ? l.href : undefined}
                target={ok ? '_blank' : undefined}
                rel={ok ? 'noopener noreferrer' : undefined}
                aria-disabled={!ok}
                className={`inline-flex items-center gap-2 rounded-(--radius-s) border px-4 py-2.5 font-mono text-sm transition-colors ${
                  ok
                    ? 'border-line text-ink hover:border-pixel hover:text-pixel-soft'
                    : 'pointer-events-none border-line/50 text-dim'
                }`}
              >
                {l.icon && (
                  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                    <path d={l.icon} />
                  </svg>
                )}
                {l.label}
                {!ok && <span className="text-dim">· [COMPLETAR]</span>}
              </a>
            );
          })}
        </div>
        <a
          href="/#contacto"
          className="mt-8 inline-block rounded-(--radius-s) bg-signal px-6 py-3 font-semibold text-void transition hover:brightness-110"
        >
          {t.nav.cta}
        </a>
      </div>
    </section>
  );
}
