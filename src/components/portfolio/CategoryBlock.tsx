import type { Category } from '@/data/categories';
import { projectsByCategory } from '@/data/projects';
import { t } from '@/i18n';
import ProjectCard from './ProjectCard';
import Pending from '@/components/ui/Pending';
import ErpScrollytelling from '@/components/exhibits/ErpScrollytelling';
import AgentExhibit from '@/components/exhibits/AgentExhibit';

export default function CategoryBlock({ category }: { category: Category }) {
  // Mejor 1 caso real que 7 esqueletos (critique P0): las tarjetas sin nombre real no se muestran.
  const items = projectsByCategory(category.id).filter((p) => !p.name.startsWith('['));

  return (
    <section id={category.id} data-reveal className="scroll-mt-28">
      <header>
        <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{category.title}</h3>
        <p className="mt-1 max-w-xl text-dim">{category.description}</p>
      </header>

      {category.exhibit === 'erp-tour' ? (
        <ErpScrollytelling />
      ) : category.exhibit === 'agent-replay' ? (
        <AgentExhibit />
      ) : items.length === 0 ? (
        // estado vacío DISEÑADO que convierte: el hueco se vuelve puerta a WhatsApp
        <div className="grid-bg mt-6 rounded-(--radius-m) border border-dashed border-line px-6 py-12">
          <Pending>{t.portfolio.emptyTitle}</Pending>
          <p className="mt-3 max-w-md text-sm text-dim">{t.portfolio.emptyBody}</p>
          <a
            href="#contacto"
            data-desde={category.id}
            className="mt-4 inline-block font-mono text-sm text-pixel-soft hover:underline"
          >
            {t.portfolio.emptyCta}
          </a>
        </div>
      ) : items.length === 1 ? (
        <div className="mt-6">
          <ProjectCard project={items[0]} variant="wide" />
        </div>
      ) : (
        <div className={`mt-6 grid gap-6 md:grid-cols-2 ${items.length >= 3 ? 'xl:grid-cols-3' : ''}`}>
          {items.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
