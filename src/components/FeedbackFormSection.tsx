import React, { useState } from 'react';
import { Send, Upload, Shield, CheckCircle2, AlertCircle, FileCheck, Lock } from 'lucide-react';
import { SPECIALIST_BIO } from '../data/mockData';

interface FeedbackFormSectionProps {
  onFormSubmitted: (data: { name: string; company: string; email: string; industry: string; message: string; telegram: string }) => void;
}

export const FeedbackFormSection: React.FC<FeedbackFormSectionProps> = ({ onFormSubmitted }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('Металлургия и трубный прокат');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [message, setMessage] = useState('');
  const [needNda, setNeedNda] = useState(true);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFakeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setError('Заполните обязательные поля формы перед отправкой.');
      return;
    }

    onFormSubmitted({
      name,
      company,
      email,
      industry,
      message,
      telegram: telegram || '@user',
    });

    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase">
                <span>Обратная связь & Экспресс-ТЗ</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Строгий NDA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Обсудить внедрение ИИ на вашем предприятии
              </h2>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Направьте краткое описание технологической проблемы или готовое техническое задание (ТЗ). Я лично свяжусь с вами в течение 2 рабочих часов для предварительной оценки технической осуществимости и ориентировочного ROI.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Гарантия конфиденциальности данных:</span>
                  <span>При необходимости подписываем типовое двустороннее NDA до передачи подробных схем линии и технологических карт.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Формат работы:</span>
                  <span>Работа по договору, поэтапная приемка с подтверждением метрик на опытной партии.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5 font-mono">
              <div>Прямой контакт в Telegram: <a href={`https://t.me/${SPECIALIST_BIO.contacts.telegram.replace('@', '')}`} className="text-amber-400 hover:underline">{SPECIALIST_BIO.contacts.telegram}</a></div>
              <div>Корпоративный Email: <a href={`mailto:${SPECIALIST_BIO.contacts.email}`} className="text-amber-400 hover:underline">{SPECIALIST_BIO.contacts.email}</a></div>
              <div>Базирование: {SPECIALIST_BIO.location}</div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Заявка успешно принята!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Спасибо, {name}! Уведомление мгновенно передано в Telegram-бот инженера. Мы свяжемся с вами по адресу <span className="text-amber-400 font-mono">{email}</span> в ближайшее время.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                      setAttachedFileName(null);
                    }}
                    className="px-5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Отправить дополнительное обращение
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">
                      ФИО и должность *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Сергей Морозов, Главный инженер"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">
                      Предприятие / Завод *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="АО «Трубная Металлургическая Компания»"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        setError('');
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">
                      Рабочий Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="morozov@tmk.ru"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (912) 000-00-00"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setError('');
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">
                      Telegram (для связи)
                    </label>
                    <input
                      type="text"
                      placeholder="@morozov_tech"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Промышленный сектор:
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
                  >
                    <option value="Металлургия и трубный прокат">Металлургия и трубный прокат</option>
                    <option value="Энергетика и ТЭК">Энергетика, ТЭЦ и гидрогенерация</option>
                    <option value="Машиностроение и сборка">Тяжелое и точное машиностроение</option>
                    <option value="Нефтехимия и полимеры">Нефтехимия, переработка и полимеры</option>
                    <option value="Горнодобыча и обогащение">Горнодобывающая промышленность и ГОКи</option>
                    <option value="Другое производство">Другое промышленное производство</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Описание технологической проблемы или технического задания *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Опишите агрегат, текущий процент брака или аварийность, скорость линии, имеющиеся датчики и цели внедрения ИИ..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-amber-400 text-xs resize-none"
                  />
                </div>

                {/* File Attachment & NDA Checkbox */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-800">
                  <label className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 hover:border-slate-600 text-slate-300 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate max-w-[200px]">
                      {attachedFileName || 'Прикрепить ТЗ / чертеж (PDF, DOCX)'}
                    </span>
                    <input
                      type="file"
                      onChange={handleFakeFileUpload}
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.dwg,.xlsx"
                    />
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                    <input
                      type="checkbox"
                      checked={needNda}
                      onChange={(e) => setNeedNda(e.target.checked)}
                      className="accent-amber-400 rounded cursor-pointer"
                    />
                    <span>Требуется подписание NDA до созвона</span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl transition-all shadow-lg cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Отправить запрос на экспресс-аудит (2 часа ответ)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
