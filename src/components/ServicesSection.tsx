import React from 'react';
import { Calendar, Video, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { BOOKING_CONFIG, ServiceType } from '../config/bookingConfig';

interface ServicesSectionProps {
  onOpenBooking: (service: ServiceType) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBooking }) => {
  const { consultation, audit } = BOOKING_CONFIG.services;

  return (
    <section id="services" className="py-16 sm:py-20 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
            Форматы сотрудничества
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Услуги и запись
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Выберите подходящий формат взаимодействия. Все свободные слоты формируются по времени Казахстана.
          </p>
        </div>

        {/* 2 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service 1: Бесплатная консультация */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                  Бесплатно
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {consultation.durationMinutes} минут
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  {consultation.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  <span>Онлайн, Google Meet</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {consultation.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                <span className="text-slate-400 font-semibold block">Что разберём на встрече:</span>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Вашу текущую ручную рутину или проблемный процесс</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Реалистичность решения с помощью современных ИИ-инструментов</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{consultation.resultForClient}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onOpenBooking('consultation')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Записаться на консультацию</span>
              </button>
            </div>
          </div>

          {/* Service 2: Аудит процессов бизнеса */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 hover:border-amber-400/50 transition-all shadow-xl relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-md">
                  от 80 000 ₸
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {audit.durationMinutes} минут
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  {audit.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Онлайн или выезд на объект по Атырау</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {audit.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                <span className="text-slate-400 font-semibold block">Результат для клиента:</span>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Детальная карта процессов предприятия, где ИИ даст реальную пользу</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Пошаговый план внедрения, оценка необходимых инструментов и сроков</span>
                </div>
                <div className="flex items-start gap-2 text-slate-400 text-[11px]">
                  <span>Оплата производится по договорённости после оформления записи.</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onOpenBooking('audit')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-slate-800 border border-slate-600 hover:border-amber-400 hover:bg-slate-700 rounded-xl transition-all shadow cursor-pointer"
              >
                <span>Заказать аудит процессов</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
