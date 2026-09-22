'use client';

import { usePathname } from 'next/navigation';
import { DIVISIONES, divisionDeRuta } from '@/lib/division';

// Sufijo mono del logo: "pixies · design group" / "digital web design" / "creative" según
// la ruta (mockup: "pixies marketing" / "pixies design web"). Es la marca del GRUPO en el
// sitio donde el logo vive siempre; la división activa se lee al lado.
export default function DivisionSufijo() {
  const activa = divisionDeRuta(usePathname());
  return <span className="logo-sufijo hidden sm:inline">{DIVISIONES[activa].sufijo}</span>;
}
