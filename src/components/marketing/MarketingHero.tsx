import Link from 'next/link';
import { t } from '@/i18n';
import BitmapWordmark from '@/components/hero/BitmapWordmark';
import HeroFirma from '@/components/hero/HeroFirma';
import HeroGrid from '@/components/hero/HeroGrid';

// Hero de /marketing = Pixies Creative, con la estructura del mockup 15-final-ajustado.html
// (vista Marketing): wordmark PIXIES con la banda de acento en ÁMBAR (hilo de color del
// entorno, --acento via data-division="creative"), "Creative" + "una empresa de Pixies
// Design Group", el tagline textual de Samuel, las tarjetas M/W (la M queda fija en corazón:
// es la división activa), tesis y CTA. Voz empresarial. El <h1> es "Pixies Creative": el
// wordmark lleva "PIXIES" sr-only y aquí va "Creative" visible.
export default function MarketingHero() {
  const { marketing } = t;
  return (
    <section id="inicio" className="grid-bg relative overflow-hidden border-b border-line">
      <HeroGrid />
      {/* lavado ámbar muy leve arriba a la derecha: la misma pista de entorno del mockup */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(60% 45% at 85% 0%, color-mix(in srgb, var(--color-marketing) 16%, transparent), transparent 70%)' }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-void/40 via-transparent to-void" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pt-24 pb-10 sm:px-6 sm:pt-28 sm:pb-16">
        <BitmapWordmark desplazamiento={4} comoTitulo={false} />

        <h1 className="hero-titulo mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="sr-only">Pixies </span>
          <span className="font-display text-hero font-bold text-ink">Creative</span>
        </h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.06em] text-[color:var(--color-marketing-texto)]">{marketing.kicker}</p>
        {/* tagline literal de Samuel (2026-09-21) */}
        <p className="mt-2 font-mono text-sm text-dim sm:text-base">{marketing.tagline}</p>

        <HeroFirma activa="creative" />

        <div className="mt-8 grid gap-6 sm:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] sm:items-end">
          <div>
            <p data-reveal className="max-w-[34ch] text-[1.15rem] leading-snug text-ink sm:text-xl">
              {marketing.tesis}
            </p>
            <div className="mt-6">
              <Link
                href="#contacto"
                data-desde="marketing-hero"
                className="inline-flex min-h-12 items-center rounded-(--radius-s) press px-6 font-semibold"
                style={{ background: 'var(--color-marketing)', color: 'var(--color-ink)' }}
              >
                {marketing.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
