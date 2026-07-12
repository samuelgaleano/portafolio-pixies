import { categories } from '@/data/categories';

// Captación de leads (plan F5 §2.2). Validación pura: se usa en el servidor
// (frontera de confianza) y en el cliente (UX). Sin dependencias.

export interface LeadPayload {
  nombre: string;
  contacto: string; // email O teléfono
  empresa?: string;
  tipoProyecto: string;
  mensaje?: string;
  desde: string; // origen del clic
  website?: string; // honeypot
}

export type LeadValidation = { ok: true } | { ok: false; campos: string[] };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// teléfono: + opcional, 7–15 dígitos (se ignoran espacios, guiones y paréntesis)
const isPhone = (v: string) => /^\+?\d{7,15}$/.test(v.replace(/[\s\-()]/g, ''));

export const PROJECT_TYPES = [...categories.map((c) => c.projectType), 'Otro'];

export function validateLead(p: Partial<LeadPayload>): LeadValidation {
  const campos: string[] = [];
  const nombre = (p.nombre ?? '').trim();
  if (nombre.length < 2 || nombre.length > 80) campos.push('nombre');
  const contacto = (p.contacto ?? '').trim();
  if (!EMAIL.test(contacto) && !isPhone(contacto)) campos.push('contacto');
  if ((p.empresa ?? '').length > 120) campos.push('empresa');
  if (!PROJECT_TYPES.includes(p.tipoProyecto ?? '')) campos.push('tipoProyecto');
  if ((p.mensaje ?? '').length > 1000) campos.push('mensaje');
  return campos.length ? { ok: false, campos } : { ok: true };
}

// wa.me exige el número sin +, espacios ni guiones. Texto con los datos del form (§8).
export function buildWhatsAppUrl(numero: string, p: Pick<LeadPayload, 'nombre' | 'tipoProyecto' | 'mensaje'>): string {
  const digits = numero.replace(/\D/g, '');
  const lineas = [
    `Hola, soy ${p.nombre}.`,
    `Me interesa: ${p.tipoProyecto}.`,
    ...(p.mensaje?.trim() ? [p.mensaje.trim()] : []),
    '(Enviado desde el portafolio de Pixies)',
  ];
  return `https://wa.me/${digits}?text=${encodeURIComponent(lineas.join('\n'))}`;
}

// Pre-selección del select según la sección de origen (§8). Orígenes genéricos → null.
export function desdeToProjectType(desde: string): string | null {
  return categories.find((c) => c.id === desde)?.projectType ?? null;
}
