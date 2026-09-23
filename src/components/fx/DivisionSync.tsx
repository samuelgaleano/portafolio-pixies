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
// 3. Movimiento de CÁMARA (Samuel, 2026-09-22): la transición tiene que sentirse como una
//    cámara que se desplaza hacia el lado de la división elegida. Creative vive a la
//    izquierda y Web a la derecha, así que se apunta la dirección en `data-hacia` de <html>
//    y el CSS mueve el barrido y la entrada de la página hacia ese lado, con su color.
const HACIA = { creative: 'izq', web: 'der', grupo: 'centro' } as const;

export default function DivisionSync() {
  const pathname = usePathname();
  const [barrido, setBarrido] = useState(0);
  const primera = useRef(true);

  useEffect(() => {
    const division = divisionDeRuta(pathname);
    document.documentElement.dataset.division = division;
    document.documentElement.dataset.hacia = HACIA[division];
    if (primera.current) {
      primera.current = false;
      return;
    }
    setBarrido((n) => n + 1);
  }, [pathname]);

  if (barrido === 0) return null;
  return <div key={barrido} className="hilo-transicion" aria-hidden="true" />;
}
