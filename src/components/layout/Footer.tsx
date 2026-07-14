import Link from 'next/link';
import { t } from '@/i18n';
import { site } from '@/data/site';
import Pending from '@/components/ui/Pending';
import LiveStatus from '@/components/fx/LiveStatus';
import PixelGlyph from '@/components/ui/PixelGlyph';

const isReal = (v: string) => Boolean(v) && !v.startsWith('[COMPLETAR');

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      {/* línea CTA grande (patrón de cierre; el formulario vive en #contacto) */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-baseline justify-between gap-4 px-4 pt-14 sm:px-6">
        <p className="font-display text-[clamp(1.5rem,3.2vw,2.5rem)] font-semibold text-ink">{t.footer.ctaLine}</p>
        <Link
          href="/#contacto"
          className="rounded-(--radius-s) bg-signal px-5 py-2.5 font-semibold text-void transition hover:brightness-110"
        >
          {t.footer.ctaAction}
        </Link>
      </div>

      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-display text-lg font-bold">pixies</p>
          <p className="mt-2 text-sm text-dim">{t.footer.tagline}</p>
          <PixelGlyph name="spark" className="mt-6 text-[9px] text-pixel-soft/40" />
        </div>
        {/* min-h-11 en los enlaces: área táctil cómoda (el gap-2 ya no basta en móvil) */}
        <nav aria-label={t.footer.navLabel} className="flex flex-col text-sm">
          <Link href="/#inicio" className="flex min-h-11 items-center text-dim transition-colors hover:text-ink">
            {t.footer.navHome}
          </Link>
          <Link href="/#portafolio" className="flex min-h-11 items-center text-dim transition-colors hover:text-ink">
            {t.nav.portfolio}
          </Link>
          <Link href="/samuel" className="flex min-h-11 items-center text-dim transition-colors hover:text-ink">
            {t.nav.engineer}
          </Link>
          <Link href="/#contacto" className="flex min-h-11 items-center text-dim transition-colors hover:text-ink">
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

      {/* barra de estado viva (spec capa-viva: reloj BOG + disponibilidad) */}
      <div className="border-t border-line/60">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-2 px-4 py-4 sm:px-6">
          <LiveStatus />
          <p className="font-mono text-xs text-dim">{t.footer.madeBy}</p>
        </div>
      </div>

      {/* wordmark recortado por el borde (referencia WAIRK): tinta sutil sobre void */}
      <div className="overflow-hidden" aria-hidden="true">
        <span className="footer-wordmark mx-auto block w-full max-w-[1200px] px-4 text-center font-display font-bold sm:px-6">
          PIXIES
        </span>
      </div>
    </footer>
  );
}
