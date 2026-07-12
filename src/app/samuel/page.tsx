import type { Metadata } from 'next';
import SchemaOrg from '@/components/seo/SchemaOrg';
import Manifesto from '@/components/samuel/Manifesto';
import KnowledgeMap from '@/components/samuel/KnowledgeMap';
import SkillDomains from '@/components/samuel/SkillDomains';
import ProjectStories from '@/components/samuel/ProjectStories';
import PostList from '@/components/samuel/PostList';
import SocialLinks from '@/components/samuel/SocialLinks';
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
      <Manifesto />
      <KnowledgeMap />
      <SkillDomains />
      <ProjectStories />
      <PostList />
      <SocialLinks />
    </>
  );
}
