import Link from 'next/link';
import { t } from '@/i18n';
import { site } from '@/data/site';
import Pending from '@/components/ui/Pending';

const isReal = (v: string) => Boolean(v) && !v.startsWith('[COMPLETAR');

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
        <div className="flex flex-col items-start gap-3 font-mono text-xs text-dim">
          {/* solo enlaces reales; el estado pendiente va diseñado, no en corchetes (critique P0) */}
          {(
            [
              ['github', site.social.github],
              ['linkedin', site.social.linkedin],
              ['instagram', site.social.instagram],
            ] as const
          )
            .filter(([, url]) => isReal(url))
            .map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                {label} →
              </a>
            ))}
          {isReal(site.email) ? (
            <a href={`mailto:${site.email}`} className="hover:text-ink">
              {site.email}
            </a>
          ) : (
            <>
              <Pending>{t.footer.pendingSocial}</Pending>
              <Link href="/#contacto" className="text-pixel-soft hover:underline">
                {t.footer.writeUs}
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="border-t border-line/60 py-4 text-center font-mono text-xs text-dim">
        {t.footer.madeBy}
      </div>
    </footer>
  );
}
