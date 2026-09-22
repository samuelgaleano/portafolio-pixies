'use client';

import { useEffect, useRef } from 'react';

// Retícula pixel reactiva al cursor (plan F6 V4): extiende la firma del hero. Las celdas
// cercanas al mouse se iluminan en violeta. Solo desktop (pointer fino), off con
// reduced-motion, rAF únicamente mientras el mouse se mueve (idle = 0 trabajo).
// Cada frame limpia SOLO la caja del halo anterior (no el canvas entero del hero: a DPR 2
// eran ~5 MP borrados y resubidos por cada movimiento del mouse — Samuel, 2026-09-22).
const CELL = 32; // coincide con .grid-bg
const RADIUS = 140;
const DPR_MAX = 1.5;

export default function HeroGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!matchMedia('(pointer: fine)').matches) return; // sin puntero fino: la .grid-bg estática basta

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rootCss = getComputedStyle(document.documentElement);
    const pixel = rootCss.getPropertyValue('--color-pixel').trim() || '#7c5cff';
    const dpr = Math.min(devicePixelRatio || 1, DPR_MAX);
    let w = 0;
    let h = 0;
    let mouse = { x: -9999, y: -9999 };
    let prev = { x: -9999, y: -9999 }; // dónde se pintó el halo la última vez
    let raf = 0;

    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      prev = { x: -9999, y: -9999 }; // cambiar el buffer lo deja en blanco: no hay nada que borrar
    };
    resize();

    const draw = () => {
      raf = 0;
      // borra solo la caja del halo anterior (+ margen del punto de 3px); el resto del canvas
      // ya está transparente y no hace falta tocarlo
      const box = RADIUS + CELL + 4;
      if (prev.x > -9999) ctx.clearRect(prev.x - box, prev.y - box, box * 2, box * 2);
      prev = mouse;
      // solo las celdas dentro del RADIUS del mouse (no todo el grid) → mucho menos trabajo/frame
      const cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);
      const i0 = Math.max(0, Math.floor((mouse.x - RADIUS) / CELL));
      const i1 = Math.min(cols, Math.ceil((mouse.x + RADIUS) / CELL));
      const j0 = Math.max(0, Math.floor((mouse.y - RADIUS) / CELL));
      const j1 = Math.min(rows, Math.ceil((mouse.y + RADIUS) / CELL));
      ctx.fillStyle = pixel;
      for (let i = i0; i <= i1; i++) {
        for (let j = j0; j <= j1; j++) {
          const x = i * CELL;
          const y = j * CELL;
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          if (d > RADIUS) continue;
          ctx.globalAlpha = (1 - d / RADIUS) * 0.5;
          ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
      }
      ctx.globalAlpha = 1;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    // rect cacheado (no un getBoundingClientRect por pointermove: forzaba un reflow por evento)
    let rect = parent.getBoundingClientRect();
    const refreshRect = () => {
      rect = parent.getBoundingClientRect();
    };
    const onMove = (e: PointerEvent) => {
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      schedule();
    };
    const onLeave = () => {
      mouse = { x: -9999, y: -9999 };
      schedule();
    };
    const onResize = () => {
      resize();
      refreshRect();
    };

    parent.addEventListener('pointermove', onMove, { passive: true });
    parent.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', refreshRect, { passive: true });
    return () => {
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', refreshRect);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" />;
}
