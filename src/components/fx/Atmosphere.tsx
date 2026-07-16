// Capa de atmósfera premium (aditiva): dos halos de marca + viñeteado OPCIONAL. Puramente
// decorativa — aria-hidden y pointer-events:none. Va detrás del contenido (z-0); en el hero
// se coloca ANTES del canvas para pintar debajo. Estilos/animaciones en globals.css.
//
// vignette: para secciones sin su propio degradado de borde (el hero ya oscurece, ahí false).
// animate: en el hero los halos respiran; en otras secciones se usa `animate={false}` para
//   una presencia estática y más tenue (cohesión "cara" sin recargar de movimiento ni GPU).
export default function Atmosphere({
  vignette = false,
  animate = true,
}: {
  vignette?: boolean;
  animate?: boolean;
}) {
  return (
    <div className={animate ? 'atmosphere' : 'atmosphere atmosphere--static'} aria-hidden="true">
      {vignette && <span className="vignette" />}
    </div>
  );
}
