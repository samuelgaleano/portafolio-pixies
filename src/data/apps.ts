import { escuchaProduct } from './escucha-comprendiendo';

// "Aplicaciones by Pixies" (pedido de Samuel): en la home solo una tarjeta visual por app —
// qué es y qué hace, en una frase — y todo lo interactivo (probar, descargar) vive en la
// página propia de cada app. Así la home no se alarga ni le roba atención al resto.
//
// Este arreglo es la ÚNICA lista de apps: de acá salen la home, el sitemap y las rutas
// (`appPath`). El `slug` debe coincidir con la carpeta en src/app/aplicaciones/<slug>/.
export type AppIconId = 'audio-a-lista';

export interface PixiesApp {
  slug: string;
  nombre: string;
  icon: AppIconId; // glifo de la tarjeta, resuelto en AppsShowcase — uno por app, no uno global
  hook: string; // la frase que explica qué hace, sin jerga (viene del producto, un solo dueño)
  descripcion: string; // qué se puede hacer desde su página — NO repite el hook
  capacidades: string[]; // chips: solo lo que de verdad existe hoy
}

export const APPS_BASE = '/aplicaciones';
export const appPath = (slug: string) => `${APPS_BASE}/${slug}`;

export const apps: PixiesApp[] = [
  {
    slug: 'escuchacomprendiendo-ai',
    nombre: 'escuchacomprendiendo.ai',
    icon: 'audio-a-lista',
    hook: escuchaProduct.tagline,
    descripcion:
      'Producto propio. La app completa corre en tu computador (Windows); entrá para probar una versión liviana en el navegador con tu propio audio, o para descargarla con tu código de acceso.',
    // "Ejemplo real" solo se promete cuando el ejemplo curado existe de verdad (honestidad
    // sobre sensacionalismo: nada de anunciar contenido que hoy renderiza "en preparación").
    capacidades: [
      'Probar en vivo',
      ...(escuchaProduct.example.ready ? ['Ejemplo real'] : []),
      'Descargar para Windows',
    ],
  },
];
