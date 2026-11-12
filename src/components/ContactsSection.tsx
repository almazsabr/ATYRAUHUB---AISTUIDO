import React from 'react';
import { ABOUT_ME } from '../data/about';
import { MessageSquare, Send, Mail, MapPin, Calendar, Clock } from 'lucide-react';
import { ServiceType } from '../config/bookingConfig';

interface ContactsSectionProps {
  onOpenBooking: (service: ServiceType) => void;
}

export const ContactsSection: React.FC<ContactsSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="contacts" className="py-16 sm:py-20 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
            Связь
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Контакты
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Для оперативной связи или согласования выезда по Атырау используйте удобный мессенджер.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* WhatsApp */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp:</span>
            </div>
            <div className="font-mono text-xs text-amber-400 font-bold">
              {ABOUT_ME.contacts.whatsApp}
            </div>
            <p className="text-[11px] text-slate-500">
              Основной канал для быстрой переписки и согласования
            </p>
          </div>

          {/* Telegram */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
              <Send className="w-4 h-4" />
              <span>Telegram:</span>
            </div>
            <div className="font-mono text-xs text-amber-400 font-bold">
              {ABOUT_ME.contacts.telegram}
            </div>
            <p className="text-[11px] text-slate-500">
              Прямой контакт эксперта в мессенджере
            </p>
          </div>

          {/* Email */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Mail className="w-4 h-4" />
              <span>E-mail:</span>
            </div>
            <div className="font-mono text-xs text-amber-400 font-bold">
              {ABOUT_ME.contacts.email}
            </div>
            <p className="text-[11px] text-slate-500">
              Для официальных писем и договоров
            </p>
          </div>
        </div>

        {/* Banner with direct booking action */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{ABOUT_ME.location}</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{ABOUT_ME.timeZoneNote}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenBooking('consultation')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer"
            >
              Записаться онлайн
            </button>
            <button
              onClick={() => onOpenBooking('audit')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            >
              Заказать аудит
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
