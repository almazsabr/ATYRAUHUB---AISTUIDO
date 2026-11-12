import React, { useState } from 'react';
import { X, Send, Bot, Bell, CheckCircle2, Shield, RefreshCw, Smartphone, Zap } from 'lucide-react';
import { TelegramMessageLog, TelegramNotificationSettings } from '../types';

interface TelegramIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  telegramSettings: TelegramNotificationSettings;
  onUpdateSettings: (newSettings: TelegramNotificationSettings) => void;
  onTriggerToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const TelegramIntegrationModal: React.FC<TelegramIntegrationModalProps> = ({
  isOpen,
  onClose,
  telegramSettings,
  onUpdateSettings,
  onTriggerToast,
}) => {
  const [handle, setHandle] = useState(telegramSettings.chatId || '@sabyrov_ai');
  const [notifyBooking, setNotifyBooking] = useState(telegramSettings.notifyOnBooking);
  const [notifyLead, setNotifyLead] = useState(telegramSettings.notifyOnContact);
  const [notifyBackup, setNotifyBackup] = useState(telegramSettings.notifyOnBackup);
  const [notifyAnomaly, setNotifyAnomaly] = useState(telegramSettings.notifyOnAnomaly);

  const [messageLogs, setMessageLogs] = useState<TelegramMessageLog[]>([
    {
      id: 'tg-1',
      time: 'Сегодня, 10:45:12',
      type: 'system',
      title: 'Бот активен и слушает вебхук',
      body: 'Связь с Telegram Bot API установлена по защищенному протоколу TLS 1.3.',
    },
    {
      id: 'tg-2',
      time: 'Сегодня, 03:00:18',
      type: 'backup',
      title: 'Успешный ночной бэкап БД',
      body: 'Дамп prom_ai_backup_full_20260412_0300.enc.sql.gz (142.8 МБ) сохранен в S3.',
    },
  ]);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...telegramSettings,
      chatId: handle,
      notifyOnBooking: notifyBooking,
      notifyOnContact: notifyLead,
      notifyOnBackup: notifyBackup,
      notifyOnAnomaly: notifyAnomaly,
      connected: true,
    });
    onTriggerToast('Настройки Telegram сохранены', `Уведомления направляются на контакт: ${handle}`, 'success');
  };

  const handleSendTestAlert = () => {
    const newLog: TelegramMessageLog = {
      id: `tg-${Date.now()}`,
      time: 'Только что',
      type: 'lead',
      title: 'Тестовое уведомление бота',
      body: `Проверка канала доставки: заявка с лендинга успешно доставлена адресату ${handle}. Задержка: 140мс.`,
    };

    setMessageLogs([newLog, ...messageLogs]);
    onTriggerToast(
      'Telegram-уведомление отправлено',
      `Бот @IndustrialAI_Alerts_Bot отправил тестовый сигнал в чат ${handle}`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Bot className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Интеграция с Telegram-ботом
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Webhook Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Мгновенные push-уведомления о новых заявках, консультациях и авариях
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Bot Connection Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Smartphone className="w-4 h-4 text-sky-400" />
                <span>Бот оповещений: @PromAI_Specialist_Bot</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Версия шлюза: v3.2.1</span>
            </div>

            <p className="text-slate-400 leading-relaxed text-[11px]">
              Бот настроен для двухсторонней связи: он уведомляет инженера и клиента о назначенных консультациях, статусах резервного копирования и критических событиях.
            </p>
          </div>

          {/* Form Settings */}
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">
                Telegram аккаунт или Chat ID для получения уведомлений:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="@your_telegram_username"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400 font-mono text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  Сохранить
                </button>
              </div>
            </div>

            {/* Toggle checkboxes */}
            <div className="space-y-2.5 pt-2">
              <span className="block text-slate-400 font-mono uppercase text-[11px]">
                Триггеры мгновенных уведомлений:
              </span>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-white font-medium block">Заявки на экспресс-аудит (Лиды)</span>
                  <span className="text-slate-500 text-[11px]">Отправлять телефон, email и название завода сразу в чат</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyLead}
                  onChange={(e) => setNotifyLead(e.target.checked)}
                  className="accent-amber-400 rounded w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-white font-medium block">Записи на консультацию & Напоминания</span>
                  <span className="text-slate-500 text-[11px]">Календарный слот, ссылка на Google Meet / звонок</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyBooking}
                  onChange={(e) => setNotifyBooking(e.target.checked)}
                  className="accent-amber-400 rounded w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-white font-medium block">Отчеты автоматического бэкапа БД</span>
                  <span className="text-slate-500 text-[11px]">Размер дампа, SHA-256 хэш и статус репликации в S3</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyBackup}
                  onChange={(e) => setNotifyBackup(e.target.checked)}
                  className="accent-amber-400 rounded w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-white font-medium block">Критические аномалии датчиков (IoT/PdM)</span>
                  <span className="text-slate-500 text-[11px]">Мгновенный сигнал при превышении виброускорения вала</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyAnomaly}
                  onChange={(e) => setNotifyAnomaly(e.target.checked)}
                  className="accent-amber-400 rounded w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </form>

          {/* Test notification trigger button */}
          <div className="pt-2">
            <button
              onClick={handleSendTestAlert}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Отправить тестовое уведомление в Telegram прямо сейчас</span>
            </button>
          </div>

          {/* Live Message Dispatch Log */}
          <div className="space-y-2 pt-2">
            <span className="block text-slate-400 font-mono uppercase text-[11px]">
              Журнал доставки сообщений бота:
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {messageLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-white">{log.title}</span>
                    <span className="font-mono text-emerald-400">{log.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{log.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
