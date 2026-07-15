'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { t } from '@/i18n';

// Firma interactiva del hero (pedido de Samuel): la cita que revela al ingeniero.
// Muy llamativa pero disciplinada — movimiento idle (shimmer + brackets que respiran)
// y reacción al cursor (spotlight violeta que lo sigue + atracción magnética del
// contenido). Es un <a> a /samuel: accesible y navegable por teclado. Con
// reduced-motion o sin JS queda estática y perfectamente usable.
const MAG = 0.14; // fuerza magnética (fracción del desplazamiento al cursor)
const SPRING = 0.16; // suavizado del retorno

export default function EngineerSignature() {
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const box = inner.current;
    if (!el || !box) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!matchMedia('(pointer: fine)').matches) return; // sin puntero fino: estática

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let inside = false;

    const frame = () => {
      raf = 0;
      x += (tx - x) * SPRING;
      y += (ty - y) * SPRING;
      box.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(frame);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      // spotlight que sigue al cursor (CSS var en %)
      el.style.setProperty('--mx', `${(mx / r.width) * 100}%`);
      el.style.setProperty('--my', `${(my / r.height) * 100}%`);
      // atracción magnética: el contenido se corre hacia el cursor desde el centro
      tx = (mx - r.width / 2) * MAG;
      ty = (my - r.height / 2) * MAG;
      inside = true;
      schedule();
    };
    const onLeave = () => {
      inside = false;
      tx = 0;
      ty = 0;
      el.style.setProperty('--mx', '50%');
      el.style.setProperty('--my', '50%');
      schedule();
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
      void inside;
    };
  }, []);

  return (
    <Link
      ref={ref}
      href="/samuel"
      data-desde="firma-hero"
      aria-label={t.signature.aria}
      className="engineer-signature group hero-in relative mt-6 inline-flex max-w-full items-center gap-4 overflow-hidden rounded-(--radius-m) border border-line/80 bg-surface/40 px-5 py-4 backdrop-blur-sm transition-colors hover:border-pixel/70"
      style={{ '--d': '1.05s' } as React.CSSProperties}
    >
      {/* spotlight violeta que sigue al cursor */}
      <span className="sig-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      {/* brackets de píxel en las esquinas — respiran en idle, se abren en hover */}
      <span className="sig-bracket sig-bracket-tl pointer-events-none absolute" aria-hidden="true" />
      <span className="sig-bracket sig-bracket-br pointer-events-none absolute" aria-hidden="true" />

      <span ref={inner} className="relative flex items-center gap-4 will-change-transform">
        {/* mosaico pixelado: eco de la firma, mismo lenguaje que el resto del sitio */}
        <span
          className="block size-11 shrink-0 rounded-(--radius-s) border border-line"
          style={{
            backgroundImage:
              'conic-gradient(var(--color-surface-2) 25%, var(--color-line) 0 50%, var(--color-surface-2) 0 75%, var(--color-line) 0), linear-gradient(color-mix(in srgb, var(--color-pixel) 30%, transparent), transparent)',
            backgroundSize: '10px 10px, 100% 100%',
          }}
          aria-hidden="true"
        />
        <span className="min-w-0">
          <span className="block font-display text-lg font-semibold leading-tight text-ink sm:text-xl">
            «{t.signature.quotePre} <span className="text-pixel-soft">{t.signature.quoteEm}</span>»
          </span>
          <span className="mt-1 block font-mono text-xs text-dim">
            {t.signature.name} · {t.signature.role} ·{' '}
            <span className="text-pixel-soft group-hover:underline">{t.signature.cta} →</span>
          </span>
        </span>
      </span>
    </Link>
  );
}
