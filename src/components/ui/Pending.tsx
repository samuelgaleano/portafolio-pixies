// Estado "en construcción" DISEÑADO: reemplaza todo [COMPLETAR] crudo
// visible. El motivo ▚ es el píxel de la firma; lee como decisión, no como descuido.
export default function Pending({ children }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-(--radius-s) border border-line bg-surface-2 px-2 py-0.5 font-mono text-xs text-dim">
      <span className="text-pixel" aria-hidden="true">
        ▚
      </span>
      {children ?? 'en construcción'}
    </span>
  );
}
