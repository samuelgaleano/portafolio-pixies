import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OriginTracker from '@/components/leads/OriginTracker';
import RevealObserver from '@/components/fx/RevealObserver';
import PageTransition from '@/components/fx/PageTransition';
import PixelCursor from '@/components/fx/PixelCursor';
import { t } from '@/i18n';
import { site } from '@/data/site';
import './globals.css';

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
};

export const viewport: Viewport = {
  themeColor: '#0b0d12',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
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
        <OriginTracker />
        <RevealObserver />
        <PixelCursor />
        <Header />
        <main id="main">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
