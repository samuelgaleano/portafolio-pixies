'use client';

import { useEffect, useRef } from 'react';

// Firma visual (§4.5 del plan): el wordmark se ensambla desde píxeles. Vanilla sobre canvas.
// Si falla, no hay JS o hay reduced-motion: el h1 real queda visible (nunca se oculta sin JS).
export default function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const h1 = document.getElementById('wordmark');
    const wrap = h1?.parentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canvas || !h1 || !wrap || reduce) return;

    h1.style.visibility = 'hidden';
    let raf = 0;
    const show = () => {
      h1.style.visibility = 'visible';
      canvas.classList.add('hidden');
    };
    // ponytail: watchdog — si fuentes/canvas fallan, el wordmark aparece igual
    const watchdog = setTimeout(show, 4000);

    document.fonts.ready.then(() => {
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('no ctx');
        const r = wrap.getBoundingClientRect();
        const dpr = Math.min(devicePixelRatio || 1, 2);
        canvas.width = r.width * dpr;
        canvas.height = r.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.classList.remove('hidden');

        // Muestrear el texto real para obtener las posiciones destino
        const cs = getComputedStyle(h1);
        const off = document.createElement('canvas');
        off.width = Math.ceil(r.width);
        off.height = Math.ceil(r.height);
        const octx = off.getContext('2d');
        if (!octx) throw new Error('no octx');
        octx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        if ('letterSpacing' in octx) (octx as CanvasRenderingContext2D).letterSpacing = cs.letterSpacing;
        octx.textBaseline = 'middle';
        octx.fillText(h1.textContent?.trim() ?? 'PIXIES', 0, off.height / 2);

        // colores desde los tokens (única fuente de verdad: tokens.css)
        const rootCss = getComputedStyle(document.documentElement);
        const cPixel = rootCss.getPropertyValue('--color-pixel').trim() || '#7c5cff';
        const cInk = rootCss.getPropertyValue('--color-ink').trim() || '#f2f3f7';

        const cell = Math.max(6, Math.round(parseFloat(cs.fontSize) / 15));
        const img = octx.getImageData(0, 0, off.width, off.height).data;
        const parts: { tx: number; ty: number; x: number; y: number; d: number; violet: boolean }[] = [];
        for (let y = 0; y < off.height; y += cell)
          for (let x = 0; x < off.width; x += cell)
            if (img[(y * off.width + x) * 4 + 3]! > 128)
              parts.push({
                tx: x,
                ty: y,
                x: Math.random() * r.width,
                y: Math.random() * r.height,
                d: Math.random() * 0.35,
                violet: Math.random() < 0.18,
              });

        const DUR = 1400;
        const t0 = performance.now();
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);

        const frame = (now: number) => {
          const el = now - t0;
          ctx.clearRect(0, 0, r.width, r.height);
          let done = true;
          for (const p of parts) {
            const raw = Math.min(Math.max(el / DUR - p.d, 0) / (1 - p.d), 1);
            if (raw < 1) done = false;
            const k = ease(raw);
            ctx.fillStyle = p.violet && raw < 1 ? cPixel : cInk;
            ctx.fillRect(p.x + (p.tx - p.x) * k, p.y + (p.ty - p.y) * k, cell - 1, cell - 1);
          }
          if (!done) raf = requestAnimationFrame(frame);
          else {
            clearTimeout(watchdog);
            h1.style.visibility = 'visible';
            canvas.style.transition = 'opacity 0.4s';
            canvas.style.opacity = '0';
            setTimeout(() => canvas.classList.add('hidden'), 450);
          }
        };
        raf = requestAnimationFrame(frame);
      } catch {
        clearTimeout(watchdog);
        show();
      }
    });

    return () => {
      clearTimeout(watchdog);
      cancelAnimationFrame(raf);
      h1.style.visibility = 'visible';
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 hidden" aria-hidden="true" />;
}
