import { describe, expect, test } from 'vitest';
import {
  validateAudioFile,
  validateTranscriptForStructuring,
  clampSegmentsToWindow,
  parseStructuredResponse,
} from './escucha';

describe('validateAudioFile', () => {
  test('archivo vacío → detalle "vacio"', () => {
    expect(validateAudioFile({ size: 0, type: 'audio/mpeg', name: 'nota.mp3' })).toEqual({
      ok: false,
      detalle: 'vacio',
    });
  });

  test('tamaño excedido (>4MB) → detalle "tamano"', () => {
    expect(
      validateAudioFile({ size: 5 * 1024 * 1024, type: 'audio/mpeg', name: 'nota.mp3' })
    ).toEqual({ ok: false, detalle: 'tamano' });
  });

  test('extensión no permitida y content-type no reconocido → detalle "formato"', () => {
    expect(validateAudioFile({ size: 1000, type: 'video/mp4', name: 'nota.mov' })).toEqual({
      ok: false,
      detalle: 'formato',
    });
  });

  test('extensión válida aunque el content-type venga vacío → ok', () => {
    expect(validateAudioFile({ size: 1000, type: '', name: 'nota.m4a' })).toEqual({ ok: true });
  });

  test('content-type válido aunque la extensión no matchee → ok', () => {
    expect(validateAudioFile({ size: 1000, type: 'audio/webm', name: 'blob' })).toEqual({ ok: true });
  });
});

describe('clampSegmentsToWindow', () => {
  test('descarta segmentos que empiezan después de la ventana (90s por defecto)', () => {
    const segments = [
      { start: 0, end: 5, text: 'a' },
      { start: 80, end: 92, text: 'b' },
      { start: 95, end: 100, text: 'c' },
    ];
    expect(clampSegmentsToWindow(segments)).toEqual(segments.slice(0, 2));
  });

  test('trunca a un máximo de 60 segmentos', () => {
    const segments = Array.from({ length: 100 }, (_, i) => ({ start: i * 0.5, end: i * 0.5 + 0.5, text: `s${i}` }));
    expect(clampSegmentsToWindow(segments)).toHaveLength(60);
  });
});

describe('validateTranscriptForStructuring', () => {
  const base = { text: 'hola', segments: [{ start: 0, end: 1, text: 'hola' }] };

  test('transcript válido → ok', () => {
    expect(validateTranscriptForStructuring(base)).toEqual({ ok: true });
  });

  test('no es un objeto → inválido', () => {
    expect(validateTranscriptForStructuring('nope')).toEqual({ ok: false, detalle: 'transcript-invalido' });
  });

  test('text vacío → inválido', () => {
    expect(validateTranscriptForStructuring({ ...base, text: '  ' })).toEqual({
      ok: false,
      detalle: 'transcript-invalido',
    });
  });

  test('text fabricado gigante (>6000 chars) → inválido', () => {
    expect(validateTranscriptForStructuring({ ...base, text: 'a'.repeat(6001) })).toEqual({
      ok: false,
      detalle: 'transcript-invalido',
    });
  });

  test('segments no es array → inválido', () => {
    expect(validateTranscriptForStructuring({ ...base, segments: 'nope' })).toEqual({
      ok: false,
      detalle: 'transcript-invalido',
    });
  });

  test('más de 200 segmentos fabricados → inválido', () => {
    const segments = Array.from({ length: 201 }, (_, i) => ({ start: i, end: i + 1, text: 's' }));
    expect(validateTranscriptForStructuring({ ...base, segments })).toEqual({
      ok: false,
      detalle: 'transcript-invalido',
    });
  });

  test('un segmento con forma inválida → inválido', () => {
    expect(validateTranscriptForStructuring({ ...base, segments: [{ start: 'no', text: 'x' }] })).toEqual({
      ok: false,
      detalle: 'transcript-invalido',
    });
  });
});

