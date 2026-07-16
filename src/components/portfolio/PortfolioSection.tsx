import { categories } from '@/data/categories';
import { t } from '@/i18n';
import CategoryBlock from './CategoryBlock';
import CategoryLauncher from './CategoryLauncher';
import GradientText from '@/components/ui/GradientText';

// Portafolio (Samuel r4 2026-07-18): vuelve el título "Proyectos que ya corren" y el layout
// COMPLETO — todas las secciones apiladas y scrolleables (ERP y todo). El launcher de
// categorías queda arriba como accesos directos (saltan a la sección) con previa al hover.
export default function PortfolioSection() {
  return (
    <section id="portafolio" className="mx-auto w-full max-w-[1200px] scroll-mt-16 px-4 pb-24 pt-6 sm:px-6">
      <header data-reveal className="mb-8">
        <p className="font-mono text-sm text-data">{t.portfolio.eyebrow}</p>
        <h2 className="mt-2 font-display text-h2 font-semibold">
          <GradientText text={t.portfolio.title} em="ya corren" />
        </h2>
        <p className="mt-3 max-w-xl text-dim">{t.portfolio.intro}</p>
      </header>

      <CategoryLauncher />

      <div className="mt-16 flex flex-col gap-20">
        {categories.map((category) => (
          <CategoryBlock key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
