import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE } from '@/components/og/OgCard';

export const alt = 'Pixies Digital Web Design — Web design, data, AI y soluciones digitales';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="/digital·web·design"
        title="Pixies Digital Web Design"
        subtitle="Software a medida que corre en producción: páginas, ERP, datos, IA y ciberseguridad."
        titleSize={70}
      />
    ),
    size
  );
}
