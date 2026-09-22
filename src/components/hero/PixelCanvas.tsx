'use client';

import { useEffect, useRef } from 'react';
import { WORDMARK_BITMAP, WORDMARK_COLS, WORDMARK_ROWS } from '@/lib/wordmark-bitmap';

// Firma viva (spec 2026-07-14): el wordmark se ensambla desde píxeles y NO muere — queda
// como campo interactivo que repele al cursor (resorte amortiguado de vuelta) y cuyos
// píxeles destellan de color por su cuenta. Vanilla sobre canvas 2D; un solo loop rAF que
// se pausa fuera de viewport. Sin JS, con reduced-motion o si algo falla: el h1 real queda
// visible. El h1 se oculta con opacity (no visibility) para seguir en el árbol de a11y.
//
// 2026-09-22 (Samuel): las letras ya NO se muestrean de la fuente — son un bitmap propio
// (`lib/wordmark-bitmap.ts`): a celdas gruesas, rasterizar Clash Display dejaba esquinas
// perdidas en la P y la I y una S que parecía un 8. Con el bitmap cada letra está dibujada
// a mano, sin píxeles perdidos. La única animación autónoma es el destello de color
// (violeta y/o ámbar según el entorno: --wm-flick y --wm-flick-2); la onda y el glitch se
// quitaron ("como que salta la palabra"). Intro y resorte rápidos ("más frenético"),
// destellos lentos y con fundido. Buffer a DPR ≤ 1,5 y dibujo por lotes de alpha: el
// reposo son 3 pasadas de rects con un solo fillStyle, más las ~7 celdas que funden.

const INTRO_MS = 900;
const SPRING = 170; // rigidez del resorte hacia el destino (1/s²)
const DAMP = 15; // amortiguación de la velocidad (1/s)
const REPEL_R = 120; // radio de repulsión del cursor (px)
const REPEL_F = 3600; // fuerza de repulsión (px/s²)
// Destellos (Samuel, 2026-09-22 · 2ª ronda: "el cambio es muy constante y muy rápido,
// reducir eso; transiciones más lentas y transitables"): pocos y largos, y cada uno
// ENTRA Y SALE con un fundido (se interpola el color entre la tinta y el acento) en vez
// de encenderse y apagarse de golpe. ~0.008 × 428 celdas ≈ 3,4/s × 2,2 s de vida ≈ 7
// encendidas a la vez, casi todas a media intensidad: respira, no parpadea.
const FLICK_RATE = 0.008; // destellos por celda y segundo
const FLICK_MIN_MS = 1700;
const FLICK_VAR_MS = 1000;

// textura estática en 3 niveles (no continua): así el reposo se pinta en 3 pasadas con UN
// globalAlpha cada una, en vez de cambiar alpha y color por partícula
const ALPHAS = [0.86, 0.93, 1] as const;
const DPR_MAX = 1.5;

interface Particle {
  tx: number; // destino
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  delay: number; // stagger del intro (0–0.35)
  alpha: number; // textura estática (uno de ALPHAS)
  flickStart: number; // acc (ms) en que arrancó el destello (0 = apagada)
  flickEnd: number; // acc (ms) en que termina
  flickColor: number; // índice en la paleta de destello
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
    // watchdog — si algo falla, el wordmark real aparece igual
    const watchdog = setTimeout(show, 4000);

    const cleanups: (() => void)[] = [];

