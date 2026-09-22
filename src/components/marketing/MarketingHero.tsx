import Link from 'next/link';
import { t } from '@/i18n';
import PixelCanvas from '@/components/hero/PixelCanvas';
import HeroFirma from '@/components/hero/HeroFirma';
import HeroGrid from '@/components/hero/HeroGrid';

// Hero de /marketing = Pixies Creative. Misma estructura que el hero del grupo (Samuel,
// 2026-09-21: cohesión): el PIXIES animado (PixelCanvas; el destello toma el ámbar del
// entorno vía --wm-flick, ver globals.css), "Creative" en la misma pieza tipográfica que
// "Design Group" (.hero-titulo), el tagline textual de Samuel, y las tarjetas M/W compactas
// (la M fija en corazón: división activa). Voz empresarial. El <h1> es "Pixies Creative".
export default function MarketingHero() {
  const { marketing } = t;
  return (
    <section id="inicio" className="grid-bg relative overflow-hidden border-b border-line">
      <HeroGrid />
      {/* lavado ámbar leve arriba a la derecha: la pista de entorno del mockup */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(60% 45% at 85% 0%, color-mix(in srgb, var(--color-marketing) 16%, transparent), transparent 70%)' }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-void/40 via-transparent to-void" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 pt-20 pb-8 sm:items-start sm:px-6 sm:pb-12">
        <div className="relative mt-14 inline-block max-w-full sm:mt-[70px]">
          <p id="wordmark" className="font-display text-wordmark font-bold text-ink" aria-hidden="true">
            PIXIES
          </p>
          <PixelCanvas divisor={16} />
        </div>

        <h1 className="hero-in hero-titulo mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1" style={{ '--d': '0.5s' } as React.CSSProperties}>
          <span className="sr-only">Pixies </span>
          <span className="hero-titulo__nombre">Creative</span>
          <span className="hero-titulo__kicker text-[color:var(--color-marketing-texto)]">{marketing.kicker}</span>
        </h1>
        {/* tagline literal de Samuel (2026-09-21) */}
        <p className="hero-in mt-2 text-center font-mono text-sm text-dim sm:text-left sm:text-base" style={{ '--d': '0.6s' } as React.CSSProperties}>
          {marketing.tagline}
        </p>

        <div className="hero-in mt-5 flex w-full justify-center sm:justify-start" style={{ '--d': '0.65s' } as React.CSSProperties}>
          <HeroFirma activa="creative" compacta />
        </div>

        {/* hero-in (CSS) y no data-reveal: era el LCP de /marketing y quedaba oculto hasta que
            hidrataba el observer (+4 s en móvil según Lighthouse, 2026-09-22) */}
        <p className="hero-in mt-6 max-w-[34ch] text-center text-[1.1rem] leading-snug text-ink sm:text-left sm:text-xl" style={{ '--d': '0.75s' } as React.CSSProperties}>
          {marketing.tesis}
        </p>

        {/* Tres frentes con dueño (2026-09-22): quién responde por campañas y redes (Isabela),
            marca (Edison) y crecimiento/datos (Samuel), antes de pedir nada. El tercero lleva el
            violeta de Web: Samuel es el respaldo técnico del grupo. */}
        <ul className="hero-frentes hero-in" style={{ '--d': '0.85s' } as React.CSSProperties} aria-label="Quién lidera cada frente">
          {marketing.frentes.map((f) => (
            <li key={f.area} className={`hero-frente hero-frente--${f.lado}`}>
              <span className="hero-frente__area">{f.area}</span>
              <span className="hero-frente__quien">{f.quien}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="#contacto"
            data-desde="marketing-hero"
            className="inline-flex min-h-12 items-center rounded-(--radius-s) press px-6 font-semibold"
            style={{ background: 'var(--color-marketing)', color: 'var(--color-ink)' }}
          >
            {marketing.cta}
          </Link>
          <a href="#areas" className="link-draw font-mono text-sm text-dim">
            {marketing.ctaAreas}
          </a>
        </div>
      </div>
    </section>
  );
}
