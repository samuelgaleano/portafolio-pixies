import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE } from '@/components/og/OgCard';
import { escuchaProduct } from '@/data/escucha-comprendiendo';
import { t } from '@/i18n';

// Esta URL es la que Samuel comparte por LinkedIn/WhatsApp: sin tarjeta propia, la previa
// mostraría la OG genérica de la raíz ("Pixies — /digital·web·design") en vez de la app.
export const alt = 'escuchacomprendiendo.ai — de audio a decisiones citadas';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    <OgCard eyebrow={t.escucha.appEyebrow} title="escuchacomprendiendo.ai" subtitle={escuchaProduct.tagline} titleSize={64} />,
    size
  );
}
