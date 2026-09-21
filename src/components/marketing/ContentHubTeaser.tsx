import { t } from '@/i18n';
import Pending from '@/components/ui/Pending';

// Producto propio (Pixies\_core\PRODUCTOS.md): Content Hub, en uso interno — mismo
// patrón de bloque oscuro que .cubo--tinta / #s-producto del mockup 15-final-ajustado.html.
export default function ContentHubTeaser() {
  const { producto } = t.marketing;
  return (
    <section className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <div data-reveal className="rounded-(--radius-m) p-8 sm:p-10" style={{ background: 'var(--color-code)' }}>
          <h2 className="font-display text-h2 font-semibold text-white">{producto.title}</h2>
          <p className="mt-3 max-w-xl text-white/75">{producto.lead}</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {producto.specs.map((s, i) => (
              <li key={s} className="flex items-center gap-2 font-mono text-sm text-white/85">
                <span className="text-xs" style={{ color: 'var(--color-marketing)' }}>
                  0{i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Pending>{producto.estado}</Pending>
          </p>
        </div>
      </div>
    </section>
  );
}
