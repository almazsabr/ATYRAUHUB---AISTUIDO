import React, { useState } from 'react';
import { PROJECTS, ProjectCategory, ProjectItem } from '../data/projects';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ServiceType } from '../config/bookingConfig';
import { ChevronRight, ExternalLink } from 'lucide-react';

interface ProjectsSectionProps {
  onOpenBooking: (service: ServiceType) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenBooking }) => {
  const [filter, setFilter] = useState<'all' | ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = PROJECTS.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  const counts = {
    all: PROJECTS.length,
    completed: PROJECTS.filter((p) => p.category === 'completed').length,
    current: PROJECTS.filter((p) => p.category === 'current').length,
    pipeline: PROJECTS.filter((p) => p.category === 'pipeline').length,
  };

  return (
    <section id="projects" className="py-16 sm:py-20 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              Практический опыт
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Проекты
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Только реальные проекты: собственные разработки, текущие пилоты в Атырау и рассматриваемые внедрения.
            </p>
          </div>

          {/* Filter tabs with live counters */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto self-start sm:self-auto shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === 'all'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Все ({counts.all})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === 'completed'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Выполненные ({counts.completed})
            </button>
            <button
              onClick={() => setFilter('current')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === 'current'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Текущие ({counts.current})
            </button>
            <button
              onClick={() => setFilter('pipeline')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === 'pipeline'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Рассматриваемые ({counts.pipeline})
            </button>
          </div>
        </div>

        {/* Projects Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all flex flex-col justify-between cursor-pointer group shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-amber-400">
                    {project.categoryLabel}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {project.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  «{project.title}»
                </h3>

                <div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1">
                    Что сделано:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {project.whatWasDone}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1">
                    Результат:
                  </span>
                  <p className={`text-xs leading-relaxed ${
                    project.result.includes('[ЗАПОЛНИТЬ')
                      ? 'text-amber-400 font-mono'
                      : 'text-slate-300'
                  }`}>
                    {project.result}
                  </p>
                </div>
              </div>

              {/* Action row at bottom */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="text-amber-400/80 group-hover:text-amber-400 inline-flex items-center gap-1 font-medium">
                  <span>Подробнее</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>

                {project.link && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.link, '_blank');
                    }}
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white"
                  >
                    <span>Ссылка</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Window */}
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenBooking={onOpenBooking}
        />
      </div>
    </section>
  );
};
