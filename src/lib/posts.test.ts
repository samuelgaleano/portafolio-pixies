import { describe, expect, test } from 'vitest';
import { parsePost, isValidSlug } from './posts';

const valid = `---
title: "Un post"
description: "Descripción del post"
pubDate: 2026-07-11
---

Contenido.`;

describe('parsePost — validación de frontmatter (falla el build con post mal formado, contrato §7.4)', () => {
  test('parsea un post válido con draft=false por defecto', () => {
    const p = parsePost(valid, 'un-post.mdx');
    expect(p.title).toBe('Un post');
    expect(p.description).toBe('Descripción del post');
    expect(p.pubDate.toISOString()).toBe('2026-07-11T00:00:00.000Z');
    expect(p.draft).toBe(false);
    expect(p.slug).toBe('un-post');
    expect(p.content).toContain('Contenido.');
  });

  test('parsea draft: true', () => {
    const raw = valid.replace('---\n\nContenido.', 'draft: true\n---\n\nContenido.');
    expect(parsePost(raw, 'un-post.mdx').draft).toBe(true);
  });

  test('title faltante lanza error nombrando archivo y campo', () => {
    const raw = valid.replace('title: "Un post"\n', '');
    expect(() => parsePost(raw, 'roto.mdx')).toThrow(/roto\.mdx.*title/);
  });

  test('description faltante lanza error', () => {
    const raw = valid.replace('description: "Descripción del post"\n', '');
    expect(() => parsePost(raw, 'roto.mdx')).toThrow(/roto\.mdx.*description/);
  });

  test('pubDate faltante lanza error', () => {
    const raw = valid.replace('pubDate: 2026-07-11\n', '');
    expect(() => parsePost(raw, 'roto.mdx')).toThrow(/roto\.mdx.*pubDate/);
  });

  test('pubDate inválida (typo) lanza error, no Invalid Date silencioso', () => {
    const raw = valid.replace('2026-07-11', 'no-es-fecha');
    expect(() => parsePost(raw, 'roto.mdx')).toThrow(/roto\.mdx.*pubDate/);
  });
});

describe('isValidSlug — guard contra path traversal en /samuel/posts/[slug]', () => {
  test('acepta slugs kebab-case', () => {
    expect(isValidSlug('hola-mundo-pixies')).toBe(true);
    expect(isValidSlug('post-2')).toBe(true);
  });

  test('rechaza path traversal y caracteres fuera de [a-z0-9-]', () => {
    expect(isValidSlug('../../docs/DECISIONES')).toBe(false);
    expect(isValidSlug('..%2F..%2Fsecret')).toBe(false);
    expect(isValidSlug('a b')).toBe(false);
    expect(isValidSlug('UPPER')).toBe(false);
    expect(isValidSlug('')).toBe(false);
  });
});
