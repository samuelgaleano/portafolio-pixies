import type { Metadata } from 'next';
import SchemaOrg from '@/components/seo/SchemaOrg';
import GrupoHero from '@/components/hero/GrupoHero';
import GrupoSplit from '@/components/hero/GrupoSplit';
import ProcesoUnificado from '@/components/grupo/ProcesoUnificado';
import LeadForm from '@/components/leads/LeadForm';
import GradientText from '@/components/ui/GradientText';
import Atmosphere from '@/components/fx/Atmosphere';
import { t } from '@/i18n';

// Home = landing del grupo (grupo-y-marketing, 2026-09): el contenido que vivía aquí
// (portafolio, principios, CTA intermedio, teaser del ingeniero) se movió a `/web` —
// es, hoy, la división Web. Esta página tiene su PROPIO hero (GrupoHero: sin
// "/digital·web·design" ni portal del ingeniero, que son identidad de Web), la
// bifurcación (GrupoSplit) y un contacto general; `/web` y `/marketing` tienen su propio
// contenido completo y su propio contacto.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { type: 'website', title: 'Pixies Design Group', description: t.meta.description },
};

export default function HomePage() {
  return (
    <>
      <SchemaOrg type="organization" />
      <GrupoHero />

      <GrupoSplit />

      <ProcesoUnificado />

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
