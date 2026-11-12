import React, { useState } from 'react';
import { CaseStudy } from '../types';
import { CASE_STUDIES_DATA } from '../data/mockData';
import { BookOpen, Calendar, ArrowRight, X, CheckCircle2, Cpu, FileText } from 'lucide-react';

interface CaseStudiesSectionProps {
  onOpenBooking: () => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({ onOpenBooking }) => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  return (
    <section id="cases" className="py-16 sm:py-20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase">
              <span>Практический блог & Исследования</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Разбор инженерных кейсов</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Блог с реальными производственными кейсами
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Детальные инженерные отчеты о внедрении: оптические схемы, алгоритмы фильтрации помех в вибросигналах и локальные RAG-архитектуры.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono shrink-0">
            Обновлено: Ноябрь 2026
          </div>
        </div>

        {/* 3-Column Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CASE_STUDIES_DATA.map((item) => (
            <article
              key={item.id}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90 transition-all overflow-hidden group shadow-lg"
            >
              {/* Image banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-amber-400 border border-slate-700/60">
                  {item.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Tech tag list */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                  {item.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Open Modal Button */}
                <button
                  onClick={() => setSelectedCase(item)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Читать подробный кейс</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Modal: In-Depth Case Study Article */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1.5">
                    <span>{selectedCase.category}</span>
                    <span>·</span>
                    <span>{selectedCase.date}</span>
                    <span>·</span>
                    <span>{selectedCase.readTime}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {selectedCase.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
                {/* Visual Banner */}
                <div className="rounded-xl overflow-hidden border border-slate-800 h-52 relative">
                  <img
                    src={selectedCase.image}
                    alt={selectedCase.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 text-xs font-mono text-white">
                    Архитектурная схема производственного контура
                  </div>
                </div>

                {/* Problem Statement */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
                    Проблема и исходные ограничения:
                  </h4>
                  <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    {selectedCase.problem}
                  </p>
                </div>

                {/* Solution */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    Инженерное решение и развертывание:
                  </h4>
                  <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    {selectedCase.solution}
                  </p>
                </div>

                {/* Results Table (Before / After) */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                    Сравнение показателей (До / После внедрения):
                  </h4>
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
                        <tr>
                          <th className="p-3">Метрика процесса</th>
                          <th className="p-3">До внедрения</th>
                          <th className="p-3">После запуска ИИ</th>
                          <th className="p-3 text-right">Дельта</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {selectedCase.results.map((res, i) => (
                          <tr key={i} className="hover:bg-slate-900/40">
                            <td className="p-3 font-medium text-white">{res.metric}</td>
                            <td className="p-3 text-slate-400 font-mono tabular-nums">{res.before}</td>
                            <td className="p-3 text-emerald-400 font-mono font-semibold tabular-nums">{res.after}</td>
                            <td className="p-3 text-right font-mono font-bold text-amber-400 tabular-nums">{res.change}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Architecture Pipeline Steps */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Ключевые этапы архитектурного пайплайна:
                  </h4>
                  <div className="space-y-2">
                    {selectedCase.architectureSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs">
                        <span className="w-5 h-5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center font-mono text-[11px] shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-slate-300 leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Takeaways */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Инженерные выводы для аналогичных производств:
                  </h4>
                  <ul className="space-y-2">
                    {selectedCase.takeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Хотите разобрать этот кейс применительно к вашей линии?
                </span>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
                  >
                    Закрыть
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCase(null);
                      onOpenBooking();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                  >
                    Записаться на консультацию
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
