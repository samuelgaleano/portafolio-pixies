import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE } from '@/components/og/OgCard';

export const alt = 'Samuel Galeano — El ingeniero detrás de Pixies';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="/el-ingeniero"
        title="Samuel Galeano"
        subtitle="El cerebro detrás de Pixies. Ingeniero de Sistemas: web, software, datos e IA."
      />
    ),
    size
  );
}
