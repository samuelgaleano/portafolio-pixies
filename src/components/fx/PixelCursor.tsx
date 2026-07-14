'use client';

import { useEffect, useRef } from 'react';

// Cursor píxel (spec capa-viva, referencia Heat Bureau/Kargo): un píxel violeta sigue
// el cursor con lerp; sobre interactivos se abre como marco [bracket]. Solo puntero
// fino, apagado con reduced-motion. `cursor: none` lo aplica la clase js-pixel-cursor
// SOLO cuando este componente monta: sin JS el cursor nativo queda intacto.
const LERP = 0.22;
const INTERACTIVE = 'a, button, input, select, textarea, label, [role="button"]';

export default function PixelCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!matchMedia('(pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.documentElement.classList.add('js-pixel-cursor');

    let raf = 0;
    let tx = -100;
    let ty = -100;
    let x = -100;
    let y = -100;

    const frame = () => {
      raf = 0;
      x += (tx - x) * LERP;
      y += (ty - y) * LERP;
      // translate centra el píxel; width/height animan por transición CSS
      el.style.transform = `translate3d(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px, 0)`;
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.3) raf = requestAnimationFrame(frame);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX;
      ty = e.clientY;
      el.classList.add('is-on');
      schedule();
    };
    const onOver = (e: PointerEvent) => {
      el.classList.toggle('is-link', !!(e.target as Element | null)?.closest?.(INTERACTIVE));
    };
    const onDown = () => el.classList.add('is-down');
    const onUp = () => el.classList.remove('is-down');
    const onLeaveDoc = () => el.classList.remove('is-on');

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeaveDoc);

    return () => {
      document.documentElement.classList.remove('js-pixel-cursor');
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeaveDoc);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div id="pixel-cursor" ref={ref} aria-hidden="true" />;
}
