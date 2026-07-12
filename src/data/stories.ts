// Historias de proyecto para /samuel (§7.3): el ángulo *cómo* y *por qué*, el rol de Samuel.
// Cruzan con el portafolio de la home (anchor a la categoría). Samuel afina el relato.
import type { CategoryId } from './categories';

export interface ProjectStory {
  projectName: string;
  category: CategoryId; // ancla a /#<category>
  role: string; // qué hizo Samuel
  decision: string; // la decisión de ingeniería clave y su porqué
}

// Nombres descriptivos verdaderos hasta tener los nombres comerciales reales
// [COMPLETAR: Samuel reemplaza con los nombres reales de cada proyecto]
export const stories: ProjectStory[] = [
  {
    projectName: 'El ERP que corre una operación',
    category: 'erp',
    role: 'Diseñé la arquitectura completa y lo construí de punta a punta.',
    decision:
      'Puse las reglas críticas (numeración, stock, permisos) en la base de datos, no en el cliente: así ningún error de UI puede corromper la operación.',
  },
  {
    projectName: 'El agente de contenido',
    category: 'ia',
    role: 'Definí el pipeline de skills y lo orquesté como sistema agéntico.',
    decision:
      'Separé cada paso en una skill auditable con datos de entrada/salida claros, para que el proceso sea reproducible y no una caja negra.',
  },
  {
    projectName: 'Sincronización de televisores en red local',
    category: 'empresarial',
    role: 'Resolví la sincronía de reproducción entre varias pantallas.',
    decision:
      'Todo corre en la red local del cliente: sin nube, sin costo mensual y con latencia mínima, que es justo lo que el caso exigía.',
  },
];
