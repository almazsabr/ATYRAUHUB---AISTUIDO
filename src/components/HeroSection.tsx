import React from 'react';
import { Calendar, FileSearch, MapPin, Globe, Clock } from 'lucide-react';
import { ServiceType } from '../config/bookingConfig';
import { ABOUT_ME } from '../data/about';

interface HeroSectionProps {
  onOpenBooking: (service: ServiceType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative pt-12 pb-16 sm:py-20 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Location & Context kicker */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-400 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Атырау</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Работаю онлайн по всему Казахстану</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{ABOUT_ME.timeZoneNote}</span>
          </span>
        </div>

        {/* Main headline and positioning */}
        <div className="space-y-4">
          <div className="text-sm font-semibold tracking-wide text-slate-300">
            {ABOUT_ME.name}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {ABOUT_ME.positioning}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl pt-1">
            Помогаю компаниям найти конкретные точки потерь и рутины в процессах, подобрать работающие решения на базе искусственного интеллекта и запустить их на практике — от голосовых журналов смен до ИИ-агентов по документам.
          </p>
        </div>

        {/* Two Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            onClick={() => onOpenBooking('consultation')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Бесплатная консультация</span>
          </button>

          <button
            onClick={() => onOpenBooking('audit')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <FileSearch className="w-4 h-4 text-amber-400" />
            <span>Заказать аудит процессов</span>
          </button>
        </div>

        {/* Quiet footnote with timezone reminder */}
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Онлайн-запись синхронизирована с рабочим календарем. Время приёма — время Казахстана (UTC+5).</span>
        </div>
      </div>
    </section>
  );
};
