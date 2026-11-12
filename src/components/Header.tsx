import React, { useState } from 'react';
import { Calendar, Menu, X } from 'lucide-react';
import { ServiceType } from '../config/bookingConfig';

interface HeaderProps {
  onOpenBooking: (service?: ServiceType) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 border-b border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>Алмаз Сабыров</span>
          <span className="text-xs text-slate-400 font-normal hidden sm:inline">· ИИ в процессах бизнеса</span>
        </a>

        {/* Zone 2: Navigation Links (Clean single-line prose) */}
        <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-300">
          <a href="#services" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Услуги
          </a>
          <a href="#projects" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Проекты
          </a>
          <a href="#about" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Обо мне
          </a>
          <a href="#contacts" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Контакты
          </a>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => onOpenBooking('consultation')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Записаться</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Открыть меню"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 space-y-2 border-t border-slate-800 bg-slate-950 text-sm">
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-900"
          >
            Услуги (Консультация и Аудит)
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-900"
          >
            Проекты
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-900"
          >
            Обо мне
          </a>
          <a
            href="#contacts"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-900"
          >
            Контакты
          </a>
          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking('consultation');
              }}
              className="w-full py-2.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 rounded-lg text-center"
            >
              Консультация
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking('audit');
              }}
              className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 rounded-lg text-center"
            >
              Заказать аудит
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
