import type { Metadata } from 'next';
import SchemaOrg from '@/components/seo/SchemaOrg';
import Manifesto from '@/components/samuel/Manifesto';
import SkillDomains from '@/components/samuel/SkillDomains';
import Deployments from '@/components/samuel/Deployments';
import KnowledgeMap from '@/components/samuel/KnowledgeMap';
import ProjectStories from '@/components/samuel/ProjectStories';
import { t } from '@/i18n';

export const metadata: Metadata = {
  title: t.samuel.metaTitle,
  description: t.samuel.metaDescription,
  alternates: { canonical: '/samuel' },
  openGraph: { type: 'profile', title: t.samuel.metaTitle, description: t.samuel.metaDescription },
};

export default function SamuelPage() {
  return (
    <>
      <SchemaOrg type="person" />
      {/* Rediseño (Samuel 2026-07-18, ronda 2): hero con retícula viva → capacidades por
          dominio (lo que más le gusta) → mapa de conocimiento (subido y más disruptivo) →
          "en producción" compacto (CÓMO despliega, ops/infra) → historias (POR QUÉ de cada
          proyecto). Producción e historias comunican cosas DISTINTAS, sin repetirse. */}
      <Manifesto />
      <SkillDomains />
      <KnowledgeMap />
      <Deployments />
      <ProjectStories />
    </>
  );
}
