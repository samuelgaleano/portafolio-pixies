import type { Category } from '@/data/categories';
import { projectsByCategory } from '@/data/projects';
import { t } from '@/i18n';
import ProjectCard from './ProjectCard';
import Pending from '@/components/ui/Pending';
import ProblemSolution from '@/components/exhibits/ProblemSolution';
import ErpScrollytelling from '@/components/exhibits/ErpScrollytelling';
import DataScrollytelling from '@/components/exhibits/DataScrollytelling';
import AgentExhibit from '@/components/exhibits/AgentExhibit';

export default function CategoryBlock({ category }: { category: Category }) {
  // Mejor 1 caso real que 7 esqueletos: las tarjetas sin nombre real no se muestran.
  const items = projectsByCategory(category.id).filter((p) => !p.name.startsWith('['));
  // gancho problema→solución de la categoría (Samuel r21): si algún proyecto trae la copy, se
  // muestra el flip interactivo sobre la grilla (p. ej. el POS), enlazando a su demo.
  const hook = items.find((p) => p.problemLead && p.demoUrl);

  return (
    <section id={category.id} data-reveal className="scroll-mt-28">
      <header>
        {/* fluido como el h2: con tope fijo, la razón h3:h2 caía de 0.86 a 0.63 en desktop */}
        <h3 className="font-display text-[clamp(1.5rem,2.2vw,2.25rem)] font-semibold text-ink">{category.title}</h3>
        <p className="mt-1 max-w-xl text-dim">{category.description}</p>
      </header>

      {category.exhibit === 'erp-tour' ? (
        <ErpScrollytelling />
      ) : category.exhibit === 'data-tour' ? (
        <DataScrollytelling />
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
        <>
          {hook && hook.demoUrl && (
            <div className="mt-6">
              <ProblemSolution
                problemLead={hook.problemLead!}
                problem={hook.problem!}
                solutionLead={hook.solutionLead!}
                solution={hook.solution!}
                demoUrl={hook.demoUrl}
                ariaLabel={`Abrir la demo en vivo — ${hook.name}`}
              />
            </div>
          )}
          <div className={`mt-6 grid gap-6 md:grid-cols-2 ${items.length >= 3 ? 'xl:grid-cols-3' : ''}`}>
            {items.map((project, i) => {
              // última tarjeta impar: ocupa las 2 columnas en md–lg (evita el hueco vacío),
              // vuelve a 1 columna en xl:grid-cols-3
              const fillOrphan = i === items.length - 1 && items.length % 2 === 1;
              return (
                <div key={project.id} className={fillOrphan ? 'md:col-span-2 xl:col-span-1' : ''}>
                  <ProjectCard project={project} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
