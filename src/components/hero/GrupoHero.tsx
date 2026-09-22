import Link from 'next/link';
import { t } from '@/i18n';
import PixelCanvas from './PixelCanvas';
import HeroGrid from './HeroGrid';
import DivisionGlyph from './DivisionGlyph';
import Atmosphere from '@/components/fx/Atmosphere';
import Parallax from '@/components/fx/Parallax';

// Hero de la landing del grupo (`/`). El PIXIES animado e interactivo (PixelCanvas),
// "Design Group" y "Bogotá · alcance global". Voz empresarial, nunca "yo". Sin portal del
// ingeniero ni "/digital·web·design": eso es identidad de la división Web.
//
// Estructura (Samuel, 2026-09-22 · 2ª ronda): el primer frame tiene que mostrar, sin
// desplazar, **logo → H2 → eslogan → una sola acción**, y usar los espacios laterales que
// quedaban vacíos: **Creative a la izquierda, Web a la derecha** (rejilla de 3 columnas en
// escritorio, apilada en móvil). Los accesos son compactos a propósito: el detalle de cada
// división vive en la bifurcación de abajo, aquí solo se entra. El grupo sigue al centro.
export default function GrupoHero() {
  const { grupoHero } = t;
  const { accesos } = grupoHero;
  return (
    <section id="inicio" className="grid-bg relative overflow-hidden">
      <Parallax speed={10} className="pointer-events-none absolute inset-0 z-0">
        <Atmosphere variant="grupo" />
      </Parallax>
      <HeroGrid />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-void/40 via-transparent to-void" aria-hidden="true" />

      <div className="grupo-hero relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        {/* izquierda: Creative */}
        <Link
          href="/marketing"
          data-glyph-host
          className="acceso acceso--creative hero-in"
          style={{ '--d': '0.5s' } as React.CSSProperties}
        >
          <DivisionGlyph letra="C" variant="marketing" className="acceso__glyph" />
          <span className="acceso__nombre">{accesos.creative.etiqueta}</span>
          <span className="acceso__que">{accesos.creative.que}</span>
          <span className="acceso__ir" aria-hidden="true">
            {accesos.creative.ir} →
          </span>
        </Link>

        {/* centro: la marca del grupo */}
        <div className="grupo-hero__marca">
          <div className="relative mx-auto inline-block max-w-full">
            <h1 id="wordmark" className="font-display text-wordmark font-bold text-ink">
              {grupoHero.title}
            </h1>
            <PixelCanvas />
          </div>

          {/* "Design Group" en General Sans 600 (ya cargada, sin costo): registro más
              empresarial y neutro que el Clash Display de los titulares de sección. */}
          <p className="hero-in hero-titulo mt-2 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1" style={{ '--d': '0.3s' } as React.CSSProperties}>
            <span className="hero-titulo__nombre">{grupoHero.subtitle}</span>
            <span className="hero-titulo__kicker">{grupoHero.kicker}</span>
          </p>

          <p className="hero-in grupo-hero__eslogan" style={{ '--d': '0.4s' } as React.CSSProperties}>
            {grupoHero.tesis}
          </p>

          <div className="hero-in mt-6 flex flex-col items-center gap-2" style={{ '--d': '0.5s' } as React.CSSProperties}>
            <a href="#contacto" data-desde="grupo-hero" className="hero-cta press">
              <span>{grupoHero.cta}</span>
              <span className="hero-cta__arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a href="#proceso" className="link-draw font-mono text-xs text-dim">
              {grupoHero.ctaSecundario}
            </a>
          </div>
        </div>

        {/* derecha: Web */}
        <Link href="/web" data-glyph-host className="acceso acceso--web hero-in" style={{ '--d': '0.5s' } as React.CSSProperties}>
          <DivisionGlyph letra="W" variant="web" className="acceso__glyph" />
          <span className="acceso__nombre">{accesos.web.etiqueta}</span>
          <span className="acceso__que">{accesos.web.que}</span>
          <span className="acceso__ir" aria-hidden="true">
            {accesos.web.ir} →
          </span>
        </Link>
      </div>
    </section>
  );
}
