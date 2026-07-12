'use client';

import { usePathname } from 'next/navigation';

// Transición de página (plan F6 V1, enfoque robusto). La API nativa View Transitions
// aún es experimental/undefined en React 19.2, así que se resuelve con una animación CSS
// keyed por ruta: al navegar, el contenido entra con un fade. reduced-motion la neutraliza.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
