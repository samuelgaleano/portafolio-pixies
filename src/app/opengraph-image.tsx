import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE } from '@/components/og/OgCard';

// OG de la home = el GRUPO (2026-09-22). /web y /marketing tienen la suya en su segmento.
export const alt = 'Pixies Design Group — Web, datos, IA y creatividad';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="/design·group · Bogotá · alcance global"
        title="Pixies Design Group"
        subtitle="Dos divisiones, un mismo proceso: Pixies Digital Web Design y Pixies Creative."
        titleSize={76}
      />
    ),
    size
  );
}
