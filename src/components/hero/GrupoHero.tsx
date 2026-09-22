import { t } from '@/i18n';
import BitmapWordmark from './BitmapWordmark';
import HeroFirma from './HeroFirma';
import HeroGrid from './HeroGrid';
import Atmosphere from '@/components/fx/Atmosphere';
import Parallax from '@/components/fx/Parallax';

// Hero de la landing del grupo (`/`), con la estructura del mockup 15-final-ajustado.html
// (Samuel, 2026-09-21: "dejar esta estructura inicial para generar una identidad"):
//   wordmark PIXIES en bitmap (banda de acento neutra en Grupo) → "Design Group" + kicker
//   → las dos tarjetas M/W (la firma) → tesis de la empresa → CTA.
// Es distinto del Hero de /web a propósito: sin "/digital·web·design" ni portal del
// ingeniero (eso es identidad de la división Web). Voz empresarial, nunca "yo".
export default function GrupoHero() {
  const { grupoHero } = t;
  return (
    <section id="inicio" className="grid-bg relative overflow-hidden">
      <Parallax speed={10} className="pointer-events-none absolute inset-0 z-0">
        <Atmosphere />
      </Parallax>
      <HeroGrid />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-void/40 via-transparent to-void" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pt-24 pb-10 sm:px-6 sm:pt-28 sm:pb-16">
        <BitmapWordmark desplazamiento={0} />

        {/* "Design Group" es la firma del wordmark; el h1 real (PIXIES) va sr-only en BitmapWordmark */}
        <p className="hero-titulo mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-display text-hero font-bold text-ink">{grupoHero.subtitle}</span>
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-dim">{grupoHero.kicker}</span>
        </p>

        <HeroFirma activa="grupo" />

        <div className="mt-8 grid gap-6 sm:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] sm:items-end">
          <div>
            <p className="max-w-[30ch] text-[1.15rem] leading-snug text-ink sm:text-xl" data-reveal>
              {grupoHero.tesis}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#grupo-split-h" className="hero-cta press">
                <span>{grupoHero.cta}</span>
                <span className="hero-cta__arrow" aria-hidden="true">
                  ↓
                </span>
              </a>
              <a
                href="#contacto"
                data-desde="grupo-hero"
                className="inline-flex min-h-12 items-center rounded-(--radius-s) border border-line px-5 font-medium text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
              >
                {grupoHero.ctaContacto}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
