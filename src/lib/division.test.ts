import { describe, expect, test } from 'vitest';
import { divisionDeRuta, DIVISIONES, ORDEN_SELECTOR } from './division';

describe('divisionDeRuta — qué división es cada ruta', () => {
  test('la home es el grupo', () => {
    expect(divisionDeRuta('/')).toBe('grupo');
    expect(divisionDeRuta(null)).toBe('grupo');
    expect(divisionDeRuta(undefined)).toBe('grupo');
  });

  test('/marketing es Creative (la ruta no cambió con el nombre)', () => {
    expect(divisionDeRuta('/marketing')).toBe('creative');
    expect(divisionDeRuta('/marketing#contacto')).toBe('creative');
  });

  test('/web y todo lo que ya existía (demos, proyectos, apps, el ingeniero) es Web', () => {
    for (const p of ['/web', '/demos/erp', '/proyectos/analisis-saber11', '/aplicaciones/escuchacomprendiendo-ai', '/samuel', '/samuel/posts/x']) {
      expect(divisionDeRuta(p), p).toBe('web');
    }
  });

  test('una ruta desconocida cae en grupo, nunca revienta', () => {
    expect(divisionDeRuta('/lo-que-sea')).toBe('grupo');
  });
});

describe('DIVISIONES — cada división tiene destino y CTA propios', () => {
  test.each(ORDEN_SELECTOR)('%s', (d) => {
    expect(DIVISIONES[d].href).toMatch(/^\//);
    expect(DIVISIONES[d].ctaHeader.length).toBeGreaterThan(5);
    expect(DIVISIONES[d].etiqueta.length).toBeGreaterThan(2);
  });

  test('el href de cada división corresponde a su ruta', () => {
    expect(divisionDeRuta(DIVISIONES.creative.href)).toBe('creative');
    expect(divisionDeRuta(DIVISIONES.web.href)).toBe('web');
    expect(divisionDeRuta(DIVISIONES.grupo.href)).toBe('grupo');
  });
});

describe('ORDEN_SELECTOR — el grupo va en la mitad (Samuel, 2026-09-22)', () => {
  test('Creative a la izquierda, Grupo al centro, Web a la derecha', () => {
    expect(ORDEN_SELECTOR).toEqual(['creative', 'grupo', 'web']);
  });
});
