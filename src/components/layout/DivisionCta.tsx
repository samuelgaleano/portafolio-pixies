'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DIVISIONES, divisionDeRuta } from '@/lib/division';

// CTA del header, con el texto y el color de la división activa (mockup: "Hablemos de tu
// embudo" en ámbar en Marketing, "Cuéntame el proceso" en violeta en Web). Lleva al
// #contacto de la página actual (relativo), y el origen en data-desde para el LeadForm.
export default function DivisionCta() {
  const activa = divisionDeRuta(usePathname());
  const { ctaHeader } = DIVISIONES[activa];
  return (
    <Link href="#contacto" data-desde="header" className="press btn-acento ml-1 flex min-h-11 items-center rounded-(--radius-s) px-3 font-medium">
      <span className="sm:hidden">Hablemos</span>
      <span className="hidden sm:inline">{ctaHeader}</span>
    </Link>
  );
}
