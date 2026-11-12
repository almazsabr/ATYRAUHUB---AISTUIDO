import React, { useState } from 'react';
import { X, Shield, Lock, KeyRound, CheckCircle2, FileText, Download, Clock, AlertCircle, RefreshCw, Send, Plus, Eye } from 'lucide-react';
import { CLIENT_DOCUMENTS_DATA, CLIENT_INTERACTIONS_DATA } from '../data/mockData';
import { ClientDocument, ClientInteraction } from '../types';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({ isOpen, onClose, onTriggerToast }) => {
  // Auth flow states: 'login' | '2fa' | 'dashboard'
  const [authStep, setAuthStep] = useState<'login' | '2fa' | 'dashboard'>('login');
  
  // Credentials
  const [email, setEmail] = useState('client@severstal.ru');
  const [password, setPassword] = useState('••••••••••••');
  
  // 2FA state
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [timer, setTimer] = useState(28);
  const [activeTab, setActiveTab] = useState<'projects' | 'history' | 'documents' | 'ticket'>('projects');
  
  // Data in portal
  const [documents, setDocuments] = useState<ClientDocument[]>(CLIENT_DOCUMENTS_DATA);
  const [interactions, setInteractions] = useState<ClientInteraction[]>(CLIENT_INTERACTIONS_DATA);
  const [selectedDocPreview, setSelectedDocPreview] = useState<ClientDocument | null>(null);
  
  // New ticket state
  const [ticketTopic, setTicketTopic] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const handleInitialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setAuthError('Введите рабочий email аккаунта');
      return;
    }
    setAuthError('');
    setAuthStep('2fa');
    onTriggerToast('2FA код отправлен', 'Одноразовый проверочный код направлен в ваш Telegram-бот и Authenticator', 'info');
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length < 6) {
      setAuthError('Введите полный 6-значный код безопасности');
      return;
    }
    setAuthError('');
    setAuthStep('dashboard');
    onTriggerToast('Успешная авторизация (2FA)', 'Сессия защищена шифрованием TLS 1.3 с взаимной аутентификацией', 'success');
  };

  const handleAutoFill2FA = () => {
    setTwoFactorCode('482910');
    setAuthError('');
  };

  const handleDownloadDoc = (doc: ClientDocument) => {
    onTriggerToast(
      'Загрузка документа',
      `Файл ${doc.fileName} успешно сгенерирован и скачан со сквозным шифрованием.`,
      'success'
    );
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTopic.trim() || !ticketMessage.trim()) return;

    const newInteraction: ClientInteraction = {
      id: `inter-${Date.now()}`,
      date: 'Сегодня, только что',
      title: `Запрос клиента: ${ticketTopic}`,
      type: 'Техническая сессия',
      participants: 'Заказчик (ПАО «Северсталь»), Алмаз Сабыров (Lead)',
      summary: ticketMessage,
      actionItems: ['Принято в работу, ожидаемое время ответа до 2 часов'],
    };

    setInteractions([newInteraction, ...interactions]);
    setTicketTopic('');
    setTicketMessage('');
    setActiveTab('history');
    onTriggerToast('Запрос зарегистрирован', 'Инженер уведомлен через защищенный Telegram-шлюз', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Защищенный личный кабинет клиента
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  <Lock className="w-3 h-3" /> 2FA Enforced
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Единый реестр проектов, технической документации и протоколов аудита
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

        {/* STEP 1: LOGIN */}
        {authStep === 'login' && (
          <div className="p-6 sm:p-10 max-w-md mx-auto w-full space-y-6 my-auto">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Вход для действующих клиентов</h4>
              <p className="text-xs text-slate-400">
                Используйте корпоративный email, указанный при заключении договора
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleInitialLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Рабочий email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Пароль аккаунта:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400 text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Продолжить к двухфакторной аутентификации (2FA)
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-800">
              <span className="text-[11px] text-slate-500 block mb-2">Демонстрационный доступ для тестирования:</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('chief.engineer@severstal.ru');
                  setPassword('DemoPass2026!');
                  setAuthStep('2fa');
                  onTriggerToast('Демо-доступ активирован', 'Переход к проверке двухфакторного кода 2FA', 'info');
                }}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                Войти как ПАО «Северсталь» (Демо-аккаунт)
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 2FA VERIFICATION */}
        {authStep === '2fa' && (
          <div className="p-6 sm:p-10 max-w-md mx-auto w-full space-y-6 my-auto">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
                <KeyRound className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Двухфакторная защита (2FA)</h4>
              <p className="text-xs text-slate-400">
                Введите 6-значный проверочный код из вашего Google Authenticator или Telegram-бота
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-center text-slate-400 mb-2">
                  ВВЕДИТЕ 6-ЗНАЧНЫЙ ТОКЕН TOTP:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  placeholder="482910"
                  onChange={(e) => {
                    setTwoFactorCode(e.target.value.replace(/\D/g, ''));
                    setAuthError('');
                  }}
                  className="w-full text-center text-2xl font-mono tracking-widest bg-slate-950 border border-amber-400/40 rounded-xl p-3 text-amber-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Fast Auto-Fill for Testing Demonstration */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Тестовый одноразовый код:</span>
                <button
                  type="button"
                  onClick={handleAutoFill2FA}
                  className="text-amber-400 font-mono font-bold hover:underline cursor-pointer"
                >
                  482910 (Клик для вставки)
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Подтвердить код и открыть кабинет
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAuthStep('login')}
                className="hover:text-slate-300"
              >
                ← Сменить аккаунт
              </button>
              <button
                type="button"
                onClick={() => {
                  onTriggerToast('Новый код отправлен', 'Код безопасности повторно отправлен в Telegram-бот', 'info');
                }}
                className="hover:text-amber-400 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Переотправить код (через {timer}с)</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CLIENT DASHBOARD */}
        {authStep === 'dashboard' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Dashboard Bar */}
            <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400">
                  СВ
                </div>
                <div>
                  <span className="font-semibold text-white block">ПАО «Северсталь» · Череповец</span>
                  <span className="text-slate-400 text-[11px]">Договор № ИИ-2025/11 · Роль: Куратор проекта</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthStep('login');
                    onTriggerToast('Выход из системы', 'Защищенная сессия 2FA завершена', 'info');
                  }}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-700 rounded-md"
                >
                  Выйти
                </button>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-900/60 overflow-x-auto text-xs">
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-3 px-3.5 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'projects'
                    ? 'border-amber-400 text-amber-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Активные проекты & Этапы
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-3 px-3.5 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'history'
                    ? 'border-amber-400 text-amber-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                История взаимодействий ({interactions.length})
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-3 px-3.5 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'documents'
                    ? 'border-amber-400 text-amber-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Хранилище документов ({documents.length})
              </button>
              <button
                onClick={() => setActiveTab('ticket')}
                className={`py-3 px-3.5 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'ticket'
                    ? 'border-amber-400 text-amber-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                + Запрос инженеру
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* TAB 1: PROJECTS & MILESTONES */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {/* Current Active Project Progress */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>ЭТАП 4 ИЗ 5 · ОПЫТНО-ПРОМЫШЛЕННАЯ ЭКСПЛУАТАЦИЯ</span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          Внедрение машинного зрения на агрегате непрерывного травления стали (АНТ)
                        </h4>
                      </div>
                      <span className="text-sm font-bold font-mono text-amber-400">
                        85% готовность
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: '85%' }} />
                    </div>

                    {/* Milestones Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-white font-medium block">Этап 1: Оптический расчет и монтаж камер</span>
                          <span className="text-slate-500 text-[11px]">Завершено 15.01.2026 · Акт подписан</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-white font-medium block">Этап 2: Сбор и разметка датасета (180k кадров)</span>
                          <span className="text-slate-500 text-[11px]">Завершено 20.02.2026 · Точность 98.4%</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-white font-medium block">Этап 3: Интеграция с АСУ ТП через Profinet</span>
                          <span className="text-slate-500 text-[11px]">Завершено 25.03.2026 · Задержка 42мс</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-400/30 flex items-start gap-2">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-amber-300 font-medium block">Этап 4: Горячие испытания на рабочей скорости</span>
                          <span className="text-slate-400 text-[11px]">Текущий этап · Сдача до 25 апреля</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary of Impact */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">Проинспектировано рулонов:</span>
                      <div className="text-xl font-bold font-mono text-white tabular-nums">4 820 шт</div>
                      <span className="text-[11px] text-emerald-400 font-mono mt-1 block">Без единого сбоя камер</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">Выявлено дефектных участков:</span>
                      <div className="text-xl font-bold font-mono text-white tabular-nums">142 брака</div>
                      <span className="text-[11px] text-amber-400 font-mono mt-1 block">Предотвращена отгрузка</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">Экономия за отчетный период:</span>
                      <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">18.4 млн ₽</div>
                      <span className="text-[11px] text-slate-500 font-mono mt-1 block">Подтверждено ОТК</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INTERACTIONS HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase text-slate-400">
                      Журнал встреч, выездных аудитов и технических решений:
                    </h4>
                    <span className="text-xs text-slate-500">Синхронизировано со СКУД и календарем</span>
                  </div>

                  <div className="space-y-3">
                    {interactions.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400">
                          <span className="font-mono text-amber-400">{item.date}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                            {item.type}
                          </span>
                        </div>

                        <h5 className="text-sm font-bold text-white">
                          {item.title}
                        </h5>

                        <p className="text-slate-300 leading-relaxed">
                          {item.summary}
                        </p>

                        <div className="text-slate-400 text-[11px]">
                          <span className="text-slate-500">Участники: </span>
                          {item.participants}
                        </div>

                        {item.actionItems.length > 0 && (
                          <div className="pt-2 border-t border-slate-800/80 space-y-1">
                            <span className="text-[11px] text-slate-400 font-semibold block">
                              Поручения и договоренности:
                            </span>
                            {item.actionItems.map((act, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-slate-300 text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                <span>{act}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DOCUMENTS REPOSITORY */}
              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase text-slate-400">
                      Реестр юридических и технических документов проекта:
                    </h4>
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3" /> Хранилище с шифрованием AES-256
                    </span>
                  </div>

                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono">
                        <tr>
                          <th className="p-3">Документ</th>
                          <th className="p-3 hidden sm:table-cell">Тип</th>
                          <th className="p-3 hidden sm:table-cell">Размер</th>
                          <th className="p-3">Статус</th>
                          <th className="p-3 text-right">Действие</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {documents.map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-900/50">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                                <div>
                                  <span className="font-semibold text-white block">{doc.title}</span>
                                  <span className="text-[11px] text-slate-500 font-mono">{doc.fileName} · {doc.date}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 hidden sm:table-cell font-mono text-slate-400">{doc.type}</td>
                            <td className="p-3 hidden sm:table-cell font-mono text-slate-400">{doc.size}</td>
                            <td className="p-3">
                              {doc.status === 'signed' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                                  <CheckCircle2 className="w-3 h-3" /> Подписан
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-sky-400">
                                  Готов к выгрузке
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDownloadDoc(doc)}
                                className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-md transition-colors"
                                title="Скачать защищенный файл"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: NEW TICKET / REQUEST */}
              {activeTab === 'ticket' && (
                <form onSubmit={handleSendTicket} className="space-y-4 max-w-xl text-xs">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      Создать защищенное обращение к эксперту
                    </h4>
                    <p className="text-slate-400">
                      Сообщение мгновенно поступит на дежурный терминал инженера с высоким приоритетом SLA
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Тема запроса *</label>
                    <input
                      type="text"
                      required
                      placeholder="Например: Согласование даты выезда на переналадку подсветки"
                      value={ticketTopic}
                      onChange={(e) => setTicketTopic(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Описание запроса *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Опишите детали, приложите ссылки на логи или укажите номера подозрительных рулонов..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Отправить запрос в контур поддержки</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
