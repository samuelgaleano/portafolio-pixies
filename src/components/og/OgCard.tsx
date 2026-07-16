import type { ReactElement } from 'react';

// Tarjeta OG compartida (plan F6 V3). Identidad pixel: fondo void, retícula sutil,
// mosaico de píxeles violeta/coral. Se renderiza con next/og (Satori) → sin fuentes
// externas (system sans), colores literales porque Satori no resuelve CSS vars.
export const OG_SIZE = { width: 1200, height: 630 };

const VOID = '#0B0D12';
const INK = '#F2F3F7';
const DIM = '#9AA3B8';
const PIXEL = '#7C5CFF';
const SIGNAL = '#FF5D73';
const LINE = '#262C3D';

export function OgCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }): ReactElement {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: VOID,
        backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        padding: '72px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* mosaico firma */}
        <div style={{ display: 'flex', flexWrap: 'wrap', width: 56, height: 56 }}>
          <div style={{ width: 26, height: 26, background: PIXEL }} />
          <div style={{ width: 26, height: 26, background: PIXEL, opacity: 0.45, marginLeft: 4 }} />
          <div style={{ width: 26, height: 26, background: PIXEL, opacity: 0.45, marginTop: 4 }} />
          <div style={{ width: 26, height: 26, background: SIGNAL, marginLeft: 4, marginTop: 4 }} />
        </div>
        <div style={{ fontSize: 30, color: INK, fontWeight: 700, letterSpacing: -1 }}>pixies</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 24, color: PIXEL, fontFamily: 'monospace', marginBottom: 16 }}>{eyebrow}</div>
        <div style={{ fontSize: 84, color: INK, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
        <div style={{ fontSize: 30, color: DIM, marginTop: 20, maxWidth: 900 }}>{subtitle}</div>
      </div>
    </div>
  );
}
