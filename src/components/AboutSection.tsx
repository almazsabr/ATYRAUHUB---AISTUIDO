import React from 'react';
import { ABOUT_ME } from '../data/about';
import { GraduationCap, Briefcase, User, MapPin } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-20 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
            Бэкграунд и опыт
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Обо мне
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Photo Placeholder Card */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="w-full aspect-square max-w-[280px] rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3 shadow-inner">
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                <User className="w-8 h-8" />
              </div>
              <div>
                <span className="font-mono text-amber-400 font-bold block text-sm">
                  {ABOUT_ME.photoUrl}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Заглушка под реальную фотографию специалиста
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="font-bold text-white text-base">{ABOUT_ME.name}</div>
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>г. Атырау, Казахстан</span>
              </div>
            </div>
          </div>

          {/* Bio & Practical Background */}
          <div className="md:col-span-8 space-y-5 text-sm text-slate-300">
            {/* Education */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Образование:</span>
                <p className="text-xs text-slate-300 mt-0.5">{ABOUT_ME.education}</p>
              </div>
            </div>

            {/* Real Experience list */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Практический опыт в отраслях:</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-1">
                {ABOUT_ME.experienceList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note on approach */}
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Мой подход опирается на понимание экономики и операционных процессов предприятий изнутри. Внедрение ИИ начинается не с выбора модной нейросети, а с анализа потерь, рутины и оценки возврата инвестиций для собственника бизнеса.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
