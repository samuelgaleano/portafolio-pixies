import Link from 'next/link';
import { t } from '@/i18n';

// Hero de /marketing (grupo-y-marketing, 2026-09): a propósito NO reutiliza PixelCanvas
// (el sistema de partículas del wordmark del hero de / y /web está afinado para "PIXIES"
// y una segunda instancia en otra página, con otro texto, es riesgo sin necesidad real —
// ver docs/grupo-y-marketing/02-plan-de-trabajo.md §Sprint 3a). Mismo sistema de tipografía
// y tokens, hilo de color en --color-marketing en vez de --color-pixel.
export default function MarketingHero() {
  return (
    <section id="inicio" className="grid-bg relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-void/40 via-transparent to-void" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pt-20 pb-16 sm:px-6 sm:pb-20">
        <p className="font-mono text-sm text-[color:var(--color-marketing-texto)]">{t.marketing.kicker}</p>
        <h1 className="mt-3 font-display text-hero font-bold text-ink">{t.marketing.title}</h1>
        <p data-reveal className="mt-6 max-w-[46ch] text-[1.15rem] leading-snug text-dim sm:text-xl">
          {t.marketing.tesis}
        </p>
        <div className="mt-8">
          <Link
            href="#contacto"
            data-desde="marketing-hero"
            className="inline-flex min-h-12 items-center rounded-(--radius-s) press px-6 font-semibold"
            style={{ background: 'var(--color-marketing)', color: 'var(--color-ink)' }}
          >
            {t.marketing.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
