import type { Metadata } from 'next';
import SchemaOrg from '@/components/seo/SchemaOrg';
import MarketingHero from '@/components/marketing/MarketingHero';
import Servicios from '@/components/marketing/Servicios';
import Metodo from '@/components/marketing/Metodo';
import EquipoMarketing from '@/components/marketing/EquipoMarketing';
import Comparativa from '@/components/marketing/Comparativa';
import CasosMarketing from '@/components/marketing/CasosMarketing';
import ContentHubTeaser from '@/components/marketing/ContentHubTeaser';
import LeadForm from '@/components/leads/LeadForm';
import { t } from '@/i18n';

// División Marketing (grupo-y-marketing, 2026-09). Estructura aprobada en GATE 2
// (docs/grupo-y-marketing/01-especificacion.md): Hero → Servicios → Método → Equipo →
// Comparativa → Casos → Producto propio → Contacto. Contenido de
// Pixies\marketing\empresa\portafolio\SECCION-MARKETING.md.
export const metadata: Metadata = {
  title: t.marketing.metaTitle,
  description: t.marketing.metaDescription,
  alternates: { canonical: '/marketing' },
  openGraph: { type: 'website', title: t.marketing.metaTitle, description: t.marketing.metaDescription },
};

export default function MarketingPage() {
  return (
    <>
      <SchemaOrg type="organization" />
      <MarketingHero />
      <Servicios />
      <Metodo />
      <EquipoMarketing />
      <Comparativa />
      <CasosMarketing />
      <ContentHubTeaser />

      <section id="contacto" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-24 sm:px-6">
          <h2 className="font-display text-h2 font-semibold text-ink">{t.marketing.contacto.title}</h2>
          <p className="mt-4 max-w-xl text-dim">{t.marketing.contacto.intro}</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
