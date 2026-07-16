// Historias de proyecto para /samuel (§7.3): el ángulo *cómo* y *por qué*, el rol de Samuel.
// Cruzan con el portafolio de la home (anchor a la categoría). Samuel afina el relato.
import type { CategoryId } from './categories';

export interface ProjectStory {
  projectName: string;
  category: CategoryId; // ancla a /#<category>
  role: string; // qué hizo Samuel
  decision: string; // la decisión de ingeniería clave y su porqué
}

// Historias REALES: cada una es un proyecto del portafolio, contado por la decisión
// de ingeniería que lo definió (la parte que no se ve en una tarjeta).
export const stories: ProjectStory[] = [
  {
    projectName: 'El ERP que corre una operación (ISO 27001)',
    category: 'erp',
    role: 'Diseñé la arquitectura completa y lo construí módulo a módulo contra la operación real.',
    decision:
      'Puse las reglas críticas (numeración, stock, permisos) en la base de datos, no en el cliente: así ningún error de UI puede corromper la operación. Y la seguridad se trabajó para pasar auditoría, no para aparentar.',
  },
  {
    projectName: 'Saber 11: del CSV sucio al modelo',
    category: 'datos',
    role: 'Limpié, exploré y modelé 965 instituciones educativas en R.',
    decision:
      'Antes de opinar, reconcilié cada cifra contra la base: los duplicados, los valores rotos y las imputaciones quedaron documentados en el script. Un análisis que no se puede reproducir no es un análisis.',
  },
  {
    projectName: 'Sincronización de televisores en red local',
    category: 'empresarial',
    role: 'Resolví la sincronía de reproducción entre varias pantallas.',
    decision:
      'Todo corre en la red local del cliente: sin nube, sin costo mensual y con latencia mínima, que es justo lo que el caso exigía.',
  },
  {
    projectName: 'Fly & Chill: la tienda y su servidor',
    category: 'catalogo',
    role: 'Monté la tienda completa y administro por terminal la instancia donde vive.',
    decision:
      'Elegí un servidor propio (EC2 con nginx y PM2) en vez de serverless para dejar el costo fijo en lo mínimo — y cuando el build se quedaba sin memoria, la respuesta fue swap y code-splitting, no una máquina más cara.',
  },
];
