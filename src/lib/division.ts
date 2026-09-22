// Modelo de las divisiones de Pixies Design Group (grupo-y-marketing, 2026-09).
// Una sola fuente para: qué división es una ruta, cómo se llama, qué color la identifica
// y a dónde lleva. Lo consumen el header (selector "ver como"), el atributo
// data-division de <html> (hilo de color por entorno, ver globals.css) y los heros.
export type Division = 'grupo' | 'web' | 'creative';

export interface DivisionInfo {
  id: Division;
  /** Sufijo mono junto al logo: "pixies · design group" */
  sufijo: string;
  /** Etiqueta corta del selector "ver como" */
  etiqueta: string;
  href: string;
  ctaHeader: string;
}

export const DIVISIONES: Record<Division, DivisionInfo> = {
  creative: { id: 'creative', sufijo: 'creative', etiqueta: 'Creative', href: '/marketing', ctaHeader: 'Hablemos de tu marca' },
  web: { id: 'web', sufijo: 'digital web design', etiqueta: 'Web', href: '/web', ctaHeader: 'Cuéntame el proceso' },
  grupo: { id: 'grupo', sufijo: 'design group', etiqueta: 'Grupo', href: '/', ctaHeader: 'Hablemos de tu proyecto' },
};

/** Orden del selector del header (Samuel, 2026-09-22): **el grupo va en la MITAD**, Creative a la
 * izquierda y Web a la derecha — la misma gramática espacial del resto del sitio, ahora también
 * en el selector (antes el grupo cerraba a la derecha y Web quedaba al centro). */
export const ORDEN_SELECTOR: Division[] = ['creative', 'grupo', 'web'];

export function divisionDeRuta(pathname: string | null | undefined): Division {
  // usePathname() no trae hash ni query, pero location.pathname tampoco; por si llega una
  // URL completa (tests, logs), se recorta antes de comparar.
  const p = (pathname ?? '/').split(/[?#]/)[0] || '/';
  if (p === '/marketing' || p.startsWith('/marketing/')) return 'creative';
  // /web, /demos/*, /proyectos/*, /aplicaciones/*, /samuel*: todo lo que ya existía es la división Web
  if (p === '/web' || /^\/(web|demos|proyectos|aplicaciones|samuel)(\/|$)/.test(p)) return 'web';
  return 'grupo';
}
