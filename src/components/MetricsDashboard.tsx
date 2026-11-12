import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertTriangle, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

interface MetricsDashboardProps {
  onOpenBooking: () => void;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ onOpenBooking }) => {
  // Calculator inputs
  const [industry, setIndustry] = useState<'metallurgy' | 'energy' | 'machinery' | 'petrochem' | 'mining'>('metallurgy');
  const [downtimeHoursPerYear, setDowntimeHoursPerYear] = useState<number>(180);
  const [costPerHourThousands, setCostPerHourThousands] = useState<number>(450); // 450,000 rub / hour
  const [scrapVolumeTons, setScrapVolumeTons] = useState<number>(1200);

  // Dynamic calculations based on industry benchmarks
  const industryProfiles = {
    metallurgy: {
      name: 'Металлургия и прокат',
      typicalDowntimeReduction: 0.68, // -68%
      scrapReductionRate: 0.72, // -72%
      recommendedSolution: 'Компьютерное зрение 8K (дефекты полосы) + Edge NVIDIA Orin',
      basePilotWeeks: 6,
    },
    energy: {
      name: 'Энергетика и ТЭК (ТЭЦ/ГРЭС)',
      typicalDowntimeReduction: 0.82, // -82%
      scrapReductionRate: 0.45,
      recommendedSolution: 'Виброакустическая предиктивная диагностика турбин (LSTM + Modbus)',
      basePilotWeeks: 7,
    },
    machinery: {
      name: 'Тяжелое машиностроение',
      typicalDowntimeReduction: 0.55,
      scrapReductionRate: 0.65,
      recommendedSolution: 'On-Premise LLM/RAG ассистент ТОиР + оптический контроль сборки',
      basePilotWeeks: 6,
    },
    petrochem: {
      name: 'Нефтехимия и полимеры',
      typicalDowntimeReduction: 0.60,
      scrapReductionRate: 0.50,
      recommendedSolution: 'RL-агент оптимизации реактора риформинга + цифровой двойник',
      basePilotWeeks: 8,
    },
    mining: {
      name: 'Горная добыча и ГОКи',
      typicalDowntimeReduction: 0.40,
      scrapReductionRate: 0.35,
      recommendedSolution: 'Алгоритмы динамической диспетчеризации БелАЗов и дробилок',
      basePilotWeeks: 7,
    },
  };

  const profile = industryProfiles[industry];

  // Calculation formulas
  const annualDowntimeCost = (downtimeHoursPerYear * costPerHourThousands) / 1000; // in Millions of Rubles
  const savedDowntimeHours = Math.round(downtimeHoursPerYear * profile.typicalDowntimeReduction);
  const downtimeSavingsMillions = ((savedDowntimeHours * costPerHourThousands) / 1000);
  
  // Scrap savings estimate (assuming ~40,000 rub/ton metal or equivalent value)
  const scrapSavingsMillions = (scrapVolumeTons * profile.scrapReductionRate * 45) / 1000;
  
  const totalAnnualSavingsMillions = Number((downtimeSavingsMillions + scrapSavingsMillions).toFixed(1));
  
  // Pilot investment estimation ~ 9-16M rub depending on complexity
  const estimatedPilotCapexMillions = 12.5;
  const paybackMonths = Number(((estimatedPilotCapexMillions / (totalAnnualSavingsMillions || 1)) * 12).toFixed(1));

  return (
    <section id="metrics" className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase">
            <span>Экономическая эффективность</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Аудит & Моделирование ROI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Интерактивный калькулятор окупаемости внедрения ИИ
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-3xl">
            Оцените потенциальный экономический эффект от внедрения предиктивного обслуживания и машинного зрения на базе фактических данных 18 реализованных проектов.
          </p>
        </div>

        {/* 2-Column Calculator & Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-white border-b border-slate-800 pb-3">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Параметры производственной площадки</span>
            </div>

            {/* Industry Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Отрасль производства:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(industryProfiles) as (keyof typeof industryProfiles)[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIndustry(key)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-all border cursor-pointer ${
                      industry === key
                        ? 'bg-amber-400/10 border-amber-400/60 text-amber-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {industryProfiles[key].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Annual Downtime Hours */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-300 font-medium">
                  Внеплановый простой оборудования в год:
                </span>
                <span className="font-mono text-amber-400 font-bold tabular-nums">
                  {downtimeHoursPerYear} часов
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={600}
                step={10}
                value={downtimeHoursPerYear}
                onChange={(e) => setDowntimeHoursPerYear(Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>20 ч</span>
                <span>300 ч</span>
                <span>600 ч</span>
              </div>
            </div>

            {/* Slider 2: Cost Per Hour */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-300 font-medium">
                  Оценочная стоимость 1 часа простоя:
                </span>
                <span className="font-mono text-amber-400 font-bold tabular-nums">
                  {costPerHourThousands.toLocaleString('ru-RU')} тыс. ₽ / ч
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={costPerHourThousands}
                onChange={(e) => setCostPerHourThousands(Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>50 тыс. ₽</span>
                <span>1 млн ₽</span>
                <span>2 млн ₽</span>
              </div>
            </div>

            {/* Slider 3: Scrap Volume */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-300 font-medium">
                  Годовой объем брака / рекламаций сырья:
                </span>
                <span className="font-mono text-amber-400 font-bold tabular-nums">
                  {scrapVolumeTons.toLocaleString('ru-RU')} тонн
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={scrapVolumeTons}
                onChange={(e) => setScrapVolumeTons(Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>100 т</span>
                <span>2 500 т</span>
                <span>5 000 т</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-700 rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Прогноз финансового эффекта</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Базовый горизонт: 12 мес
              </span>
            </div>

            {/* Top Metric Showcase */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">
                  Экономический эффект в год:
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
                  {totalAnnualSavingsMillions.toLocaleString('ru-RU')} млн ₽
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  включая брак и аварии
                </span>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">
                  Срок возврата инвестиций:
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
                  {paybackMonths} мес
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  с даты запуска пилота
                </span>
              </div>
            </div>

            {/* Operational Improvements */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Операционные изменения:
              </h4>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs">
                <span className="text-slate-300">Сокращение часов внепланового простоя:</span>
                <span className="font-mono text-white font-bold tabular-nums">
                  -{savedDowntimeHours} часов ({Math.round(profile.typicalDowntimeReduction * 100)}%)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs">
                <span className="text-slate-300">Снижение рекламаций по качеству продукции:</span>
                <span className="font-mono text-white font-bold tabular-nums">
                  -{Math.round(profile.scrapReductionRate * 100)}% брака
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs">
                <span className="text-slate-300">Срок развертывания пилотного прототипа:</span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                  {profile.basePilotWeeks} недель
                </span>
              </div>
            </div>

            {/* Recommended Architecture Box */}
            <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-amber-300 block flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Рекомендуемый технологический стек:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {profile.recommendedSolution}
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={onOpenBooking}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <span>Зафиксировать расчет в ТЗ и запросить аудит</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
