import type { Metadata } from 'next';
import Hero from '@/components/hero/Hero';
import PortfolioSection from '@/components/portfolio/PortfolioSection';
import MidCta from '@/components/cta/MidCta';
import LeadForm from '@/components/leads/LeadForm';
import { t } from '@/i18n';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <PortfolioSection />

      <MidCta />

      <section id="contacto" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-24 sm:px-6">
          <h2 className="font-display text-h2 font-semibold">{t.contact.title}</h2>
          <p className="mt-4 max-w-xl text-dim">{t.contact.intro}</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
