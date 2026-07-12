import { categories } from '@/data/categories';
import { t } from '@/i18n';
import CategoryNav from './CategoryNav';
import CategoryBlock from './CategoryBlock';

export default function PortfolioSection() {
  return (
    <section id="portafolio" className="mx-auto w-full max-w-[1200px] scroll-mt-16 px-4 py-24 sm:px-6">
      <header data-reveal className="mb-4">
        <p className="font-mono text-sm text-data">{t.portfolio.eyebrow}</p>
        <h2 className="mt-2 font-display text-h2 font-semibold">{t.portfolio.title}</h2>
        <p className="mt-3 max-w-xl text-dim">{t.portfolio.intro}</p>
      </header>

      <CategoryNav />

      <div className="flex flex-col gap-20">
        {categories.map((category) => (
          <CategoryBlock key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
