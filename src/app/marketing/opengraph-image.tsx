import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE } from '@/components/og/OgCard';

export const alt = 'Pixies Creative — Advertising, branding, campañas, contenido y social media';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <OgCard
        accent="creative"
        eyebrow="/creative · una empresa de Pixies Design Group"
        title="Pixies Creative"
        subtitle="Advertising · Branding · Campaigns · Content · Social Media · Creative Strategy"
      />
    ),
    size
  );
}
