'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { divisionDeRuta } from '@/lib/division';

// Hilo de color por entorno (mockup 15-final-ajustado.html → producción). Dos cosas:
// 1. Mantiene `data-division` en <html> al navegar en cliente (el primer pintado lo pone el
//    script inline de layout.tsx, antes de hidratar, para que no haya flash de color).
//    globals.css deriva --acento/--acento-texto/--acento-suave de ese atributo.
// 2. El "gesto de unificación" del mockup: al cambiar de división, un barrido con el color
//    del entorno de DESTINO cruza la pantalla (0.14 de opacidad, nunca tapa el contenido).
//    Se re-monta por navegación para re-correr la animación; no corre en la carga inicial.
export default function DivisionSync() {
  const pathname = usePathname();
  const [barrido, setBarrido] = useState(0);
  const primera = useRef(true);

  useEffect(() => {
    document.documentElement.dataset.division = divisionDeRuta(pathname);
    if (primera.current) {
      primera.current = false;
      return;
    }
    setBarrido((n) => n + 1);
  }, [pathname]);

  if (barrido === 0) return null;
  return <div key={barrido} className="hilo-transicion" aria-hidden="true" />;
}
