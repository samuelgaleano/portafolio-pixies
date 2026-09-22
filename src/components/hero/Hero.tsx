import { t } from '@/i18n';
import PixelCanvas from './PixelCanvas';
import HeroGrid from './HeroGrid';
import EngineerPortal from './EngineerPortal';
import HeroFirma from './HeroFirma';
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
        {/* wordmark alineado a la IZQUIERDA (Samuel r21) arrancando ALTO. La tarjeta del
            ingeniero queda debajo, a la derecha, sin solaparse (Samuel, 2026-09-22). */}
        <div className="relative mt-14 inline-block max-w-full sm:mt-[70px]">
          {/* tracking normal: a escala mosaico, el tight fusiona letras en el muestreo del canvas */}
          <h1 id="wordmark" className="font-display text-wordmark font-bold text-ink">
            {t.hero.title}
          </h1>
          <PixelCanvas />
        </div>

        {/* UNA sola fila bajo el wordmark (Samuel, 2026-09-22): antes el portal del ingeniero
            y la firma C/W ocupaban cada uno su propia franja horizontal con el resto vacío.
            Ahora el bloque de texto + accesos + CTA va a la izquierda y el portal a la
            derecha: la franja se llena y nada queda solo. En móvil se apila. */}
        <div className="hero-fila">
          <div className="hero-fila__texto">
            {/* el texto decorado con puntos medios se oculta a lectores; sr-only lleva el texto limpio */}
            <p className="hero-in text-center font-mono text-lg text-data sm:text-left sm:text-xl" style={{ '--d': '0.35s' } as React.CSSProperties}>
              <span aria-hidden="true">/{t.hero.subtitle.toLowerCase().replaceAll(' ', '·')}</span>
              <span className="sr-only">{t.hero.subtitle}</span>
            </p>

            {/* la firma C/W del grupo también aquí (W fija en cursor: esta es la división Web).
                Misma pieza que en / y /marketing — cohesión entre las 3 rutas. */}
            <div className="hero-in mt-3 flex justify-center sm:justify-start" style={{ '--d': '0.42s' } as React.CSSProperties}>
              <HeroFirma activa="web" compacta />
            </div>

            <div className="hero-in mt-6 flex justify-center sm:justify-start" style={{ '--d': '0.5s' } as React.CSSProperties}>
              <a href="#contacto" data-desde="hero" className="hero-cta press">
                <span>{t.hero.cta}</span>
                <span className="hero-cta__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* desktop: el portal comparte fila con el bloque de texto, a la derecha */}
          <div className="eng-dock hidden sm:block">
            <EngineerPortal />
          </div>
        </div>

        {/* móvil: el portal cierra el hero (en desktop va en la fila de arriba) */}
        <div className="mt-7 self-center sm:hidden">
          <EngineerPortal />
        </div>
      </div>
    </section>
  );
}
