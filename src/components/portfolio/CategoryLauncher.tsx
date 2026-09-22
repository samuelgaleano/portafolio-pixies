import { categories } from '@/data/categories';
import { t } from '@/i18n';

// Catálogo del portafolio. Samuel (2026-09-22 · 2ª ronda): "hacer un catálogo mucho más
// óptimo, con íconos, mucho más concreto, títulos directos, para que cuando quieran ver
// algo puedan oprimirlo de una vez y no sea un catálogo tan extenso ni poco práctico".
//
// Antes: tile con glifo genérico, título de categoría y un párrafo de descripción, más una
// previa en imagen al hover (siete imágenes cargando para un menú). Ahora: **ícono en
// píxeles propio de cada categoría** (mismo lenguaje del wordmark), **título directo** en
// las palabras del cliente ("Quiero una página que venda") y una línea de **evidencia**
// concreta de lo que hay dentro. Sin imágenes: el catálogo es un menú, no una galería —
// las capturas viven en las secciones. Server component, cero JS.
export default function CategoryLauncher() {
  return (
    <nav aria-label={t.portfolio.navLabel} className="catalogo-menu">
      {categories.map((c) => (
        <a key={c.id} href={`#${c.id}`} className="catalogo-item">
          <span className="catalogo-item__icono" aria-hidden="true">
            {c.icono.map((fila, y) =>
              fila.split('').map((bit, x) => <i key={`${y}-${x}`} className={bit === '1' ? 'on' : undefined} />)
            )}
          </span>
          <span className="catalogo-item__texto">
            <span className="catalogo-item__titulo">{c.corto}</span>
            <span className="catalogo-item__evidencia">{c.evidencia}</span>
          </span>
          <span className="catalogo-item__flecha" aria-hidden="true">
            →
          </span>
          <span className="sr-only">{c.title}</span>
        </a>
      ))}
    </nav>
  );
}
