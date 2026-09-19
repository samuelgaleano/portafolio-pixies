import { t } from '@/i18n';
import type { EscuchaArea, EscuchaCitedItem, EscuchaStructured } from '@/lib/escucha';

// Renderer del contexto estructurado (§ plan "productos propios"): UN SOLO componente para
// el ejemplo curado y para el resultado en vivo, así ambas vistas tienen la misma calidad
// visual — ni la demo se siente "menos real" ni el ejemplo se siente "de mentira".
const LISTS: { key: keyof Pick<EscuchaArea, 'decisiones' | 'tareas' | 'riesgos' | 'conceptos' | 'noSeSabe'>; labelKey: keyof typeof t.escucha; color: string }[] = [
  { key: 'decisiones', labelKey: 'areaDecisiones', color: 'text-ok' },
  { key: 'tareas', labelKey: 'areaTareas', color: 'text-pixel-soft' },
  { key: 'riesgos', labelKey: 'areaRiesgos', color: 'text-err' },
  { key: 'conceptos', labelKey: 'areaConceptos', color: 'text-data' },
  { key: 'noSeSabe', labelKey: 'areaNoSeSabe', color: 'text-dim' },
];

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function CitedList({ items, onCiteClick }: { items: EscuchaCitedItem[]; onCiteClick?: (seconds: number) => void }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex flex-wrap items-baseline gap-2 text-sm leading-relaxed text-ink/90">
          <span className="text-pixel" aria-hidden="true">
            ▸
          </span>
          <span>{item.texto}</span>
          {item.citas.map((s, j) => (
            <button
              key={j}
              type="button"
              onClick={() => onCiteClick?.(s)}
              disabled={!onCiteClick}
              className="rounded-(--radius-s) border border-line px-1.5 py-0.5 font-mono text-[0.7rem] text-data [font-variant-numeric:tabular-nums] transition-colors enabled:hover:border-pixel enabled:hover:text-pixel-soft disabled:opacity-70"
            >
              {formatTime(s)}
            </button>
          ))}
        </li>
      ))}
    </ul>
  );
}

export default function EscuchaResultView({
  structured,
  onCiteClick,
}: {
  structured: EscuchaStructured;
  onCiteClick?: (seconds: number) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-dim">{t.escucha.resumenLabel}</p>
        <p className="mt-1 text-ink">{structured.resumen}</p>
      </div>

      {structured.areas.map((area, i) => (
        <article key={i} className="rounded-(--radius-m) border border-line bg-surface p-4 md:p-5">
          <h3 className="font-display text-base font-semibold text-ink">{area.nombre}</h3>
          <div className="mt-3 flex flex-col gap-4">
            {LISTS.map(({ key, labelKey, color }) =>
              area[key].length > 0 ? (
                <div key={key}>
                  <p className={`font-mono text-[0.7rem] uppercase tracking-wide ${color}`}>{t.escucha[labelKey]}</p>
                  <div className="mt-2">
                    <CitedList items={area[key]} onCiteClick={onCiteClick} />
                  </div>
                </div>
              ) : null
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
