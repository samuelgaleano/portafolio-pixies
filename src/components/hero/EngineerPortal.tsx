import Link from 'next/link';
import { t } from '@/i18n';

// Portal del ingeniero (Samuel r17 2026-07-18): panel CUADRADO que crece hacia arriba desde el
// CTA. La foto real se compone de una malla 8×8 de teselas (background sprite) que se DISPERSA
// en píxeles al pasar/seleccionar (eco de la animación del wordmark). Teselas deterministas
// (constantes de Knuth) → SSR y cliente pintan idéntico. Link limpio (server component); el
// barrido a /samuel lo dispara el interceptor global EngineerTransition.
const GRID = 8; // 8×8 = 64 teselas de la foto
const AV = 144; // lado del avatar en px (debe casar con .eng-portal__avatar)
const TILE = AV / GRID; // 18px por tesela → posición exacta en px (sin costuras por %)
// Al seleccionar, cada tesela CAE (gravedad, --fall siempre positiva y grande → sale del marco)
// mientras VOLTEA en 3D (rotateX/Y + profundidad --sz). Deterministas (Knuth) → SSR-safe.
const TILES = Array.from({ length: GRID * GRID }, (_, i) => {
  const col = i % GRID;
  const row = Math.floor(i / GRID);
  const h1 = (i * 2246822519) >>> 0;
  const h2 = (i * 3266489917) >>> 0;
  const h3 = (i * 2654435761) >>> 0;
  const h4 = (i * 40503) >>> 0;
  return {
    bx: -(col * TILE),
    by: -(row * TILE),
    sx: (h1 % 40) - 20, // deriva horizontal -20..19
    fall: 46 + (h2 % 92), // caída 46..137 px (se ven caer dentro del marco antes de desvanecer)
    sz: (h3 % 220) - 110, // profundidad 3D -110..109
    rx: (h4 % 240) - 120, // rotateX -120..119
    ry: (h2 % 240) - 120, // rotateY
    rot: (h1 % 96) - 48, // rotateZ -48..47
    d: ((h4 % 130) / 1000).toFixed(3), // desfase 0..0.13s
  };
});

export default function EngineerPortal() {
  return (
    // el flotador se mueve solo (llama la atención → más tráfico al ingeniero); el Link se
    // inclina en 3D al hover. Separados para que el float (wrapper) y el tilt (link) no choquen.
    <span className="eng-portal-float">
      <Link href="/samuel" data-desde="hero-portal" aria-label={t.hero.portalAria} className="eng-portal group">
        {/* reposo: la FOTO entera (limpia, sin costuras). Al pasar/seleccionar la foto se apaga
            y la malla de teselas se DISPERSA en píxeles encima. */}
        <span className="eng-portal__avatar" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="eng-portal__photo" src="/samuel/samuel-avatar.webp" alt="" width={320} height={320} decoding="async" />
          <span className="eng-portal__tiles">
            {TILES.map((tile, i) => (
              <i
                key={i}
                style={
                  {
                    backgroundPosition: `${tile.bx}px ${tile.by}px`,
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
        <span className="eng-portal__body">
          <span className="eng-portal__kicker">{t.hero.portalKicker}</span>
          <span className="eng-portal__name">{t.hero.portalName}</span>
          <span className="eng-portal__role">{t.hero.portalRole}</span>
        </span>
        {/* afordancia clara de botón: flecha grande en la esquina, empuja al hover */}
        <span className="eng-portal__go" aria-hidden="true">
          →
        </span>
      </Link>
    </span>
  );
}
