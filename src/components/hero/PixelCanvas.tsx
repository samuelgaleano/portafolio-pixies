'use client';

import { useEffect, useRef } from 'react';

// Firma viva (spec 2026-07-14): el wordmark se ensambla desde píxeles y NO muere —
// queda como campo interactivo que repele al cursor (resorte amortiguado de vuelta),
// parpadea en violeta, respira con una onda lenta y glitchea una banda de vez en cuando.
// Vanilla sobre canvas 2D; un solo loop rAF que se pausa fuera de viewport.
// Sin JS, con reduced-motion o si algo falla: el h1 real queda visible.
// El h1 se oculta con opacity (no visibility) para seguir en el árbol de accesibilidad.

const INTRO_MS = 1400;
const SPRING = 90; // rigidez del resorte hacia el destino (1/s²)
const DAMP = 11; // amortiguación de la velocidad (1/s)
const REPEL_R = 120; // radio de repulsión del cursor (px)
const REPEL_F = 3200; // fuerza de repulsión (px/s²)
const FLICK_P = 0.0004; // prob. por partícula/frame de parpadear a violeta
const WAVE_EVERY_MS = 6500; // cada cuánto respira el wordmark
const WAVE_SPEED = 800; // px/s del frente de onda
const GLITCH_MIN_MS = 8000;
const GLITCH_VAR_MS = 6000;
const GLITCH_DUR_MS = 130;

interface Particle {
  tx: number; // destino
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  delay: number; // stagger del intro (0–0.35)
  alpha: number; // textura estática (0.85–1)
  flickUntil: number; // acc (ms) hasta el que se pinta violeta
}

