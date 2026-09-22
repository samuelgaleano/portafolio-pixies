import { t } from '@/i18n';

// Tabla ✕/✓ (SECCION-MARKETING.md §Promesa): lo que suele pasar vs. lo que hacemos (voz
// empresarial de Creative: plural).
export default function Comparativa() {
  const { comparativa } = t.marketing;
  return (
    <section id="comparativa" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <h2 data-reveal="wipe" className="mb-8 font-display text-h2 font-semibold">
          {comparativa.title} <mark className="rounded-(--radius-s) px-1" style={{ background: 'var(--color-marketing)' }}>{comparativa.titleEm}</mark>{' '}
          {comparativa.titleEnd}
        </h2>
        <table data-reveal className="w-full border-collapse overflow-hidden rounded-(--radius-m) border border-line">
          <thead>
            <tr className="bg-surface-2 text-left">
              <th scope="col" className="border-b border-line px-4 py-3 font-mono text-xs uppercase tracking-wide text-dim">
                {comparativa.colMalo}
              </th>
              <th scope="col" className="border-b border-line px-4 py-3 font-mono text-xs uppercase tracking-wide text-dim">
                {comparativa.colBueno}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparativa.filas.map((f) => (
              <tr key={f.malo} className="border-b border-line last:border-0">
                <td className="px-4 py-3 align-top text-sm text-dim">
                  <span className="mr-2 text-err" aria-hidden="true">✕</span>
                  {f.malo}
                </td>
                <td className="px-4 py-3 align-top text-sm text-ink">
                  <span className="mr-2 text-ok" aria-hidden="true">✓</span>
                  {f.bueno}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
