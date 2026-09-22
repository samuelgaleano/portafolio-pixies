import { t } from '@/i18n';
import PixelCanvas from './PixelCanvas';
import HeroGrid from './HeroGrid';
import HeroFirma from './HeroFirma';
import RespaldoIngenieria from './RespaldoIngenieria';
import Atmosphere from '@/components/fx/Atmosphere';
import Parallax from '@/components/fx/Parallax';

// Hero de /web (Pixies Digital Web Design).
//
// ESTRUCTURA ESTÁNDAR de división (Samuel, 2026-09-22: "que web y creative tengan la misma
// estructura inicial, botones y animaciones; que cambien colores, formas y contenido, no la
// estructura"). Mismo esqueleto que MarketingHero:
//   1. wordmark PIXIES animado (PixelCanvas)
//   2. nombre de la división + kicker  (.hero-titulo)
//   3. tagline en mono
//   4. fila: [firma C/W + tesis + CTA]  |  bloque de apoyo
// Lo que cambia aquí: el acento violeta, el lavado de color a la DERECHA (Web ancla a la
// derecha), la W fija en cursor y, como bloque de apoyo, el respaldo de ingeniería — en
// Creative ese mismo lugar lo ocupan los tres frentes.
export default function Hero() {
  return (
    <section id="inicio" className="grid-bg relative overflow-hidden">
      {/* atmósfera premium detrás del canvas, con deriva sutil al hacer scroll */}
      <Parallax speed={10} className="pointer-events-none absolute inset-0 z-0">
        <Atmosphere />
      </Parallax>
      <HeroGrid />
      {/* lavado violeta arriba a la DERECHA (gramática espacial: Web ancla a la derecha) */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(60% 50% at 88% 0%, color-mix(in srgb, var(--color-pixel) 14%, transparent), transparent 70%)' }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-void/40 via-transparent to-void" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 pt-20 pb-8 sm:items-start sm:px-6 sm:pb-12">
        <div className="relative mt-14 inline-block max-w-full sm:mt-[70px]">
          <p id="wordmark" className="font-display text-wordmark font-bold text-ink" aria-hidden="true">
            {t.hero.title}
          </p>
          <PixelCanvas />
        </div>

        <h1 className="hero-in hero-titulo mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1" style={{ '--d': '0.35s' } as React.CSSProperties}>
          <span className="sr-only">Pixies </span>
          <span className="hero-titulo__nombre">{t.hero.subtitle}</span>
          <span className="hero-titulo__kicker text-[color:var(--color-pixel-soft)]">{t.hero.kicker}</span>
        </h1>
        <p className="hero-in mt-2 text-center font-mono text-sm text-dim sm:text-left sm:text-base" style={{ '--d': '0.42s' } as React.CSSProperties}>
          {t.hero.tagline}
        </p>

        <div className="hero-fila">
          <div className="hero-fila__texto">
            <div className="hero-in flex justify-center sm:justify-start" style={{ '--d': '0.48s' } as React.CSSProperties}>
              <HeroFirma activa="web" compacta />
            </div>

            <p className="hero-in mt-5 max-w-[32ch] text-center text-[1.1rem] leading-snug text-ink sm:text-left sm:text-xl" style={{ '--d': '0.55s' } as React.CSSProperties}>
              {t.hero.tesis}
            </p>

            <div className="hero-in mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start" style={{ '--d': '0.68s' } as React.CSSProperties}>
              <a href="#contacto" data-desde="hero" className="hero-cta press">
                <span>{t.hero.cta}</span>
                <span className="hero-cta__arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a href="#portafolio" className="link-draw font-mono text-sm text-dim">
                {t.hero.ctaProyectos}
              </a>
            </div>
          </div>

          <div className="hero-in hero-fila__apoyo" style={{ '--d': '0.62s' } as React.CSSProperties}>
            <RespaldoIngenieria />
          </div>
        </div>
      </div>
    </section>
  );
}
