// Capa de atmósfera premium (aditiva): dos halos de marca + viñeteado OPCIONAL. Puramente
// decorativa — aria-hidden y pointer-events:none. Va detrás del contenido (z-0); en el hero
// se coloca ANTES del canvas para pintar debajo. Estilos/animaciones en globals.css.
//
// vignette: para secciones sin su propio degradado de borde (el hero ya oscurece, ahí false).
// animate: en el hero los halos respiran; en otras secciones se usa `animate={false}` para
//   una presencia estática y más tenue (cohesión "cara" sin recargar de movimiento ni GPU).
// variant: 'grupo' pinta el halo izquierdo en ámbar (Creative) y el derecho en violeta
//   (Web) — la gramática espacial del grupo, dicha desde el fondo (2026-09-22).
export default function Atmosphere({
  vignette = false,
  animate = true,
  variant,
}: {
  vignette?: boolean;
  animate?: boolean;
  variant?: 'grupo';
}) {
  const clase = ['atmosphere', animate ? '' : 'atmosphere--static', variant ? `atmosphere--${variant}` : ''].filter(Boolean).join(' ');
  return (
    <div className={clase} aria-hidden="true">
      {vignette && <span className="vignette" />}
    </div>
  );
}
