import React, { useState } from 'react';
import { Shield, Send, Database, Sun, Moon, Lock, Calendar } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenBooking: () => void;
  onOpenClientPortal: () => void;
  onOpenTelegram: () => void;
  onOpenBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenBooking,
  onOpenClientPortal,
  onOpenTelegram,
  onOpenBackup,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/85 dark:bg-slate-950/85 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single line, display face) */}
        <a href="#" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-100 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
          <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-sm font-semibold">
            ИИ
          </span>
          <span className="font-semibold text-slate-100">
            ПромИИ <span className="text-slate-400 font-normal">· Сабыров А.</span>
          </span>
        </a>

        {/* Zone 2: 4–5 Concise Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#projects" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Проекты
          </a>
          <a href="#metrics" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Метрики & ROI
          </a>
          <a href="#cases" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Кейсы
          </a>
          <a href="#experience" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Опыт & Стек
          </a>
          <a href="#contact" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Контакты
          </a>
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Telegram Quick Trigger */}
          <button
            onClick={onOpenTelegram}
            title="Интеграция с Telegram-ботом"
            className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            aria-label="Telegram бот"
          >
            <Send className="w-4 h-4" />
          </button>

          {/* Database Backup Tool */}
          <button
            onClick={onOpenBackup}
            title="Резервное копирование БД"
            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            aria-label="Бэкапы БД"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            aria-label="Переключение темы"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Client Portal Button (with 2FA icon) */}
          <button
            onClick={onOpenClientPortal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Кабинет клиента (2FA)</span>
          </button>

          {/* Primary Action: Consultation Booking */}
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-all shadow-sm hover:shadow-amber-500/20 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-950" />
            <span>Консультация</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-100 rounded-lg focus:outline-none"
            aria-label="Меню"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 space-y-2 border-t border-slate-800 bg-slate-950">
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Проекты (Выполненные, Действующие, Предстоящие)
          </a>
          <a
            href="#metrics"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Метрики & Калькулятор ROI
          </a>
          <a
            href="#cases"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Кейсы и статьи
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Опыт специалиста
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Контакты и заявка
          </a>
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenClientPortal();
              }}
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 rounded-lg"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Личный кабинет клиента (2FA)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
