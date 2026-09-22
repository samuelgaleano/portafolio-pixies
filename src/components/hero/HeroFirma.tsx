import Link from 'next/link';
import DivisionGlyph from './DivisionGlyph';
import GlyphTeaser from './GlyphTeaser';
import type { Division } from '@/lib/division';

interface HeroFirmaProps {
  /** División activa de la página: su glifo queda fijo en ícono. */
  activa: Division;
}

// Las dos tarjetas M/W del hero (mockup 15-final-ajustado.html, "hero-firma"): la firma del
// grupo, lo primero de color que se ve. Cada una enlaza a su división; la activa muestra su
// ícono fijo (corazón en Creative, cursor en Web) y la otra lo revela al hover/foco y una
// sola vez al entrar en vista (GlyphTeaser), para que también se vea en móvil.
export default function HeroFirma({ activa }: HeroFirmaProps) {
  return (
    <div className="hero-firma" data-reveal>
      <Link href="/marketing" data-desde="hero-firma-creative" data-glyph-host data-firma="marketing" className="hero-firma-item" aria-label="Ver Pixies Creative">
        <DivisionGlyph letra="M" variant="marketing" fijo={activa === 'creative'} className="hero-firma-g" />
        <span className="hero-firma-item__etiqueta">Creative</span>
      </Link>
      <Link href="/web" data-desde="hero-firma-web" data-glyph-host data-firma="web" className="hero-firma-item" aria-label="Ver Pixies Digital Web Design">
        <DivisionGlyph letra="W" variant="web" fijo={activa === 'web'} className="hero-firma-g" />
        <span className="hero-firma-item__etiqueta">Web</span>
      </Link>
      <GlyphTeaser />
    </div>
  );
}
