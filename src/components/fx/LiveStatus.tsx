'use client';

import { useEffect, useState } from 'react';
import { bogotaTime } from '@/lib/clock';
import { t } from '@/i18n';

// Reloj vivo de Bogotá (spec capa-viva, referencia WAIRK/Kargo/Barbiana): el sitio
// se siente como un sistema encendido. SSR pinta el placeholder; el tick arranca al
// montar (sin JS queda el placeholder, que sigue siendo verdad: gmt-5 no cambia).
export default function LiveStatus() {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const tick = () => setTime(bogotaTime(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="font-mono text-xs text-dim">
      {t.status.city} · <span className="text-data tabular-nums">{time}</span> · gmt-5 ·{' '}
      <span className="text-ok">●</span> {t.status.available}
    </p>
  );
}
