import { NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'node:crypto';
import { createRateLimiter } from '@/lib/rate-limit';

// POST /api/escucha-demo/download — fase 2 (§ plan "productos propios"): descarga gateada
// del ejecutable de escritorio con un ÚNICO código de acceso compartido que Samuel entrega
// manualmente por WhatsApp/LinkedIn. Sin base de datos de códigos individuales.
//
// Agnóstico de dónde vivan los instaladores (Vercel Blob, Drive, el storage que sea): las
// URLs se leen de variables de entorno — así no depende de aprovisionar un servicio
// específico para poder mergear el endpoint.
export const runtime = 'nodejs';

const limiter = createRateLimiter(15 * 60_000, 5);

export function __resetRateLimit() {
  limiter.reset();
}

// Comparación de tiempo constante: hashear antes de comparar evita que timingSafeEqual
// explote con longitudes distintas (un código mal tipeado no debería tirar 500) y evita que
// la duración de la comparación filtre en qué byte difiere el código real.
function safeEqual(a: string, b: string): boolean {
  const ah = createHash('sha256').update(a).digest();
  const bh = createHash('sha256').update(b).digest();
  return timingSafeEqual(ah, bh);
}

type Variant = 'nsis' | 'portable';

function urlForVariant(variant: Variant): string | undefined {
  return variant === 'nsis' ? process.env.ESCUCHA_DOWNLOAD_URL_NSIS : process.env.ESCUCHA_DOWNLOAD_URL_PORTABLE;
}

export async function POST(req: Request): Promise<NextResponse> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (limiter.isLimited(ip)) return NextResponse.json({ error: 'rate' }, { status: 429 });

  const accessCode = process.env.ESCUCHA_ACCESS_CODE;
  if (!accessCode) {
    console.error('[escucha-demo] ESCUCHA_ACCESS_CODE sin configurar');
    return NextResponse.json({ error: 'config' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'validacion' }, { status: 400 });
  }

  const { code, variant } = (body ?? {}) as { code?: unknown; variant?: unknown };
  if (typeof code !== 'string' || !code.trim()) {
    return NextResponse.json({ error: 'validacion' }, { status: 400 });
  }
  if (variant !== 'nsis' && variant !== 'portable') {
    return NextResponse.json({ error: 'validacion' }, { status: 400 });
  }

  // .trim() en ambos lados: es comun que un salto de linea o espacio se cuele al pegar
  // el valor en el dashboard de Vercel, y eso no deberia contar como "codigo incorrecto".
  // Nunca loguear el código recibido — solo si la comparación coincidió o no.
  if (!safeEqual(code.trim(), accessCode.trim())) {
    return NextResponse.json({ error: 'codigo' }, { status: 401 });
  }

  const url = urlForVariant(variant);
  if (!url) {
    console.error(`[escucha-demo] falta la URL de descarga para la variante "${variant}"`);
    return NextResponse.json({ error: 'config' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, url });
}
