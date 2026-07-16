// Fecha larga en español: "11 de julio de 2026".
// timeZone UTC para que una fecha-solo del frontmatter (medianoche UTC) no se corra un día
// al formatear en zonas con offset negativo (Colombia UTC-5).
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}
