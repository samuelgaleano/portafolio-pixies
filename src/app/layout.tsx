import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OriginTracker from '@/components/leads/OriginTracker';
import RevealObserver from '@/components/fx/RevealObserver';
import PageTransition from '@/components/fx/PageTransition';
import ScrollProgress from '@/components/fx/ScrollProgress';
import AmbientDots from '@/components/fx/AmbientDots';
import EngineerTransition from '@/components/fx/EngineerTransition';
import DivisionSync from '@/components/fx/DivisionSync';
import { t } from '@/i18n';
import { site } from '@/data/site';
import './globals.css';

// Fija data-division en <html> ANTES de hidratar (mismo patrón que un script de tema): el
// header, el CTA y la banda del wordmark leen --acento desde el primer pintado, sin flash de
// tinta neutra → color. Debe coincidir con divisionDeRuta() en src/lib/division.ts.
const DIVISION_SCRIPT =
  "(function(){var p=location.pathname;document.documentElement.dataset.division=" +
  "p==='/marketing'||p.indexOf('/marketing/')===0?'creative':" +
  "/^\\/(web|demos|proyectos|aplicaciones|samuel)(\\/|$)/.test(p)?'web':'grupo'})();";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: t.meta.title,
  description: t.meta.description,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: site.name,
  },
  twitter: { card: 'summary_large_image' },
  // Código de verificación HTML-tag de Search Console para https://www.pixiesdesigngroup.com
  // (propiedad dada de alta el 2026-09-14). No es un secreto: el propio método de verificación
  // consiste en publicarlo en el HTML, así que va literal en vez de por variable de entorno.
  verification: { google: 'xTvZUDZFXFWwIk0f3zFl0wWyvjdLNWEHMBYreGf5X8U' },
};

export const viewport: Viewport = {
  themeColor: '#f2eefc',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // data-scroll-behavior: desde Next 16 hay que declararlo para que Next desactive el
  // `scroll-behavior: smooth` de globals.css durante la navegación entre páginas — sin
  // esto, al ir de la home a /aplicaciones/... el scroll animado se quedaba a mitad y la
  // página nueva aparecía por el footer en vez de por arriba.
  return (
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: DIVISION_SCRIPT }} />
        <link
          rel="preload"
          href="/fonts/ClashDisplay-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/GeneralSans-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-pixel-soft focus:px-4 focus:py-2 focus:font-medium focus:text-void"
        >
          {t.nav.skip}
        </a>
        <AmbientDots />
        <EngineerTransition />
        <DivisionSync />
        <OriginTracker />
        <RevealObserver />
        <ScrollProgress />
        <Header />
        <main id="main">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
