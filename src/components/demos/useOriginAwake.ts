'use client';

import { useEffect, useState } from 'react';

// Sonda activa para demos CROSS-ORIGIN en Render (plan free: duermen a los 15 min y
// tardan en despertar). Existe porque un iframe cross-origin dispara 'load' incluso
// cuando la conexión falla — no sirve como señal de "ya cargó". Ese bug real dejaba el
// marco de la demo de TV en blanco: el skeleton se ocultaba de inmediato creyendo que
// había terminado. Aquí se confirma que el origen YA responde antes de montar el
// iframe de verdad. Reutilizable para cualquier demo cross-origin futura — las que van
// proxeadas same-origin (POS, ERP) no lo necesitan: ahí sí es fiable leer
// contentDocument.readyState.
const PROBE_INTERVAL_MS = 2500;
const MAX_WAIT_MS = 90000;

export function useOriginAwake(origin: string | null): boolean {
  const [awake, setAwake] = useState(false);

  useEffect(() => {
    if (!origin) return;
    let cancelled = false;
    let timer = 0;
    const startedAt = Date.now();

    const probe = async () => {
      try {
        // no-cors: la respuesta queda opaca (no se puede leer), pero que la promesa
        // resuelva ya confirma un handshake TCP/TLS/HTTP exitoso con el origen.
        await fetch(origin, { mode: 'no-cors', cache: 'no-store' });
        if (!cancelled) setAwake(true);
        return;
      } catch {
        // sigue dormido o la red falló — se reintenta hasta agotar el margen
      }
      if (cancelled) return;
      if (Date.now() - startedAt < MAX_WAIT_MS) {
        timer = window.setTimeout(probe, PROBE_INTERVAL_MS);
      } else {
        // margen agotado: se muestra el iframe de todos modos (fail-open) — mejor
        // arriesgarse a un error visible que dejar al visitante esperando para siempre.
        setAwake(true);
      }
    };

    probe();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [origin]);

  return awake;
}
