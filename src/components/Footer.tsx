import React from 'react';
import { ABOUT_ME } from '../data/about';
import { ShieldCheck, ArrowUp } from 'lucide-react';
import { ServiceType } from '../config/bookingConfig';

interface FooterProps {
  onOpenBooking: (service: ServiceType) => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenPrivacy }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-white text-sm">
              {ABOUT_ME.name}
            </div>
            <div className="text-slate-400 text-xs mt-0.5">
              {ABOUT_ME.positioning} · {ABOUT_ME.location}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              {ABOUT_ME.timeZoneNote}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenBooking('consultation')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              Консультация
            </button>
            <button
              onClick={() => onOpenBooking('audit')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Заказать аудит
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} Алмаз Сабыров.</span>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-amber-400 underline transition-colors cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Политика конфиденциальности</span>
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="self-start sm:self-auto hover:text-white transition-colors flex items-center gap-1 p-1"
          >
            <span>Наверх</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
