import { t } from '@/i18n';
import PixelCanvas from './PixelCanvas';
import HeroGrid from './HeroGrid';
import Atmosphere from '@/components/fx/Atmosphere';
import Parallax from '@/components/fx/Parallax';

// Hero de la landing del grupo (`/`). Samuel (2026-09-21): el PIXIES animado e interactivo
// de /web también aquí (PixelCanvas, con menos partículas — divisor 16 — para que cargue
// liviano), "Design Group" + "Bogotá · alcance global" tal cual, y SIN las tarjetas M/W
// chicas: la selección de división es la bifurcación que viene justo debajo (GrupoSplit),
// a ancho completo y balanceada. Voz empresarial, nunca "yo". Sin portal del ingeniero
// ni "/digital·web·design": eso es identidad de la división Web.
export default function GrupoHero() {
  const { grupoHero } = t;
  return (
    <section id="inicio" className="grid-bg relative overflow-hidden">
      <Parallax speed={10} className="pointer-events-none absolute inset-0 z-0">
        <Atmosphere />
      </Parallax>
      <HeroGrid />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-void/40 via-transparent to-void" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 pt-20 pb-8 sm:items-start sm:px-6 sm:pb-12">
        <div className="relative mt-14 inline-block max-w-full sm:mt-[70px]">
          {/* tracking normal: a escala mosaico, el tight fusiona letras en el muestreo del canvas */}
          <h1 id="wordmark" className="font-display text-wordmark font-bold text-ink">
            {grupoHero.title}
          </h1>
          <PixelCanvas divisor={16} />
        </div>

        {/* "Design Group" en General Sans 600 (ya cargada, sin costo): registro más
            empresarial y neutro que el Clash Display de los titulares de sección. La misma
            pieza (.hero-titulo) se replica en "Creative" (/marketing). */}
        <p className="hero-in hero-titulo mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1" style={{ '--d': '0.9s' } as React.CSSProperties}>
          <span className="hero-titulo__nombre">{grupoHero.subtitle}</span>
          <span className="hero-titulo__kicker">{grupoHero.kicker}</span>
        </p>

        <p className="hero-in mt-5 max-w-[34ch] text-center text-[1.1rem] leading-snug text-ink sm:text-left sm:text-xl" style={{ '--d': '1.0s' } as React.CSSProperties}>
          {grupoHero.tesis}
        </p>

        <div className="hero-in mt-7 flex flex-wrap items-center justify-center gap-3 sm:justify-start" style={{ '--d': '1.1s' } as React.CSSProperties}>
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
