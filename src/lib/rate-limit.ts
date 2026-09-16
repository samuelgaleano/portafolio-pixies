// Limitador de tasa en memoria por IP, sliding window — compartido por toda ruta API que lo
// necesite (leads, escucha-demo/*). En Fluid Compute las instancias se reutilizan, así que
// alcanza sin una base de datos externa. Antes vivía duplicado en cada route.ts; factorizado
// acá para arreglar el comportamiento en un solo lugar en vez de en N copias divergentes.
export interface RateLimiter {
  isLimited(ip: string): boolean;
  reset(): void;
}

export function createRateLimiter(windowMs: number, maxPerWindow: number): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    isLimited(ip: string): boolean {
      const now = Date.now();
      // higiene: sin sweep, el Map acumularía una entrada por IP para siempre
      if (hits.size > 1000) {
        for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
      }
      const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
      list.push(now);
      hits.set(ip, list);
      return list.length > maxPerWindow;
    },
    reset(): void {
      hits.clear();
    },
  };
}
