import { t } from '@/i18n';

export default function Manifesto() {
  return (
    <section className="grid-bg border-b border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-24 sm:px-6">
        <p className="font-mono text-sm text-data">{t.samuel.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-hero font-bold leading-[0.95] text-ink">
          {t.samuel.manifestoTitle}
        </h1>
        <p className="mt-8 max-w-xl text-lg text-dim">{t.samuel.manifesto}</p>
      </div>
    </section>
  );
}
