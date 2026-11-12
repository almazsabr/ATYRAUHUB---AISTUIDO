import React from 'react';
import { ArrowUpRight, Calendar, Calculator, ShieldCheck, Sparkles } from 'lucide-react';
import { HERO_IMAGE, SPECIALIST_BIO } from '../data/mockData';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenClientPortal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenClientPortal }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Kicker - clean unboxed typography without pills */}
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-4 tracking-wider uppercase">
          <span>Промышленный искусственный интеллект</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Отраслевая экспертиза</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>ASU TP / MES / Edge</span>
        </div>

        {/* 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Column 1: Copy and CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Внедрение ИИ в производственные процессы промышленных предприятий
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Разрабатываю и интегрирую прикладные ML-системы для тяжелой индустрии: оптическая дефектоскопия в реальном времени, виброакустическое предиктивное ТОиР и автономные советчики операторов АСУ ТП.
            </p>

            {/* Quick Benefits Bullet Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300 pt-1">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Окупаемость проектов от 3.5 до 6 месяцев</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>100% On-Premise контур без риска утечки чертежей</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Запуск пилотного прототипа (MVP) за 6 недель</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Прямая интеграция со SCADA, PLC и 1С:ТОИР</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-all shadow-lg shadow-amber-400/10 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>Записаться на экспресс-аудит</span>
              </button>

              <a
                href="#metrics"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-200 bg-slate-900 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Рассчитать ROI внедрения</span>
              </a>

              <button
                onClick={onOpenClientPortal}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                <span>Личный кабинет</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column 2: Dominant Visual Carrier */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl group">
              <img
                src={HERO_IMAGE}
                alt="Промышленный комплекс с роботизированной линией"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

              {/* Verified Badge Overlay at bottom of hero visual */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md bg-slate-950/80 border border-slate-700 text-xs">
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span className="font-semibold text-white">Ведущий специалист проекта</span>
                  <span className="text-amber-400 font-mono">Стаж 9+ лет</span>
                </div>
                <p className="text-slate-400 text-xs">
                  {SPECIALIST_BIO.name} · {SPECIALIST_BIO.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI / Metrics Strip (Full-width row below hero split) */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
              -72%
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Снижение брака в рулонах
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">
              Контроль полосы 18 м/с
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
              18–24 дня
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Горизонт предупреждения аварий
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">
              Вибродиагностика подшипников
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
              420+ млн ₽
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Суммарный экономический эффект
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">
              Подтверждено актами заказчиков
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
              100% Air-Gap
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Информационная безопасность
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">
              Закрытый контур без облаков
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
