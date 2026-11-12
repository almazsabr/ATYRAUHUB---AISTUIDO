import React from 'react';
import { X, ExternalLink, ArrowRight, Layers } from 'lucide-react';
import { ProjectItem } from '../data/projects';
import { ServiceType } from '../config/bookingConfig';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenBooking: (service: ServiceType) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenBooking,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <span>{project.categoryLabel}</span>
              <span>·</span>
              <span>{project.status}</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* What was done */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1.5">
              Что сделано:
            </h4>
            <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              {project.whatWasDone}
            </p>
          </div>

          {/* Result */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1.5">
              Результат:
            </h4>
            <div className={`p-3.5 rounded-xl border leading-relaxed ${
              project.result.includes('[ЗАПОЛНИТЬ')
                ? 'bg-amber-400/5 border-amber-400/30 text-amber-300 font-mono text-xs'
                : 'bg-slate-950/60 border-slate-800 text-slate-200'
            }`}>
              {project.result}
            </div>
          </div>

          {/* Details */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1.5">
              Подробности проекта:
            </h4>
            <div className={`leading-relaxed ${
              project.details.includes('[ЗАПОЛНИТЬ')
                ? 'bg-amber-400/5 border border-amber-400/30 p-3 rounded-xl text-amber-300 font-mono text-xs'
                : 'text-slate-300'
            }`}>
              {project.details}
            </div>
          </div>

          {/* Stack or tools */}
          {project.stackOrTools && (
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1.5">
                Используемые инструменты и стек:
              </h4>
              <p className="font-mono text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                {project.stackOrTools}
              </p>
            </div>
          )}

          {/* Link if available */}
          {project.link && (
            <div className="pt-1">
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 underline underline-offset-4"
              >
                <span>Перейти на сайт проекта ({project.link})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
          >
            Закрыть
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenBooking('consultation');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            <span>Обсудить похожую задачу</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
