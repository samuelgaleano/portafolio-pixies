// Lectura estimada a ~200 palabras/min. Mínimo 1.
export function readingTime(raw: string): number {
  const words = raw.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
