import Link from 'next/link';
import { t } from '@/i18n';
import { site } from '@/data/site';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-display text-lg font-bold">pixies</p>
          <p className="mt-2 text-sm text-dim">{t.footer.tagline}</p>
        </div>
        <nav aria-label={t.footer.navLabel} className="flex flex-col gap-2 text-sm">
          <Link href="/#inicio" className="text-dim transition-colors hover:text-ink">
            {t.footer.navHome}
          </Link>
          <Link href="/#portafolio" className="text-dim transition-colors hover:text-ink">
            {t.nav.portfolio}
          </Link>
          <Link href="/samuel" className="text-dim transition-colors hover:text-ink">
            {t.nav.engineer}
          </Link>
          <Link href="/#contacto" className="text-dim transition-colors hover:text-ink">
            {t.footer.navContact}
          </Link>
        </nav>
        <div className="flex flex-col gap-2 font-mono text-xs text-dim">
          {/* Se convierten en enlaces reales cuando site.ts tenga las URLs (§13 del plan) */}
          <span>github → {site.social.github}</span>
          <span>linkedin → {site.social.linkedin}</span>
          <span>instagram → {site.social.instagram}</span>
          <span>correo → {site.email}</span>
        </div>
      </div>
      <div className="border-t border-line/60 py-4 text-center font-mono text-xs text-dim">
        {t.footer.madeBy}
      </div>
    </footer>
  );
}
