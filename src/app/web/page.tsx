import type { Metadata } from 'next';
import SchemaOrg from '@/components/seo/SchemaOrg';
import Hero from '@/components/hero/Hero';
import PortfolioSection from '@/components/portfolio/PortfolioSection';
import Statement from '@/components/cta/Statement';
import MidCta from '@/components/cta/MidCta';
import EngineerTeaser from '@/components/cta/EngineerTeaser';
import LeadForm from '@/components/leads/LeadForm';
import GradientText from '@/components/ui/GradientText';
import Atmosphere from '@/components/fx/Atmosphere';
import { t } from '@/i18n';

// Contenido movido desde `/` (grupo-y-marketing, 2026-09): esta es la división Web tal
// como vivía en la home antes de la bifurcación — mismo Hero, mismo portafolio, sin
// reescribir nada. `/` ahora es la landing del grupo (Hero compartido + GrupoSplit).
export const metadata: Metadata = {
  title: 'Pixies Digital Web Design · Web design, data, AI y soluciones digitales',
  description:
    'Software a medida que corre en producción: páginas web, ERP, análisis de datos, IA y ciberseguridad para PyMEs y medianas empresas. El código está en producción, no en Figma.',
  alternates: { canonical: '/web' },
  openGraph: {
    type: 'website',
    title: 'Pixies Digital Web Design',
    description: 'Software a medida que corre en producción, no en Figma.',
  },
};

export default function WebPage() {
  return (
    <>
      <SchemaOrg type="organization" />
      <Hero />

      <PortfolioSection />

      <Statement />

      <MidCta />

      <EngineerTeaser />

      <section id="contacto" className="relative overflow-hidden border-t border-line">
        <Atmosphere animate={false} />
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 py-24 sm:px-6">
          <h2 className="font-display text-h2 font-semibold">
            <GradientText text={t.contact.title} em="tu proyecto" />
          </h2>
          <p className="mt-4 max-w-xl text-dim">{t.contact.intro}</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
