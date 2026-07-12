import { t } from '@/i18n';
import { skillDomains, depthLabel, type Depth } from '@/data/skills';

// Capacidades por dominio con etiquetas honestas de profundidad (§7.3), no barras de progreso.
const depthClass: Record<Depth, string> = {
  produccion: 'text-ok',
  solido: 'text-data',
  explorando: 'text-dim',
};

export default function SkillDomains() {
  return (
    <section className="border-t border-line">
      <div data-reveal className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <h2 className="font-display text-h2 font-semibold">{t.samuel.skillsTitle}</h2>
        <p className="mt-3 max-w-xl text-dim">{t.samuel.skillsIntro}</p>

        <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs">
          <span className="text-ok">● {depthLabel.produccion}</span>
          <span className="text-data">● {depthLabel.solido}</span>
          <span className="text-dim">● {depthLabel.explorando}</span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {skillDomains.map((d) => (
            <div key={d.id} className="rounded-(--radius-m) border border-line bg-surface p-5">
              <h3 className="font-display text-lg font-semibold text-ink">{d.title}</h3>
              <p className="mt-1 text-sm text-dim">{d.blurb}</p>
              <ul className="mt-4 flex flex-col gap-2 font-mono text-xs">
                {d.items.map((it) => (
                  <li
                    key={it.name}
                    className="flex items-baseline justify-between gap-3 border-t border-line/60 pt-2"
                  >
                    <span className="text-ink">{it.name}</span>
                    <span className={`shrink-0 ${depthClass[it.depth]}`}>{depthLabel[it.depth]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
