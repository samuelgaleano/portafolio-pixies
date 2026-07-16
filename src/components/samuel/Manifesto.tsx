import { t } from '@/i18n';
import GradientText from '@/components/ui/GradientText';
import Atmosphere from '@/components/fx/Atmosphere';
import HeroGrid from '@/components/hero/HeroGrid';
import SocialLinks from './SocialLinks';

// Hero de /samuel (rediseño Samuel 2026-07-18; foto real r14): menos genérico. Titular fuerte +
// tagline + pruebas concretas (no adjetivos) + los accesos sociales 3D justo aquí, junto a lo
// relevante del ingeniero. Ahora con el RETRATO real de Samuel (antes monograma "SG").
export default function Manifesto() {
  return (
    <section className="grid-bg relative overflow-hidden border-b border-line">
      <Atmosphere />
      {/* retícula viva reactiva al cursor: la firma animada de Pixies, también aquí */}
      <HeroGrid />
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col-reverse items-start gap-10 px-4 py-24 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="w-full min-w-0 max-w-3xl">
          <p className="font-mono text-sm text-data">{t.samuel.eyebrow}</p>
          <h1 className="mt-4 font-display text-hero font-bold text-ink">
            <GradientText text={t.samuel.manifestoTitle} em="cerebro" />
          </h1>
          <p className="mt-3 font-mono text-sm text-pixel-soft">{t.samuel.manifestoTagline}</p>
          <p className="mt-6 max-w-xl text-lg text-dim">{t.samuel.manifesto}</p>

          {/* pruebas concretas en vez de adjetivos */}
          <ul className="mt-6 flex flex-wrap gap-2">
            {t.samuel.proof.map((p) => (
              <li
                key={p}
                className="inline-flex items-center gap-2 rounded-(--radius-s) border border-line bg-surface/60 px-3 py-1.5 font-mono text-xs text-ink"
              >
                <span className="inline-block size-1.5 bg-pixel" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>

          {/* accesos sociales 3D: suben aquí (antes iban en una sección "Hablemos" al final) */}
          <div className="mt-8">
            <SocialLinks />
          </div>
        </div>

        {/* retrato real de Samuel (r14): cuadro 3:4 redondeado con borde de marca + glow suave */}
        <figure className="shrink-0">
          <div
            className="w-44 overflow-hidden rounded-(--radius-m) border border-pixel/30 sm:w-56"
            style={{
              boxShadow: '0 24px 60px -28px color-mix(in srgb, var(--color-pixel) 55%, transparent)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/samuel/samuel-portrait.webp"
              alt="Samuel Galeano, ingeniero de sistemas detrás de Pixies"
              width={620}
              height={827}
              className="block aspect-[3/4] w-full object-cover object-top"
            />
          </div>
          <figcaption className="mt-3 font-mono text-xs text-dim">
            <span className="block font-medium text-ink">Samuel Galeano</span>
            {t.hero.photoRole}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
