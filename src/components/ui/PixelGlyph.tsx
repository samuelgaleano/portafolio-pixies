// Glifos de píxel en caracteres de bloque (spec capa-viva, referencia Barbiana Liu:
// su arte ASCII con $, + y -; aquí la materia prima son bloques = píxeles).
// <pre> estático, aria-hidden, cero JS. Eco menor de la firma, solo en zonas de respiro.
const GLYPHS = {
  // chispa: un píxel "encendiéndose"
  spark: `   ▄
 ▄ █ ▄
▀▄███▄▀
 ▀███▀
▄▀▄█▄▀▄
   ▀`,
  // cursor: la flecha clásica del puntero, pixelada
  cursor: `█
██
███
████
█████
██▀██
█▀  ▀█
▀    ▀`,
  // cluster: bloques ensamblándose (la firma en miniatura)
  cluster: `▛▀▜ ▄▄  ▖
▙▄▟ █▌ ▗▘
 ▗▄ ▀▘ █▌
▐█▛ ▚▖ ▝▘`,
} as const;

interface Props {
  name: keyof typeof GLYPHS;
  className?: string;
}

export default function PixelGlyph({ name, className = '' }: Props) {
  return (
    <pre aria-hidden="true" className={`pixel-glyph ${className}`}>
      {GLYPHS[name]}
    </pre>
  );
}
