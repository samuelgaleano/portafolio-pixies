// Hora local de Colombia (America/Bogota, GMT-5 sin DST) para la capa de datos viva.
const fmt = new Intl.DateTimeFormat('es-CO', {
  timeZone: 'America/Bogota',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export function bogotaTime(date: Date): string {
  return fmt.format(date);
}
