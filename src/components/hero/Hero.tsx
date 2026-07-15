import { t } from '@/i18n';
import { categories } from '@/data/categories';
import PixelCanvas from './PixelCanvas';
import HeroGrid from './HeroGrid';
import EngineerSignature from './EngineerSignature';

export default function Hero() {
  return (
    <section id="inicio" className="grid-bg relative flex min-h-svh flex-col justify-center overflow-hidden">
      <HeroGrid />
      {/* la retícula se desvanece hacia el contenido */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-void/40 via-transparent to-void"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pt-20 pb-24 sm:px-6">
        <div className="relative inline-block max-w-full">
          {/* tracking normal: a escala mosaico, el tight fusiona letras en el muestreo del canvas */}
          <h1 id="wordmark" className="font-display text-wordmark font-bold text-ink">
            {t.hero.title}
          </h1>
          <PixelCanvas />
        </div>

        {/* el texto decorado con puntos medios se oculta a lectores; sr-only lleva el texto limpio */}
        {/* stagger corto: Casey scrollea a los ~1.5s; el contenido no puede llegar tarde */}
        <p className="hero-in mt-3 font-mono text-lg text-data sm:text-xl" style={{ '--d': '0.9s' } as React.CSSProperties}>
          <span aria-hidden="true">/{t.hero.subtitle.toLowerCase().replaceAll(' ', '·')}</span>
          <span className="sr-only">{t.hero.subtitle}</span>
        </p>

        {/* firma interactiva → /samuel: reemplaza el byline plano por la cita del ingeniero */}
        <EngineerSignature />

        <div
          className="hero-in mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
          style={{ '--d': '1.2s' } as React.CSSProperties}
        >
          <a
            href="#contacto"
            data-desde="hero"
            className="rounded-(--radius-s) bg-signal px-6 py-3 font-semibold text-void transition hover:brightness-110"
          >
            {t.hero.cta}
          </a>

          {/* sustancia real en lugar del placeholder de foto: lo que Pixies construye */}
          <nav aria-label={t.hero.chipsLabel} className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="flex min-h-11 items-center rounded-(--radius-s) border border-line px-3 font-mono text-xs text-dim transition-colors hover:border-pixel hover:text-ink sm:min-h-9"
              >
                {c.heroLabel}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <a
        href="#portafolio"
        className="hero-in absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-dim transition-colors hover:text-ink"
        style={{ '--d': '1.5s' } as React.CSSProperties}
      >
        <span className="cue-pixel mx-auto mb-2 block size-2 bg-pixel" aria-hidden="true" />
        {t.hero.scroll}
      </a>
    </section>
  );
}
