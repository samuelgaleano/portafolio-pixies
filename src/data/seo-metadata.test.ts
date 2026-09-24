import { describe, expect, test } from 'vitest';
import { escuchaProduct } from './escucha-comprendiendo';
import { es } from '@/i18n/es';
import { metadata as webMetadata } from '@/app/web/page';

// Guardia contra la regresión de la auditoría SEO del 2026-09-24: la descripción de
// metadatos de escuchacomprendiendo.IA llegó a producción con 309 caracteres — Google la
// truncaba a mitad de frase. `<meta name="description">` tiene un tope real (~155-160
// caracteres visibles); pasado eso, el recorte deja la frase sin terminar en el resultado
// de búsqueda. Esta prueba no re-implementa el límite de Google, solo evita que un campo de
// METADATOS (no el copy de la página, que puede ser largo) vuelva a superarlo sin que nadie
// lo note hasta verlo truncado en producción.
const TOPE_DESCRIPCION = 165; // margen sobre los ~160 reales: castiga solo excesos claros

describe('longitud de metadatos (auditoría SEO)', () => {
  test('la meta-descripción de escuchacomprendiendo.IA cabe en un resultado de búsqueda', () => {
    expect(escuchaProduct.metaDescripcion.length).toBeLessThanOrEqual(TOPE_DESCRIPCION);
  });

  test('la meta-descripción de /marketing cabe en un resultado de búsqueda', () => {
    expect(es.marketing.metaDescription.length).toBeLessThanOrEqual(TOPE_DESCRIPCION);
  });

  test('el copy largo de la página (`descripcion`) sigue siendo el completo, sin recortar', () => {
    // el campo de metadatos es corto A PROPÓSITO; el de la página no debería serlo también
    // por error de copiar y pegar el campo equivocado
    expect(escuchaProduct.descripcion.length).toBeGreaterThan(TOPE_DESCRIPCION);
  });

  test('el título y la meta-descripción de /web caben en un resultado de búsqueda', () => {
    expect((webMetadata.title as string).length).toBeLessThanOrEqual(60);
    expect((webMetadata.description as string).length).toBeLessThanOrEqual(TOPE_DESCRIPCION);
  });
});
