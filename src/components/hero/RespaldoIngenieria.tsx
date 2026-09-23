import Link from 'next/link';
import { t } from '@/i18n';

// Bloque de apoyo del hero de /web: el EQUIPO de ingeniería y desarrollo.
//
// Samuel (2026-09-22): no tiene que leerse como una persona sino como un grupo — "el grupo
// de ingeniería y desarrollo está a cargo de esto" — y solo después decir quién lo lidera.
// Por eso encabeza el equipo, y el liderazgo va abajo como una línea aparte, con la foto un
// poco más grande y la misma animación que tenía antes: al pasar el cursor la foto se apaga
// y una malla de teselas se dispersa en píxeles encima (mismo lenguaje que el wordmark).
// Sigue enlazando a /samuel, así que el barrido global lo intercepta igual y toda la página
// del ingeniero queda como estaba.
const GRID = 6; // 6×6 = 36 teselas; la posición va como fracción de --av (independiente del tamaño)
const TILES = Array.from({ length: GRID * GRID }, (_, i) => {
  const col = i % GRID;
  const row = Math.floor(i / GRID);
  const h1 = (i * 2246822519) >>> 0;
  const h2 = (i * 3266489917) >>> 0;
  const h3 = (i * 2654435761) >>> 0;
  const h4 = (i * 40503) >>> 0;
  return {
    bx: -(col / GRID),
    by: -(row / GRID),
    sx: (h1 % 28) - 14,
    fall: 32 + (h2 % 64),
    sz: (h3 % 160) - 80,
    rx: (h4 % 220) - 110,
    ry: (h2 % 220) - 110,
    rot: (h1 % 80) - 40,
    d: ((h4 % 120) / 1000).toFixed(3),
  };
});

export default function RespaldoIngenieria() {
  return (
    <aside className="respaldo" aria-label={t.hero.respaldoEyebrow}>
      <span className="respaldo__eyebrow">{t.hero.respaldoEyebrow}</span>
      <p className="respaldo__linea">{t.hero.respaldoLinea}</p>
      <Link href="/samuel" data-desde="hero-portal" className="respaldo__quien">
        <span className="respaldo__avatar" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="respaldo__foto" src="/samuel/samuel-avatar.webp" alt="" width={160} height={160} decoding="async" />
          <span className="respaldo__teselas">
            {TILES.map((tile, i) => (
              <i
                key={i}
                style={
                  {
                    backgroundPosition: `calc(var(--av) * ${tile.bx}) calc(var(--av) * ${tile.by})`,
                    '--sx': `${tile.sx}px`,
                    '--fall': `${tile.fall}px`,
                    '--sz': `${tile.sz}px`,
                    '--rx': `${tile.rx}deg`,
                    '--ry': `${tile.ry}deg`,
                    '--rot': `${tile.rot}deg`,
                    '--d': `${tile.d}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </span>
        </span>
        <span className="respaldo__texto">
          <span className="respaldo__lidera">{t.hero.respaldoLidera}</span>
          <span className="respaldo__nombre">{t.hero.respaldoQuien}</span>
          <span className="respaldo__rol">{t.hero.respaldoRol}</span>
        </span>
        <span className="respaldo__ir" aria-hidden="true">
          →
        </span>
      </Link>
    </aside>
  );
}
