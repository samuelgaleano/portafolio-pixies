import { escuchaProduct } from './escucha-comprendiendo';

// "Aplicaciones by Pixies" (pedido de Samuel): en la home solo una tarjeta visual por app —
// qué es y qué hace, en una frase — y todo lo interactivo (probar, descargar) vive en la
// página propia de cada app. Así la home no se alarga ni le roba atención al resto.
//
// Este arreglo es la ÚNICA lista de apps: de acá salen la home, el sitemap y las rutas
// (`appPath`). El `slug` debe coincidir con la carpeta en src/app/aplicaciones/<slug>/.
export type AppIconId = 'audio-a-grafo';

export interface PixiesApp {
  slug: string;
  nombre: string;
  icon: AppIconId; // glifo de la tarjeta, resuelto en AppsShowcase — uno por app, no uno global
  hook: string; // la frase que explica qué hace, sin jerga (viene del producto, un solo dueño)
  descripcion: string; // qué se puede hacer desde su página — NO repite el hook
  capacidades: string[]; // chips: solo lo que de verdad existe hoy
  /** Ficha tipo tienda de aplicaciones (Samuel, 2026-09-23: "un recuadro tipo App Store").
   * Son datos VERIFICABLES: versión publicada, plataforma, formato y precio. Deliberadamente
   * NO hay estrellas ni número de descargas — no los tenemos y no se inventan. */
  ficha: { desarrollador: string; categoria: string; plataforma: string; version: string; formato: string; precio: string };
}

export const APPS_BASE = '/aplicaciones';
export const appPath = (slug: string) => `${APPS_BASE}/${slug}`;

export const apps: PixiesApp[] = [
  {
    slug: 'escuchacomprendiendo-ai',
    nombre: 'escuchacomprendiendo.IA',
    icon: 'audio-a-grafo',
    hook: escuchaProduct.tagline,
    descripcion:
      'Como Obsidian con esteroides, combinado con transcripción: motor propio de IA que arma el grafo de lo que dijiste y lo acumula por proyecto. La versión completa corre en tu computador (Windows).',
    // "Ejemplo real" solo se promete cuando el ejemplo curado existe de verdad (honestidad
    // sobre sensacionalismo: nada de anunciar contenido que hoy renderiza "en preparación").
    capacidades: [
      'Grafo de contexto',
      'Citas con el segundo exacto',
      'Contexto por proyecto',
      ...(escuchaProduct.example.ready ? ['Ejemplo real'] : []),
    ],
    ficha: {
      desarrollador: 'Pixies Design Group',
      categoria: 'Productividad y conocimiento',
      plataforma: 'Windows',
      version: '1.0.1',
      formato: 'Instalador y portable',
      precio: 'Gratis, con código de acceso',
    },
  },
];
