import type { Metadata } from 'next';
import Hero from '@/components/hero/Hero';
import PortfolioSection from '@/components/portfolio/PortfolioSection';
import MidCta from '@/components/cta/MidCta';
import { t } from '@/i18n';
import { site } from '@/data/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <PortfolioSection />

      <MidCta />

      {/* Fase 5: LeadForm reemplaza este placeholder */}
      <section id="contacto" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-24 sm:px-6">
          <h2 className="font-display text-h2 font-semibold">{t.contact.title}</h2>
          <p className="mt-4 max-w-xl text-dim">{t.contact.hint}</p>
          <p className="mt-3 font-mono text-sm text-dim">
            whatsapp → {site.whatsapp}
            <br />
            correo → {site.email}
          </p>
        </div>
      </section>
    </>
  );
}
