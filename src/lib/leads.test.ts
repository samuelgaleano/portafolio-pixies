import { describe, expect, test } from 'vitest';
import { validateLead, buildWhatsAppUrl, desdeToProjectType } from './leads';

const base = {
  nombre: 'Ana Pérez',
  contacto: 'ana@ejemplo.com',
  tipoProyecto: 'Landing page',
  desde: 'landing',
};

describe('validateLead — validación en la frontera de confianza (TDD, plan F5 §2.3)', () => {
  test('payload feliz con email pasa', () => {
    expect(validateLead(base)).toEqual({ ok: true });
  });

  test('payload feliz con teléfono (+57 espacios/guiones) pasa', () => {
    expect(validateLead({ ...base, contacto: '+57 300-123-4567' })).toEqual({ ok: true });
  });

  test('nombre vacío o muy corto falla nombrando el campo', () => {
    expect(validateLead({ ...base, nombre: '' })).toEqual({ ok: false, campos: ['nombre'] });
    expect(validateLead({ ...base, nombre: 'A' })).toEqual({ ok: false, campos: ['nombre'] });
  });

  test('contacto que no es email ni teléfono falla', () => {
    expect(validateLead({ ...base, contacto: 'hola' })).toEqual({ ok: false, campos: ['contacto'] });
    expect(validateLead({ ...base, contacto: '12 34' })).toEqual({ ok: false, campos: ['contacto'] });
  });

  test('tipoProyecto fuera del catálogo falla', () => {
    expect(validateLead({ ...base, tipoProyecto: 'Hackear la NASA' })).toEqual({
      ok: false,
      campos: ['tipoProyecto'],
    });
  });

  test('límites de longitud: nombre>80, empresa>120, mensaje>1000 fallan', () => {
    expect(validateLead({ ...base, nombre: 'x'.repeat(81) })).toEqual({ ok: false, campos: ['nombre'] });
    expect(validateLead({ ...base, empresa: 'x'.repeat(121) })).toEqual({ ok: false, campos: ['empresa'] });
    expect(validateLead({ ...base, mensaje: 'x'.repeat(1001) })).toEqual({ ok: false, campos: ['mensaje'] });
  });

  test('varios campos malos → lista completa', () => {
    expect(validateLead({ ...base, nombre: '', contacto: 'nope' })).toEqual({
      ok: false,
      campos: ['nombre', 'contacto'],
    });
  });

  test('I3: contacto de más de 120 chars falla (email regex sin tope)', () => {
    expect(validateLead({ ...base, contacto: `${'a'.repeat(150)}@x.co` })).toEqual({
      ok: false,
      campos: ['contacto'],
    });
  });

  test('M1: tipos no-string (curl malicioso) no lanzan TypeError, fallan limpio', () => {
    const r = validateLead({ nombre: 123, contacto: null, tipoProyecto: {} } as never);
    expect(r.ok).toBe(false);
  });
});

describe('buildWhatsAppUrl — mensaje prellenado (§8: nombre, tipo, mensaje)', () => {
  test('número se limpia a dígitos y el texto va URL-encoded', () => {
    const url = buildWhatsAppUrl('+57 300 123 4567', { ...base, mensaje: '¿Cuánto vale?' });
    expect(url.startsWith('https://wa.me/573001234567?text=')).toBe(true);
    const text = decodeURIComponent(url.split('?text=')[1]);
    expect(text).toContain('Ana Pérez');
    expect(text).toContain('Landing page');
    expect(text).toContain('¿Cuánto vale?');
    expect(text).not.toContain('undefined');
  });

  test('sin mensaje opcional no aparece "undefined"', () => {
    const text = decodeURIComponent(buildWhatsAppUrl('573001234567', base).split('?text=')[1]);
    expect(text).not.toContain('undefined');
  });
});

describe('desdeToProjectType — pre-selección por sección de origen (§8)', () => {
  test('ids de categoría mapean a su projectType', () => {
    expect(desdeToProjectType('landing')).toBe('Landing page');
    expect(desdeToProjectType('erp')).toBe('ERP / Software a medida');
    expect(desdeToProjectType('ia')).toBe('IA');
  });

  test('orígenes genéricos (hero/header/general/samuel/desconocido) → null (usuario elige)', () => {
    for (const d of ['hero', 'header', 'general', 'samuel', 'lo-que-sea']) {
      expect(desdeToProjectType(d)).toBeNull();
    }
  });
});
