import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE } from '@/components/og/OgCard';

export const alt = 'Pixies — Digital Web Design';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="/digital·web·design"
        title="Pixies"
        subtitle="Desarrollo web, software a medida, IA y datos. Design Group by Samuel Galeano."
      />
    ),
    size
  );
}
