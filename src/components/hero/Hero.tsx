import Link from 'next/link';
import { t } from '@/i18n';
import PixelCanvas from './PixelCanvas';
import HeroGrid from './HeroGrid';

export default function Hero() {
  return (
    <section id="inicio" className="grid-bg relative flex min-h-svh flex-col justify-center overflow-hidden">
      <HeroGrid />
      {/* la retícula se desvanece hacia el contenido */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-void/40 via-transparent to-void"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pt-24 pb-20 sm:px-6">
        <div className="relative inline-block">
          <h1 id="wordmark" className="font-display text-hero font-bold tracking-tight text-ink">
            {t.hero.title}
          </h1>
          <PixelCanvas />
        </div>

        {/* el texto decorado con puntos medios se oculta a lectores; sr-only lleva el texto limpio */}
        <p className="hero-in mt-2 font-mono text-lg text-data sm:text-xl" style={{ '--d': '1.55s' } as React.CSSProperties}>
          <span aria-hidden="true">/{t.hero.subtitle.toLowerCase().replaceAll(' ', '·')}</span>
          <span className="sr-only">{t.hero.subtitle}</span>
        </p>

        <p className="hero-in mt-8 max-w-xl text-lg text-dim" style={{ '--d': '1.75s' } as React.CSSProperties}>
          {t.hero.bylinePre}{' '}
          <Link
            href="/samuel"
            className="font-medium text-ink underline decoration-pixel decoration-2 underline-offset-4 transition-colors hover:text-pixel-soft"
          >
            {t.hero.bylineName}
          </Link>
          {t.hero.bylinePost}
        </p>

        <div
          className="hero-in mt-12 flex flex-wrap items-center gap-x-10 gap-y-6"
          style={{ '--d': '1.95s' } as React.CSSProperties}
        >
          <a
            href="#contacto"
            data-desde="hero"
            className="rounded-(--radius-s) bg-signal px-6 py-3 font-semibold text-void transition hover:brightness-110"
          >
            {t.hero.cta}
          </a>

          {/* Foto de Samuel: mosaico pixelado placeholder hasta tener [FOTO_SAMUEL] */}
          <Link href="/samuel" className="group flex items-center gap-4">
            <span
              className="block size-16 rounded-(--radius-s) border border-line transition-transform group-hover:scale-105 sm:size-20"
              style={{
                backgroundImage:
                  'conic-gradient(var(--color-surface-2) 25%, var(--color-line) 0 50%, var(--color-surface-2) 0 75%, var(--color-line) 0), linear-gradient(color-mix(in srgb, var(--color-pixel) 20%, transparent), color-mix(in srgb, var(--color-pixel) 20%, transparent))',
                backgroundSize: '16px 16px, 100% 100%',
              }}
              aria-hidden="true"
            />
            <span>
              <span className="block font-medium text-ink">{t.hero.bylineName}</span>
              <span className="block font-mono text-xs text-dim">
                {t.hero.photoPlaceholder} ·{' '}
                <span className="text-pixel-soft group-hover:underline">{t.hero.photoCta} →</span>
              </span>
            </span>
          </Link>
        </div>
      </div>

      <a
        href="#portafolio"
        className="hero-in absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-dim transition-colors hover:text-ink"
        style={{ '--d': '2.3s' } as React.CSSProperties}
      >
        <span className="cue-pixel mx-auto mb-2 block size-2 bg-pixel" aria-hidden="true" />
        {t.hero.scroll}
      </a>
    </section>
  );
}
