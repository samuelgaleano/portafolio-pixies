'use client';

import { useEffect, useRef } from 'react';

// Fondo ambiental sitewide (Opción ① elegida por Samuel, como "wallpaper"): campo de
// puntos en pseudo-3D (perspectiva + profundidad), deriva lenta y
// continua, con alguna "estrella fugaz" ocasional. Vive detrás de TODO el contenido
// (el layout lo monta una vez sobre <body>), opacidad muy baja para no competir con
// el texto sobre el lavanda claro. Colores leídos en vivo de --color-* (nunca hex fijo).

const COUNT = 150;
const DEPTH_NEAR = 0.6;
const DEPTH_FAR = 2.4;
const FOCAL = 1.3;
const ROT_Y_SPEED = 0.018; // rad/s — una vuelta dura ~6 min, deriva casi imperceptible
const ROT_X_BASE = 0.12;
const ROT_X_AMP = 0.05; // "respiración" vertical leve, no una rotación completa en X
const ROT_X_SPEED = 0.06;
const MAX_RADIUS = 5.5; // tope defensivo: ningún punto puede crecer al punto de estorbar
const FRAME_INTERVAL = 1000 / 30; // throttle ~30fps
const STAR_MIN_GAP = 2600; // ms entre chequeos de nueva estrella
const STAR_MAX_GAP = 5200;
const STAR_CHANCE = 0.55; // probabilidad de nacer por chequeo — la rareza ES el efecto
const STAR_DURATION = 750;
const STAR_MAX_ACTIVE = 2;

type ColorKey = 'line' | 'dim' | 'pixel' | 'data';

interface Point {
  x: number; y: number; z: number; r: number; color: ColorKey;
  sx: number; sy: number; f: number; depth: number; // scratch: se reescriben cada frame, 0 allocations
}

interface Star {
  point: Point;
  start: number;
  dx: number; dy: number; // dirección unitaria del streak en pantalla
  length: number;
}

function byDepthDesc(a: Point, b: Point) {
  return b.depth - a.depth;
}

export default function AmbientDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const points: Point[] = Array.from({ length: COUNT }, () => {
      const roll = Math.random(); // ~70% tenue (line/dim), 20% violeta, 10% teal — más color que antes
      const color: ColorKey = roll < 0.4 ? 'line' : roll < 0.7 ? 'dim' : roll < 0.9 ? 'pixel' : 'data';
      return {
        x: Math.random() * 2 - 1, y: Math.random() * 2 - 1,
        z: DEPTH_NEAR + Math.random() * (DEPTH_FAR - DEPTH_NEAR), r: 1.4 + Math.random() * 2.2,
        color,
        sx: 0, sy: 0, f: 0, depth: 0,
      };
    });

    // paleta en vivo desde :root; los tintes de marca se atenúan más que line/dim
    const rootCss = getComputedStyle(document.documentElement);
    const palette: Record<ColorKey, string> = {
      line: rootCss.getPropertyValue('--color-line').trim() || '#ded6f3',
      dim: rootCss.getPropertyValue('--color-dim').trim() || '#5b5480',
      pixel: rootCss.getPropertyValue('--color-pixel').trim() || '#6d4aff',
      data: rootCss.getPropertyValue('--color-data').trim() || '#0d7490',
    };
    const alphaMul: Record<ColorKey, number> = { line: 1, dim: 1, pixel: 0.85, data: 0.8 };

    let w = window.innerWidth, h = window.innerHeight;
    const stars: Star[] = [];

    const draw = (rotY: number, rotX: number, now: number) => {
      ctx.clearRect(0, 0, w, h);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY), cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cx = w / 2, cy = h / 2;
      const scale = Math.min(w, h) * 0.85;

      for (const p of points) {
        // rota en Y y luego en X antes de proyectar en perspectiva (división por profundidad)
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const depth = Math.max(z2, 0.15);
        const f = FOCAL / depth;
        p.sx = cx + x1 * f * scale; p.sy = cy + y1 * f * scale; p.f = f; p.depth = depth;
      }
      points.sort(byDepthDesc); // ordena el propio array: cero allocations por frame

      for (const p of points) {
        if (p.sx < -20 || p.sx > w + 20 || p.sy < -20 || p.sy > h + 20) continue;
        ctx.globalAlpha = Math.max(0.06, Math.min(0.5, p.f * 0.42)) * alphaMul[p.color];
        ctx.fillStyle = palette[p.color];
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, Math.min(MAX_RADIUS, Math.max(0.4, p.r * p.f)), 0, Math.PI * 2);
        ctx.fill();
      }

      // estrellas fugaces: stars sigue vacío en el frame estático de reduced-motion,
      // así que este loop simplemente no itera ahí (sin flag extra que threadear)
      for (const s of stars) {
        const progress = (now - s.start) / STAR_DURATION;
        if (progress >= 1) continue;
        const ease = 1 - (1 - progress) * (1 - progress); // easeOutQuad: arranca y se frena
        const headX = s.point.sx + s.dx * s.length * ease, headY = s.point.sy + s.dy * s.length * ease;
        const tailX = headX - s.dx * s.length * 0.4, tailY = headY - s.dy * s.length * 0.4;
        const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
        grad.addColorStop(0, 'transparent'); grad.addColorStop(1, palette.pixel);
        ctx.globalAlpha = (1 - progress) * 0.65;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(headX, headY); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // tope 1.5: es fondo, no foco
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw(ROT_X_BASE, ROT_X_BASE, 0);
    };
    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    window.addEventListener('resize', onResize);

    if (reduce) {
      // frame único y estático, sin rAF: solo se re-encuadra si cambia el viewport
      return () => { clearTimeout(resizeTimer); window.removeEventListener('resize', onResize); };
    }

    let raf = 0, running = true, lastFrame = 0;
    const start = performance.now();
    let nextStarCheck = start + STAR_MIN_GAP; // nunca una estrella al instante de cargar
    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      if (now >= nextStarCheck) {
        nextStarCheck = now + STAR_MIN_GAP + Math.random() * (STAR_MAX_GAP - STAR_MIN_GAP);
        if (stars.length < STAR_MAX_ACTIVE && Math.random() < STAR_CHANCE) {
          const angle = Math.random() * Math.PI * 2;
          stars.push({
            point: points[(Math.random() * points.length) | 0], start: now,
            dx: Math.cos(angle), dy: Math.sin(angle),
            length: Math.min(w, h) * (0.14 + Math.random() * 0.1),
          });
        }
      }
      for (let i = stars.length - 1; i >= 0; i--) if (now - stars[i].start >= STAR_DURATION) stars.splice(i, 1);

      const t = (now - start) / 1000;
      draw(t * ROT_Y_SPEED, ROT_X_BASE + Math.sin(t * ROT_X_SPEED) * ROT_X_AMP, now);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; lastFrame = 0; raf = requestAnimationFrame(frame); }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      running = false; cancelAnimationFrame(raf); clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />;
}
