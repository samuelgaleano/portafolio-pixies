import { t } from '@/i18n';
import PixelCanvas from './PixelCanvas';
import HeroGrid from './HeroGrid';
import EngineerPortal from './EngineerPortal';
import Atmosphere from '@/components/fx/Atmosphere';
import Parallax from '@/components/fx/Parallax';

export default function Hero() {
  return (
    <section id="inicio" className="grid-bg relative overflow-hidden">
      {/* atmósfera premium detrás del canvas, con deriva sutil al hacer scroll (GSAP) */}
      <Parallax speed={10} className="pointer-events-none absolute inset-0 z-0">
        <Atmosphere />
      </Parallax>
      <HeroGrid />
      {/* la retícula se desvanece hacia el contenido */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-void/40 via-transparent to-void"
        aria-hidden="true"
      />

      {/* altura natural + poco padding inferior (Samuel r8): que "Proyectos que ya corren"
          empiece justo después de los botones, sin el hueco vacío */}
      {/* composición CENTRADA (Samuel r19): el wordmark PIXIES centrado en la página, subtítulo
          centrado, y la fila CTA + botón del ingeniero centrada como grupo (el botón deja de
          estar pegado a la derecha → más hacia la izquierda). Todo alineado al centro. */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 pt-20 pb-6 sm:items-start sm:px-6 sm:pb-[7rem]">
        {/* wordmark alineado a la IZQUIERDA (Samuel r21) arrancando ALTO (en la "línea roja" que
            marcó Samuel). La tarjeta del ingeniero se ancla a su esquina inferior-derecha y roza la
            "S" (.eng-dock), equilibrando la derecha. Todo el bloque sube junto con este margen. */}
        <div className="relative mt-14 inline-block max-w-full sm:mt-[70px]">
          {/* tracking normal: a escala mosaico, el tight fusiona letras en el muestreo del canvas */}
          <h1 id="wordmark" className="font-display text-wordmark font-bold text-ink">
            {t.hero.title}
          </h1>
          <PixelCanvas />
          {/* desktop: portal encajado en la esquina de la "S"; en móvil va en la fila CTA (intacto) */}
          <div className="eng-dock hidden sm:block">
            <EngineerPortal />
          </div>
        </div>

        {/* el texto decorado con puntos medios se oculta a lectores; sr-only lleva el texto limpio */}
        {/* stagger corto: Casey scrollea a los ~1.5s; el contenido no puede llegar tarde */}
        <p className="hero-in mt-3 text-center font-mono text-lg text-data sm:text-left sm:text-xl" style={{ '--d': '0.9s' } as React.CSSProperties}>
          <span aria-hidden="true">/{t.hero.subtitle.toLowerCase().replaceAll(' ', '·')}</span>
          <span className="sr-only">{t.hero.subtitle}</span>
        </p>

        <div
          className="hero-in mt-8 flex flex-col items-center gap-4 sm:mt-8 sm:flex-row sm:justify-start sm:gap-6"
          style={{ '--d': '1.05s' } as React.CSSProperties}
        >
          <a href="#contacto" data-desde="hero" className="hero-cta press">
            <span>{t.hero.cta}</span>
            <span className="hero-cta__arrow" aria-hidden="true">
              →
            </span>
          </a>

          {/* botón disruptivo → /samuel: en MÓVIL va aquí (fila CTA); en desktop se muestra
              encajado en la "S" del wordmark (arriba). El wipe lo dispara el interceptor global. */}
          <div className="sm:hidden">
            <EngineerPortal />
          </div>
        </div>
      </div>
    </section>
  );
}
