import { t } from '@/i18n';

// El hero de /samuel lleva la firma #2 del DESIGN: el retrato-mosaico pixelado.
// Cuando exista [FOTO_SAMUEL], este bloque la recibe con el reveal mosaico→nítida.
export default function Manifesto() {
  return (
    <section className="grid-bg border-b border-line">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col-reverse items-start gap-10 px-4 py-24 sm:px-6 md:flex-row md:items-end md:justify-between">
        {/* min-w-0: sin esto el titular fija el min-content del flex item y desborda en md/lg */}
        <div className="w-full min-w-0 max-w-3xl">
          <p className="font-mono text-sm text-data">{t.samuel.eyebrow}</p>
          <h1 className="mt-4 font-display text-hero font-bold text-ink">{t.samuel.manifestoTitle}</h1>
          <p className="mt-8 max-w-xl text-lg text-dim">{t.samuel.manifesto}</p>
        </div>

        {/* retrato-mosaico: firma pixelada #2 (critique P1 — la página necesitaba rostro) */}
        <figure className="shrink-0">
          <div
            className="size-40 rounded-(--radius-m) border border-line sm:size-52"
            style={{
              backgroundImage:
                'conic-gradient(var(--color-surface-2) 25%, var(--color-line) 0 50%, var(--color-surface-2) 0 75%, var(--color-line) 0), linear-gradient(color-mix(in srgb, var(--color-pixel) 24%, transparent), transparent)',
              backgroundSize: '20px 20px, 100% 100%',
            }}
            aria-hidden="true"
          />
          <figcaption className="mt-3 font-mono text-xs text-dim">
            <span className="block font-medium text-ink">Samuel Galeano</span>
            {t.hero.photoRole}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
