import type { Category } from '@/data/categories';
import { projectsByCategory } from '@/data/projects';
import ProjectCard from './ProjectCard';
import ErpScrollytelling from '@/components/exhibits/ErpScrollytelling';
import AgentExhibit from '@/components/exhibits/AgentExhibit';

export default function CategoryBlock({ category }: { category: Category }) {
  const items = projectsByCategory(category.id);

  return (
    <section id={category.id} className="scroll-mt-28">
      <header>
        <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{category.title}</h3>
        <p className="mt-1 max-w-xl text-dim">{category.description}</p>
      </header>

      {category.exhibit === 'erp-tour' ? (
        <ErpScrollytelling />
      ) : category.exhibit === 'agent-replay' ? (
        <AgentExhibit />
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