    document.fonts.ready.then(() => {
      if (disposed) return;
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('no ctx');

        // colores desde los tokens (única fuente de verdad: tokens.css). Destellos:
        // --wm-flick (y --wm-flick-2 si el entorno lo define — el grupo lleva violeta Y
        // ámbar, ver globals.css); si no hay nada, el violeta de marca.
        const rootCss = getComputedStyle(document.documentElement);
        const leer = (v: string) => rootCss.getPropertyValue(v).trim();
        const flickColors = [leer('--wm-flick') || leer('--color-pixel') || '#7c5cff', leer('--wm-flick-2')].filter(Boolean);
        const cInk = leer('--color-ink') || '#1c1533';

        // Para poder FUNDIR entre la tinta y el acento hay que interpolar en RGB. Se
        // precalculan las rampas (13 pasos por color): en el bucle solo se indexa, sin
        // parsear ni componer strings por frame.
        const rgb = (css: string): [number, number, number] => {
          const hex = css.trim();
          if (hex.startsWith('#')) {
            const h = hex.length === 4 ? hex.slice(1).split('').map((c) => c + c).join('') : hex.slice(1, 7);
            return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
          }
          const n = hex.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
          return [n[0] ?? 0, n[1] ?? 0, n[2] ?? 0];
        };
        const PASOS = 13;
        const tinta = rgb(cInk);
        const rampas = flickColors.map((c) => {
          const dest = rgb(c);
          return Array.from({ length: PASOS }, (_, i) => {
            const k = i / (PASOS - 1);
            const m = (j: number) => Math.round(tinta[j]! + (dest[j]! - tinta[j]!) * k);
            return `rgb(${m(0)},${m(1)},${m(2)})`;
          });
        });

        let parts: Particle[] = [];
        let cell = 8;
        let w = 0;
        let h = 0;
        let dirty = true; // fuerza un repintado (p. ej. tras resize, que limpia el canvas)

        // Coloca el bitmap centrado en la caja del h1 y (re)construye las partículas.
        // `settled` = sin intro.
        const build = (settled: boolean) => {
          const r = wrap.getBoundingClientRect();
          w = r.width;
          h = r.height;
          const dpr = Math.min(devicePixelRatio || 1, DPR_MAX);
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          // tamaño CSS explícito: sin esto el canvas se MUESTRA al tamaño del buffer
          // (2× en pantallas retina) y el wordmark se recorta. Técnica retina estándar.
          canvas.style.width = `${w}px`;
          canvas.style.height = `${h}px`;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          // El bitmap se centra sobre la caja DEL H1, no sobre la del contenedor: si el
          // contenedor tiene otros hijos (en /web cuelga la tarjeta del ingeniero), medir el
          // contenedor desplazaba el wordmark encima de ellos. El canvas sí cubre todo el
          // contenedor (inset-0), así que basta con dibujar en el offset del h1.
          const rh1 = h1.getBoundingClientRect();
          const hw = rh1.width;
          const hh = rh1.height;
          cell = Math.max(3, Math.floor(Math.min(hw / WORDMARK_COLS, hh / WORDMARK_ROWS)));
          const ox = Math.round(rh1.left - r.left + (hw - cell * WORDMARK_COLS) / 2);
          const oy = Math.round(rh1.top - r.top + (hh - cell * WORDMARK_ROWS) / 2);

          parts = [];
          for (let rI = 0; rI < WORDMARK_ROWS; rI++) {
            const fila = WORDMARK_BITMAP[rI]!;
            for (let cI = 0; cI < WORDMARK_COLS; cI++) {
              if (fila[cI] !== '#') continue;
              const x0 = ox + cI * cell;
              const y0 = oy + rI * cell;
              parts.push({
                tx: x0,
                ty: y0,
                x: settled ? x0 : Math.random() * w,
                y: settled ? y0 : Math.random() * h,
                vx: 0,
                vy: 0,
                delay: Math.random() * 0.35,
                alpha: ALPHAS[(Math.random() * ALPHAS.length) | 0]!,
                flickStart: 0,
                flickEnd: 0,
                flickColor: 0,
              });
            }
          }
          // ordenadas por nivel de alpha: el reposo se pinta por lotes (ver frame)
          parts.sort((a, b) => a.alpha - b.alpha);
          dirty = true;
        };
        build(false);
        if (parts.length === 0) throw new Error('bitmap sin celdas');
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
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

        const frame = (now: number) => {
          raf = 0;
          const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
          last = now;
          acc += dt * 1000;

          if (intro) {
            ctx.clearRect(0, 0, w, h);
            const el = acc;
            let done = true;
            for (const p of parts) {
              const raw = Math.min(Math.max(el / INTRO_MS - p.delay, 0) / (1 - p.delay), 1);
              if (raw < 1) done = false;
              const k = easeOut(raw);
              ctx.globalAlpha = p.alpha;
              ctx.fillStyle = p.delay > 0.28 && raw < 1 ? flickColors[p.delay > 0.32 && flickColors.length > 1 ? 1 : 0]! : cInk;
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
            // en reposo total (sin destellos, sin cursor cerca, partículas quietas) el
            // frame anterior sigue siendo correcto: no se repinta (ahorro de CPU/batería;
            // el rAF sigue para que los destellos se sorteen)
            let alive = dirty;
            dirty = false;
            const mouseNear = mouse.x > -REPEL_R && mouse.x < w + REPEL_R && mouse.y > -REPEL_R && mouse.y < h + REPEL_R;
            const pFlick = FLICK_RATE * dt;
            for (const p of parts) {
              // destello de color: la ÚNICA animación autónoma del wordmark
              if (p.flickEnd < acc && Math.random() < pFlick) {
                p.flickStart = acc;
                p.flickEnd = acc + FLICK_MIN_MS + Math.random() * FLICK_VAR_MS;
                p.flickColor = (Math.random() * flickColors.length) | 0;
              }
              if (p.flickEnd > acc || Math.abs(p.vx) + Math.abs(p.vy) > 0.5 || Math.abs(p.x - p.tx) + Math.abs(p.y - p.ty) > 0.5)
                alive = true;
            }
            if (!alive && !mouseNear) {
              if (visible) raf = requestAnimationFrame(frame);
              return;
            }
            // 1) física (sin dibujar)
            for (const p of parts) {
              // resorte amortiguado hacia el destino + repulsión del cursor
              if (mouseNear) {
                const dxm = p.x - mouse.x;
                const dym = p.y - mouse.y;
                const d = Math.hypot(dxm, dym);
                if (d < REPEL_R && d > 0.01) {
                  const f = (REPEL_F * (1 - d / REPEL_R)) / d;
                  p.vx += f * dxm * dt;
                  p.vy += f * dym * dt;
                }
              }
              p.vx += ((p.tx - p.x) * SPRING - p.vx * DAMP) * dt;
              p.vy += ((p.ty - p.y) * SPRING - p.vy * DAMP) * dt;
              p.x += p.vx * dt;
              p.y += p.vy * dt;
            }
            // 2) dibujo por lotes: las partículas están ordenadas por alpha (build), así que
            //    cada nivel es un tramo contiguo → un globalAlpha por tramo, un fillStyle en
            //    total; los destellos (pocos) van en una pasada final con su color.
            const cw = cell - 1;
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = cInk;
            let i = 0;
            for (const level of ALPHAS) {
              ctx.globalAlpha = level;
              for (; i < parts.length && parts[i]!.alpha === level; i++) {
                const p = parts[i]!;
                if (p.flickEnd > acc) continue;
                ctx.fillRect(p.x, p.y, cw, cw);
              }
            }
            // las que están destellando se pintan aparte, con el color INTERPOLADO según
            // en qué punto de su vida están: sube hasta la mitad y vuelve a bajar
            for (const p of parts) {
              if (p.flickEnd <= acc) continue;
              const t = (acc - p.flickStart) / (p.flickEnd - p.flickStart);
              const k = t < 0.5 ? t * 2 : (1 - t) * 2; // 0 → 1 → 0, lineal en el tiempo
              const rampa = rampas[p.flickColor]!;
              ctx.globalAlpha = p.alpha;
              ctx.fillStyle = rampa[Math.min(PASOS - 1, Math.max(0, Math.round(k * (PASOS - 1))))]!;
              ctx.fillRect(p.x, p.y, cw, cw);
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

        // cursor/touch relativo al canvas; escuchamos en toda la sección del hero. Las
        // partículas viven en el espacio de dibujo (0..w, 0..h) fijado en build(); el canvas
        // se MUESTRA a rect.width×rect.height, que puede diferir (reflow de fuente, escalado,
        // barra de URL móvil): mapear pantalla→dibujo corrige la repulsión.
        // El rect se cachea y se refresca en scroll/resize/build: leerlo en CADA pointermove
        // (hasta 120/s) forzaba un reflow por evento.
        let rect = canvas.getBoundingClientRect();
        const refreshRect = () => {
          rect = canvas.getBoundingClientRect();
        };
        window.addEventListener('scroll', refreshRect, { passive: true });
        window.addEventListener('resize', refreshRect, { passive: true });
        cleanups.push(() => {
          window.removeEventListener('scroll', refreshRect);
          window.removeEventListener('resize', refreshRect);
        });
        const onMove = (e: PointerEvent) => {
          if (!rect.width || !rect.height) return;
          mouse = {
            x: (e.clientX - rect.left) * (w / rect.width),
            y: (e.clientY - rect.top) * (h / rect.height),
          };
        };
        const onLeave = () => {
          mouse = { x: -9999, y: -9999 };
        };
        hero.addEventListener('pointermove', onMove, { passive: true });
        hero.addEventListener('pointerdown', onMove, { passive: true });
        hero.addEventListener('pointerleave', onLeave);
        cleanups.push(() => {
          hero.removeEventListener('pointermove', onMove);
          hero.removeEventListener('pointerdown', onMove);
          hero.removeEventListener('pointerleave', onLeave);
        });

        // Reconstruir cuando el ANCHO real del contenedor cambia (resize o reflow de la
        // fuente al cargar tarde). Se ignora el cambio de solo-alto (la URL bar en móvil)
        // para no thrashear el intro.
        let lastW = Math.round(w);
        let timer = 0;
        const ro = new ResizeObserver(() => {
          const nw = Math.round(wrap.getBoundingClientRect().width);
          if (nw === lastW || nw === 0) return;
          lastW = nw;
          clearTimeout(timer);
          timer = window.setTimeout(() => {
            build(true);
            refreshRect();
          }, 200);
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