export default function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const h1 = document.getElementById('wordmark');
    const wrap = h1?.parentElement;
    const hero = canvas?.closest('section');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canvas || !h1 || !wrap || !hero || reduce) return;

    h1.style.opacity = '0';
    let raf = 0;
    let disposed = false;
    const show = () => {
      h1.style.opacity = '1';
      canvas.classList.add('hidden');
    };
    // watchdog — si fuentes/canvas fallan, el wordmark aparece igual
    const watchdog = setTimeout(show, 4000);

    const cleanups: (() => void)[] = [];

    document.fonts.ready.then(() => {
      if (disposed) return;
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('no ctx');

        // colores desde los tokens (única fuente de verdad: tokens.css)
        const rootCss = getComputedStyle(document.documentElement);
        const cPixel = rootCss.getPropertyValue('--color-pixel').trim() || '#7c5cff';
        const cInk = rootCss.getPropertyValue('--color-ink').trim() || '#f2f3f7';

        let parts: Particle[] = [];
        let cell = 8;
        let w = 0;
        let h = 0;
        let dirty = true; // fuerza un repintado (p. ej. tras resize, que limpia el canvas)

        // Muestrea el texto real y (re)construye las partículas. `settled` = sin intro.
        const build = (settled: boolean) => {
          const r = wrap.getBoundingClientRect();
          w = r.width;
          h = r.height;
          const dpr = Math.min(devicePixelRatio || 1, 2);
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          // tamaño CSS explícito: sin esto el canvas se MUESTRA al tamaño del buffer
          // (2× en pantallas retina) y el wordmark se recorta. Técnica retina estándar.
          canvas.style.width = `${w}px`;
          canvas.style.height = `${h}px`;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          const cs = getComputedStyle(h1);
          const off = document.createElement('canvas');
          off.width = Math.ceil(w);
          off.height = Math.ceil(h);
          const octx = off.getContext('2d');
          if (!octx) throw new Error('no octx');
          octx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          if ('letterSpacing' in octx) (octx as CanvasRenderingContext2D).letterSpacing = cs.letterSpacing;
          octx.textBaseline = 'middle';
          octx.fillText(h1.textContent?.trim() ?? 'PIXIES', 0, off.height / 2);

          // celda adaptativa: acota el nº de partículas a un rango similar en toda pantalla.
          // /22 mantiene los huecos entre letras: con celdas más gruesas, PIXIES se fusiona
          cell = Math.max(5, Math.round(parseFloat(cs.fontSize) / 22));
          const img = octx.getImageData(0, 0, off.width, off.height).data;
          parts = [];
          for (let y = 0; y < off.height; y += cell)
            for (let x = 0; x < off.width; x += cell)
              if (img[(y * off.width + x) * 4 + 3]! > 128)
                parts.push({
                  tx: x,
                  ty: y,
                  x: settled ? x : Math.random() * w,
                  y: settled ? y : Math.random() * h,
                  vx: 0,
                  vy: 0,
                  delay: Math.random() * 0.35,
                  alpha: 0.85 + Math.random() * 0.15,
                  flickUntil: 0,
                });
          dirty = true;
        };
        build(false);
        if (parts.length === 0) throw new Error('texto sin píxeles muestreados');
        // build OK: el canvas ya puede pintar; desarmamos el watchdog aquí y no al final
        // del intro, porque rAF no corre en pestañas en background y el intro puede
        // quedar legítimamente pausado más de 4s (se reanuda al volver la pestaña).
        clearTimeout(watchdog);
        canvas.classList.remove('hidden');

        // --- estado del loop ---
        let acc = 0; // tiempo animado acumulado (ms); no avanza en pausa
        let last = 0;
        let intro = true;
        let mouse = { x: -9999, y: -9999 };
        let waveAt = INTRO_MS + 2500; // primera respiración poco después del intro
        let glitchAt = INTRO_MS + GLITCH_MIN_MS + Math.random() * GLITCH_VAR_MS;
        let glitchY0 = 0;
        let glitchDx = 0;
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

        const frame = (now: number) => {
          raf = 0;
          const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
          last = now;
          acc += dt * 1000;

          // onda de respiración: frente gaussiano que recorre el texto
          let waveX = -1e9;
          if (acc >= waveAt) {
            waveX = ((acc - waveAt) / 1000) * WAVE_SPEED - 100;
            if (waveX > w + 100) {
              waveAt = acc + WAVE_EVERY_MS;
              waveX = -1e9;
            }
          }

          // glitch: banda horizontal desplazada un instante
          if (acc >= glitchAt) {
            if (glitchDx === 0) {
              glitchY0 = Math.random() * (h - cell * 3);
              glitchDx = (Math.random() < 0.5 ? -1 : 1) * cell * 0.9;
            } else if (acc > glitchAt + GLITCH_DUR_MS) {
              glitchDx = 0;
              glitchAt = acc + GLITCH_MIN_MS + Math.random() * GLITCH_VAR_MS;
            }
          }

          if (intro) {
            ctx.clearRect(0, 0, w, h);
            const el = acc;
            let done = true;
            for (const p of parts) {
              const raw = Math.min(Math.max(el / INTRO_MS - p.delay, 0) / (1 - p.delay), 1);
              if (raw < 1) done = false;
              const k = easeOut(raw);
              ctx.globalAlpha = p.alpha;
              ctx.fillStyle = p.delay > 0.28 && raw < 1 ? cPixel : cInk;
              ctx.fillRect(p.x + (p.tx - p.x) * k, p.y + (p.ty - p.y) * k, cell - 1, cell - 1);
            }
            if (done) {
              intro = false;
              for (const p of parts) {
                p.x = p.tx;
                p.y = p.ty;
              }
            }
          } else {
            // en reposo total (sin onda/glitch/shimmer, sin cursor cerca, partículas
            // quietas) el frame anterior sigue siendo correcto: no se repinta (ahorro
            // de CPU/batería en móvil; el rAF sigue para que los timers avancen)
            let alive = dirty || waveX > -1e9 || glitchDx !== 0;
            dirty = false;
            const mouseNear = mouse.x > -REPEL_R && mouse.x < w + REPEL_R && mouse.y > -REPEL_R && mouse.y < h + REPEL_R;
            for (const p of parts) {
              // shimmer violeta ocasional (se sortea también en reposo para que despierte)
              if (p.flickUntil < acc && Math.random() < FLICK_P) p.flickUntil = acc + 250 + Math.random() * 350;
              if (p.flickUntil + 100 > acc || Math.abs(p.vx) + Math.abs(p.vy) > 0.5 || Math.abs(p.x - p.tx) + Math.abs(p.y - p.ty) > 0.5)
                alive = true;
            }
            if (!alive && !mouseNear) {
              if (visible) raf = requestAnimationFrame(frame);
              return;
            }
            ctx.clearRect(0, 0, w, h);
            for (const p of parts) {
              // resorte amortiguado hacia el destino + repulsión del cursor
              const dxm = p.x - mouse.x;
              const dym = p.y - mouse.y;
              const d = Math.hypot(dxm, dym);
              if (d < REPEL_R && d > 0.01) {
                const f = (REPEL_F * (1 - d / REPEL_R)) / d;
                p.vx += f * dxm * dt;
                p.vy += f * dym * dt;
              }
              p.vx += ((p.tx - p.x) * SPRING - p.vx * DAMP) * dt;
              p.vy += ((p.ty - p.y) * SPRING - p.vy * DAMP) * dt;
              p.x += p.vx * dt;
              p.y += p.vy * dt;

              let ox = 0;
              let oy = 0;
              const dw = Math.abs(p.tx - waveX);
              if (dw < 160) oy = -Math.exp(-(dw * dw) / 6400) * cell * 0.55;
              if (glitchDx !== 0 && p.ty >= glitchY0 && p.ty <= glitchY0 + cell * 3) ox = glitchDx;

              ctx.globalAlpha = p.alpha;
              ctx.fillStyle = p.flickUntil > acc ? cPixel : cInk;
              ctx.fillRect(p.x + ox, p.y + oy, cell - 1, cell - 1);
            }
          }
          ctx.globalAlpha = 1;
          if (visible) raf = requestAnimationFrame(frame);
        };

        const schedule = () => {
          if (!raf && visible) {
            last = 0; // el dt del primer frame tras pausa no salta
            raf = requestAnimationFrame(frame);
          }
        };

        // pausa total cuando el hero sale del viewport
        let visible = true;
        const io = new IntersectionObserver(([entry]) => {
          visible = entry?.isIntersecting ?? true;
          if (!visible && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          } else schedule();
        });
        io.observe(canvas);
        cleanups.push(() => io.disconnect());

        // cursor/touch relativo al canvas; escuchamos en toda la sección del hero.
        // Las partículas viven en el espacio de dibujo (0..w, 0..h) fijado en build();
        // el canvas se MUESTRA a rect.width×rect.height, que puede diferir de w×h (reflow
        // de la fuente al cargar, escalado de pantalla, barra de URL móvil). Sin reescalar,
        // la repulsión se corre proporcional a x: bien en las primeras letras, desfasada en
        // las últimas. Mapear pantalla→dibujo lo corrige (factor 1 cuando coinciden).
        const onMove = (e: PointerEvent) => {
          const r = canvas.getBoundingClientRect();
          if (!r.width || !r.height) return;
          mouse = {
            x: (e.clientX - r.left) * (w / r.width),
            y: (e.clientY - r.top) * (h / r.height),
          };
        };
        const onLeave = () => {
          mouse = { x: -9999, y: -9999 };
        };
        hero.addEventListener('pointermove', onMove);
        hero.addEventListener('pointerdown', onMove);
        hero.addEventListener('pointerleave', onLeave);
        cleanups.push(() => {
          hero.removeEventListener('pointermove', onMove);
          hero.removeEventListener('pointerdown', onMove);
          hero.removeEventListener('pointerleave', onLeave);
        });

        // Reconstruir cuando el ANCHO real del contenedor cambia: no solo por resize de
        // ventana, también por reflow de la fuente al cargar tarde (la causa de que el
        // buffer y el tamaño mostrado se desincronicen y la repulsión se corriera). Se
        // ignora el cambio de solo-alto (la URL bar en móvil) para no thrashear el intro.
        let lastW = Math.round(w);
        let timer = 0;
        const ro = new ResizeObserver(() => {
          const nw = Math.round(wrap.getBoundingClientRect().width);
          if (nw === lastW || nw === 0) return;
          lastW = nw;
          clearTimeout(timer);
          timer = window.setTimeout(() => build(true), 200);
        });
        ro.observe(wrap);
        cleanups.push(() => {
          ro.disconnect();
          clearTimeout(timer);
        });

        schedule();
      } catch {
        clearTimeout(watchdog);
        show();
      }
    });

    return () => {
      disposed = true;
      clearTimeout(watchdog);
      cancelAnimationFrame(raf);
      for (const fn of cleanups) fn();
      h1.style.opacity = '1';
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 hidden" aria-hidden="true" />;
}
