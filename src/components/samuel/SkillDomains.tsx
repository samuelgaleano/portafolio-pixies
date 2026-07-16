import { t } from '@/i18n';
import { depthLabel } from '@/data/skills';
import SectionHead from './SectionHead';
import SkillsSlider from './SkillsSlider';

// Capacidades por dominio (Samuel r5 2026-07-18): mismo contenido y leyenda de profundidad,
// pero las tarjetas ahora van en un DESLIZADOR horizontal (SkillsSlider).
export default function SkillDomains() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6">
        <SectionHead
          index="01 · capacidades"
          title={t.samuel.skillsTitle}
          intro={t.samuel.skillsIntro}
          glyph="cluster"
        />

        <div className="mt-5 flex flex-wrap gap-4 font-mono text-xs">
          <span className="text-ok">● {depthLabel.produccion}</span>
          <span className="text-data">● {depthLabel.solido}</span>
          <span className="text-dim">● {depthLabel.explorando}</span>
        </div>

        <SkillsSlider />
      </div>
    </section>
  );
}