describe('parseStructuredResponse', () => {
  const valid = JSON.stringify({
    resumen: 'resumen',
    areas: [
      {
        nombre: 'Área 1',
        conceptos: [{ texto: 'c1', citas: [1.2] }],
        decisiones: [],
        tareas: [],
        riesgos: [],
        noSeSabe: [],
      },
    ],
  });

  test('JSON con la forma correcta → objeto parseado', () => {
    expect(parseStructuredResponse(valid)).toEqual({
      resumen: 'resumen',
      areas: [
        {
          nombre: 'Área 1',
          conceptos: [{ texto: 'c1', citas: [1.2] }],
          decisiones: [],
          tareas: [],
          riesgos: [],
          noSeSabe: [],
        },
      ],
    });
  });

  test('JSON malformado (no parsea) → null', () => {
    expect(parseStructuredResponse('{no-json')).toBeNull();
  });

  test('JSON válido pero sin "resumen" → null', () => {
    expect(parseStructuredResponse(JSON.stringify({ areas: [] }))).toBeNull();
  });

  test('un área sin "nombre" → null', () => {
    expect(
      parseStructuredResponse(
        JSON.stringify({ resumen: 'r', areas: [{ conceptos: [], decisiones: [], tareas: [], riesgos: [], noSeSabe: [] }] })
      )
    ).toBeNull();
  });

  test('un ítem citado sin "texto" → null', () => {
    expect(
      parseStructuredResponse(
        JSON.stringify({
          resumen: 'r',
          areas: [{ nombre: 'A', conceptos: [{ citas: [1] }], decisiones: [], tareas: [], riesgos: [], noSeSabe: [] }],
        })
      )
    ).toBeNull();
  });

  test('citas con tipos mezclados: se filtran los que no son número', () => {
    const raw = JSON.stringify({
      resumen: 'r',
      areas: [
        {
          nombre: 'A',
          conceptos: [{ texto: 'x', citas: [1, 'no', 2] }],
          decisiones: [],
          tareas: [],
          riesgos: [],
          noSeSabe: [],
        },
      ],
    });
    expect(parseStructuredResponse(raw)?.areas[0].conceptos[0].citas).toEqual([1, 2]);
  });
});

// Grafo de contexto (2026-09-23): es la parte que Samuel pidió mostrar porque es el valor
// agregado frente a "transcribir y resumir". Se prueba sobre todo lo que NO debe pasar: un
// vínculo que apunta a un nodo inexistente es exactamente la alucinación que la app dice
// evitar, así que no puede llegar nunca a la pantalla.
describe('parseStructuredResponse · grafo y certeza', () => {
  const base = {
    resumen: 'x',
    areas: [{ nombre: 'A', conceptos: [], decisiones: [], tareas: [], riesgos: [], noSeSabe: [] }],
  };

  test('devuelve nodos y vinculos cuando vienen bien formados', () => {
    const raw = JSON.stringify({
      ...base,
      nodos: [
        { id: 'n1', etiqueta: 'Presupuesto', tipo: 'concepto' },
        { id: 'n2', etiqueta: 'Recortar pauta', tipo: 'decision' },
      ],
      vinculos: [{ de: 'n1', a: 'n2', relacion: 'obliga a' }],
    });
    const out = parseStructuredResponse(raw);
    expect(out?.nodos).toHaveLength(2);
    expect(out?.vinculos).toEqual([{ de: 'n1', a: 'n2', relacion: 'obliga a' }]);
  });

  test('descarta el vinculo que apunta a un nodo inexistente', () => {
    const raw = JSON.stringify({
      ...base,
      nodos: [
        { id: 'n1', etiqueta: 'A', tipo: 'concepto' },
        { id: 'n2', etiqueta: 'B', tipo: 'tarea' },
      ],
      vinculos: [
        { de: 'n1', a: 'n2', relacion: 'lleva a' },
        { de: 'n1', a: 'n99', relacion: 'inventado' },
      ],
    });
    expect(parseStructuredResponse(raw)?.vinculos).toEqual([{ de: 'n1', a: 'n2', relacion: 'lleva a' }]);
  });

  test('un grafo sin vinculos utiles no se muestra', () => {
    const raw = JSON.stringify({
      ...base,
      nodos: [{ id: 'n1', etiqueta: 'Solo', tipo: 'concepto' }],
      vinculos: [{ de: 'n1', a: 'n1', relacion: 'consigo misma' }],
    });
    const out = parseStructuredResponse(raw);
    expect(out).not.toBeNull();
    expect(out?.nodos).toBeUndefined();
  });

  test('si falta el grafo, el resto del resultado sigue siendo valido', () => {
    const out = parseStructuredResponse(JSON.stringify(base));
    expect(out?.resumen).toBe('x');
    expect(out?.nodos).toBeUndefined();
  });

  test('un tipo de nodo desconocido cae a concepto en vez de tumbar el parseo', () => {
    const raw = JSON.stringify({
      ...base,
      nodos: [
        { id: 'n1', etiqueta: 'A', tipo: 'inventado' },
        { id: 'n2', etiqueta: 'B', tipo: 'riesgo' },
      ],
      vinculos: [{ de: 'n1', a: 'n2', relacion: 'r' }],
    });
    expect(parseStructuredResponse(raw)?.nodos?.[0]?.tipo).toBe('concepto');
  });

  test('la certeza solo se conserva si es uno de los tres valores permitidos', () => {
    const raw = JSON.stringify({
      resumen: 'x',
      areas: [
        {
          nombre: 'A',
          conceptos: [
            { texto: 'a', citas: [], certeza: 'incierto' },
            { texto: 'b', citas: [], certeza: 'muy-seguro' },
          ],
          decisiones: [],
          tareas: [],
          riesgos: [],
          noSeSabe: [],
        },
      ],
    });
    const conceptos = parseStructuredResponse(raw)?.areas[0]?.conceptos;
    expect(conceptos?.[0]?.certeza).toBe('incierto');
    expect(conceptos?.[1]?.certeza).toBeUndefined();
  });
});
