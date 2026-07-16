import PixelGlyph from '@/components/ui/PixelGlyph';

// Encabezado de sección de /samuel (Samuel r3 2026-07-18): rompe la monotonía del stack
// centrado — índice de "capítulo" + titular a la izquierda y un glifo de píxel decorativo
// a la derecha, para equilibrar centro y lados de forma sobria. data-reveal para la cascada.
export default function SectionHead({
  index,
  title,
  intro,
  glyph = 'cluster',
}: {
  index: string;
  title: string;
  intro: string;
  glyph?: 'cluster' | 'spark' | 'cursor';
}) {
  return (
    <div data-reveal className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <p className="font-mono text-xs text-pixel-soft">{index}</p>
        <h2 className="mt-1 font-display text-h2 font-semibold">{title}</h2>
        <p className="mt-3 max-w-xl text-dim">{intro}</p>
      </div>
      <PixelGlyph name={glyph} className="hidden shrink-0 text-[10px] text-pixel-soft/45 lg:block" />
    </div>
  );
}
