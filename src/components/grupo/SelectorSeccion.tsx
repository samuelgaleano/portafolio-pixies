import { t } from '@/i18n';

// Selector de sección de la home (Samuel, 2026-09-22): "un selector de sección súper
// pequeño, seccionado como el de las landing pages, solo para seleccionar y dirigir ahí".
// Mismo lenguaje que el selector de división del header —un segmentado chiquito— pero sin
// estado: son anclas puras que saltan a su sección. Server component, cero JS.
export default function SelectorSeccion() {
  return (
    <nav className="sel-seccion" aria-label={t.grupoHero.secciones.label}>
      {t.grupoHero.secciones.items.map((s) => (
        <a key={s.id} href={`#${s.id}`} className="sel-seccion__opt">
          <span className="sel-seccion__punto" aria-hidden="true" />
          {s.etiqueta}
        </a>
      ))}
    </nav>
  );
}
