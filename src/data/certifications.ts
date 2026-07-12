// Trayectoria y estudios para el "mapa de conocimiento" de /samuel (§7.3).
// NO se renderiza como lista plana. Samuel reemplaza con datos reales y enlaces verificables.
// Prohibido inventar credenciales que parezcan reales.
export type CredKind = 'titulo' | 'certificado' | 'curso';

export interface Credential {
  title: string;
  institution: string;
  year: string;
  url?: string; // enlace verificable cuando exista
  kind: CredKind;
}

export const kindGroups: { kind: CredKind; label: string }[] = [
  { kind: 'titulo', label: 'Formación' },
  { kind: 'certificado', label: 'Certificaciones' },
  { kind: 'curso', label: 'Cursos y especialización' },
];

export const credentials: Credential[] = [
  {
    title: 'Ingeniería de Sistemas',
    institution: '[COMPLETAR: universidad]',
    year: '[COMPLETAR: años]',
    kind: 'titulo',
  },
  {
    title: '[COMPLETAR: nombre del certificado]',
    institution: '[COMPLETAR: entidad]',
    year: '[COMPLETAR]',
    url: '', // [COMPLETAR: enlace verificable]
    kind: 'certificado',
  },
  {
    title: '[COMPLETAR: nombre del certificado]',
    institution: '[COMPLETAR: entidad]',
    year: '[COMPLETAR]',
    url: '',
    kind: 'certificado',
  },
  {
    title: '[COMPLETAR: curso o especialización]',
    institution: '[COMPLETAR: plataforma/entidad]',
    year: '[COMPLETAR]',
    url: '',
    kind: 'curso',
  },
];
