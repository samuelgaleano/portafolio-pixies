import { t } from '@/i18n';
import PixelCanvas from './PixelCanvas';
import HeroGrid from './HeroGrid';
import Atmosphere from '@/components/fx/Atmosphere';
import Parallax from '@/components/fx/Parallax';

// Hero de la landing del grupo (`/`). Es DISTINTO del Hero de /web a propósito (Samuel,
// 2026-09-21): el de /web lleva "/digital·web·design" y el portal del ingeniero — eso es
// identidad de la división Web, no del grupo. Aquí: el mismo wordmark PIXIES animado (el
// PixelCanvas es portable: muestrea lo que haya en #wordmark) con "Design Group" debajo, la
// tesis de la empresa y dos CTA. Voz empresarial: nada en primera persona del singular.
export default function GrupoHero() {
  const { grupoHero } = t;
  return (
    <section id="inicio" className="grid-bg relative overflow-hidden">
      <Parallax speed={10} className="pointer-events-none absolute inset-0 z-0">
        <Atmosphere />
      </Parallax>
      <HeroGrid />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-void/40 via-transparent to-void"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 pt-20 pb-6 sm:items-start sm:px-6 sm:pb-[6rem]">
        <div className="relative mt-14 inline-block max-w-full sm:mt-[70px]">
          <h1 id="wordmark" className="font-display text-wordmark font-bold text-ink">
            {grupoHero.title}
          </h1>
          <PixelCanvas />
        </div>

        {/* "Design Group" es la firma del wordmark, no un segundo titular: mono, pegado, en dim */}
        <p className="hero-in mt-3 text-center font-mono text-lg text-dim sm:text-left sm:text-xl" style={{ '--d': '0.9s' } as React.CSSProperties}>
          {grupoHero.subtitle}
        </p>

        <p
          className="hero-in mt-6 max-w-[46ch] text-center text-[1.15rem] leading-snug text-ink sm:text-left sm:text-xl"
          style={{ '--d': '1.0s' } as React.CSSProperties}
        >
          {grupoHero.tesis}
        </p>

        <div
          className="hero-in mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-start sm:gap-4"
          style={{ '--d': '1.1s' } as React.CSSProperties}
        >
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
    </section>
  );
}
