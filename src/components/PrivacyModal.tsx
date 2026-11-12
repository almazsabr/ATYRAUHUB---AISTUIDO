import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-300 text-xs sm:text-sm">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2 text-white font-semibold">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Политика конфиденциальности и обработки данных</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 leading-relaxed text-slate-300">
          <p className="text-slate-400 text-xs">
            Настоящая Политика составлена в соответствии с Законом Республики Казахстан от 21 мая 2013 года № 94-V «О персональных данных и их защите».
          </p>

          <h4 className="font-bold text-white text-sm">1. Общие положения</h4>
          <p>
            Оператором персональных данных является Алмаз Сабыров (г. Атырау, Казахстан). Обработка персональных данных осуществляется исключительно с целью организации деловых встреч, проведения консультаций и аудита бизнес-процессов.
          </p>

          <h4 className="font-bold text-white text-sm">2. Состав собираемых данных</h4>
          <p>
            При оформлении онлайн-записи собираются следующие данные: имя, наименование компании, сфера деятельности, номер телефона (или WhatsApp), адрес электронной почты, адрес объекта (для выездного аудита в г. Атырау) и краткое описание технологической задачи.
          </p>

          <h4 className="font-bold text-white text-sm">3. Цели и безопасность обработки</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Формирование записи в календаре и отправка ссылки на встречу (Google Meet).</li>
            <li>Отправка подтверждения и напоминания о встрече.</li>
            <li>Прямое взаимодействие с клиентом для подготовки к консультации или аудиту.</li>
          </ul>
          <p>
            Данные не передаются третьим лицам, за исключением технологических провайдеров, обеспечивающих работу календаря и защищенных уведомлений (Google Calendar API, Telegram Bot API). Клиентский доступ к базе данных запрещен правилами безопасности Firestore, чтение и запись выполняет исключительно защищенный сервер.
          </p>

          <h4 className="font-bold text-white text-sm">4. Срок хранения и отзыв согласия</h4>
          <p>
            Данные хранятся до момента завершения взаимодействия либо до отзыва согласия субъектом данных. Вы можете отозвать согласие в любой момент, направив письмо на e-mail: [ЗАПОЛНИТЬ].
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            Понятно, закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
