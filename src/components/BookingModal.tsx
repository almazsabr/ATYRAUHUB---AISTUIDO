import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle, Video, MapPin, Loader2, ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { BOOKING_CONFIG, ServiceType } from '../config/bookingConfig';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceType;
  onOpenPrivacy: () => void;
}

interface BookingConfirmationData {
  bookingId: string;
  serviceTitle: string;
  date: string;
  timeSlot: string;
  endSlot: string;
  timeZoneLabel: string;
  meetLink?: string;
  addToCalendarUrl?: string;
  auditFormat?: string;
  onsiteAddress?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService = 'consultation',
  onOpenPrivacy,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [service, setService] = useState<ServiceType>(initialService);

  // Date selection
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<{ dateStr: string; label: string }[]>([]);

  // Slots fetched from server
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string>('');

  // Form inputs
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [auditFormat, setAuditFormat] = useState<'online' | 'onsite'>('online');
  const [onsiteAddress, setOnsiteAddress] = useState('');
  const [consentPrivacy, setConsentPrivacy] = useState(true);
  const [websiteTrap, setWebsiteTrap] = useState(''); // Honeypot spam trap

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmedData, setConfirmedData] = useState<BookingConfirmationData | null>(null);

  // Sync initial service when modal opens
  useEffect(() => {
    if (isOpen) {
      setService(initialService);
      setStep(1);
      setConfirmedData(null);
      setSubmitError('');
      generateWorkingDates();
    }
  }, [isOpen, initialService]);

  // Generate 14-day working date window
  const generateWorkingDates = () => {
    const list: { dateStr: string; label: string }[] = [];
    const now = new Date();
    
    // Month names in Russian
    const monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
    ];
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

    for (let i = 1; i <= 14; i++) {
      const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const dayOfWeek = d.getDay();
      // Исключаем субботу (6) и воскресенье (0)
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateNum = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dateNum}`;
      const label = `${dayNames[dayOfWeek]}, ${d.getDate()} ${monthNames[d.getMonth()]}`;

      list.push({ dateStr, label });
    }

    setAvailableDates(list);
    if (list.length > 0 && !selectedDate) {
      setSelectedDate(list[0].dateStr);
    }
  };

  // Fetch free slots from server whenever selectedDate or service changes
  const fetchSlotsForDate = async (dateStr: string, serv: ServiceType) => {
    if (!dateStr) return;
    setIsLoadingSlots(true);
    setSlotsError('');
    setSelectedSlot('');

    try {
      const res = await fetch(`/api/slots?service=${serv}&date=${dateStr}`);
      const data = await res.json();
      if (!res.ok) {
        setSlotsError(data.error || 'Не удалось получить слоты с сервера');
        setSlots([]);
      } else {
        setSlots(data.slots || []);
        if (data.reason) {
          setSlotsError(data.reason);
        }
      }
    } catch (err) {
      console.error('Ошибка запроса слотов:', err);
      setSlotsError('Ошибка связи с сервером календаря. Попробуйте еще раз.');
      setSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    fetchSlotsForDate(dateStr, service);
    setStep(3);
  };

  const handleServiceSelect = (serv: ServiceType) => {
    setService(serv);
    setStep(2);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !phone.trim() || !email.trim() || !taskDescription.trim()) {
      setSubmitError('Заполните все обязательные поля формы.');
      return;
    }

    if (!consentPrivacy) {
      setSubmitError('Необходимо согласие на обработку персональных данных.');
      return;
    }

    if (service === 'audit' && auditFormat === 'onsite' && !onsiteAddress.trim()) {
      setSubmitError('Укажите адрес объекта в г. Атырау для выезда.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service,
          date: selectedDate,
          timeSlot: selectedSlot,
          name: name.trim(),
          company: company.trim(),
          industry: industry.trim() || 'Производство / Бизнес',
          phone: phone.trim(),
          email: email.trim(),
          taskDescription: taskDescription.trim(),
          auditFormat,
          onsiteAddress: auditFormat === 'onsite' ? onsiteAddress.trim() : undefined,
          consentPrivacy,
          websiteTrap, // Honeypot
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || 'Произошла ошибка при сохранении записи. Пожалуйста, выберите другой слот.');
        setIsSubmitting(false);
      } else {
        setConfirmedData(data);
        setStep(5);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Ошибка отправки записи:', err);
      setSubmitError('Ошибка соединения с сервером. Пожалуйста, повторите попытку.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentServiceDef = BOOKING_CONFIG.services[service];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {step === 5 ? 'Запись подтверждена' : 'Онлайн-запись к Алмазу Сабырову'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
                {BOOKING_CONFIG.timeZoneLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (Steps 1 to 4) */}
        {step < 5 && (
          <div className="grid grid-cols-4 border-b border-slate-800 text-[11px] font-mono text-center bg-slate-950/60">
            <div className={`py-2 border-b-2 ${step === 1 ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-slate-500'}`}>
              1. Услуга
            </div>
            <div className={`py-2 border-b-2 ${step === 2 ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-slate-500'}`}>
              2. Дата
            </div>
            <div className={`py-2 border-b-2 ${step === 3 ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-slate-500'}`}>
              3. Время
            </div>
            <div className={`py-2 border-b-2 ${step === 4 ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-slate-500'}`}>
              4. Данные
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm flex-1">
          {/* STEP 1: Выбор услуги */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-xs font-medium text-slate-300">
                Шаг 1 из 4: Выберите формат встречи
              </label>

              <div className="space-y-3">
                {/* Consultation */}
                <button
                  type="button"
                  onClick={() => handleServiceSelect('consultation')}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    service === 'consultation'
                      ? 'bg-amber-400/10 border-amber-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-base">
                      {BOOKING_CONFIG.services.consultation.title}
                    </span>
                    <span className="font-mono text-emerald-400 text-xs font-semibold">
                      Бесплатно · 30 мин
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {BOOKING_CONFIG.services.consultation.description}
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Video className="w-3 h-3 text-amber-400" />
                    <span>Google Meet (ссылка формируется автоматически)</span>
                  </div>
                </button>

                {/* Audit */}
                <button
                  type="button"
                  onClick={() => handleServiceSelect('audit')}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    service === 'audit'
                      ? 'bg-amber-400/10 border-amber-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-base">
                      {BOOKING_CONFIG.services.audit.title}
                    </span>
                    <span className="font-mono text-amber-400 text-xs font-bold">
                      от 80 000 ₸ · 90 мин
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {BOOKING_CONFIG.services.audit.description}
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>Онлайн или выезд на производство в г. Атырау</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Выбор даты на ближайшие 14 дней */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Шаг 2 из 4: Выберите дату встречи (будние дни)
                </label>
                <span className="text-[11px] font-mono text-amber-400">
                  {currentServiceDef.title}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableDates.map((d) => (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => handleDateSelect(d.dateStr)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedDate === d.dateStr
                        ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="text-xs font-medium">{d.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Выбор свободного слота с сервера */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Шаг 3 из 4: Выберите свободное время ({selectedDate})
                </label>
                <span className="text-[11px] font-mono text-amber-400">
                  {currentServiceDef.durationMinutes} мин
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono">
                🕒 Время слотов: {BOOKING_CONFIG.timeZoneLabel}. Запас между встречами: 15 минут.
              </div>

              {isLoadingSlots ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
                  <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                  <span className="text-xs font-mono">Синхронизация с Google Календарем...</span>
                </div>
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStep(4);
                      }}
                      className={`p-3 rounded-xl border font-mono text-center text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-white hover:border-amber-400/60 hover:bg-slate-900'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                  <Clock className="w-8 h-8 text-amber-400/60 mx-auto" />
                  <p className="text-xs text-slate-300">
                    {slotsError || 'На выбранную дату нет свободных окон с соблюдением 12-часового правила.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-amber-400 hover:underline pt-1 inline-block"
                  >
                    ← Выбрать другую дату
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Форма клиента и подтверждение согласия */}
          {step === 4 && (
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              {/* Summary Header of Chosen Slot */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-slate-400 block font-mono text-[11px]">Выбранная услуга и слот:</span>
                  <span className="font-bold text-white text-sm">{currentServiceDef.title}</span>
                  <span className="text-amber-400 font-mono block">
                    {selectedDate} в {selectedSlot} ({BOOKING_CONFIG.timeZoneLabel})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-slate-400 hover:text-white underline font-mono"
                >
                  Изменить слот
                </button>
              </div>

              {submitError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Honeypot hidden input for spam bots */}
              <input
                type="text"
                name="website_trap"
                value={websiteTrap}
                onChange={(e) => setWebsiteTrap(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* Format selection for Audit */}
              {service === 'audit' && (
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Формат проведения аудита:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAuditFormat('online')}
                      className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                        auditFormat === 'online'
                          ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      Онлайн (Google Meet)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditFormat('onsite')}
                      className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                        auditFormat === 'onsite'
                          ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      Выезд по Атырау
                    </button>
                  </div>

                  {auditFormat === 'onsite' && (
                    <div className="pt-1">
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Адрес объекта или офиса в г. Атырау *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ул. Сатпаева, 15 или промзона..."
                        value={onsiteAddress}
                        onChange={(e) => setOnsiteAddress(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Аслан"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Компания *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ТОО «КазПромСервис»"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Сфера бизнеса:
                </label>
                <input
                  type="text"
                  placeholder="Производство, дистрибуция, пищевая отрасль, услуги..."
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Телефон или WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (701) 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    E-mail (для приглашения в Google Календарь) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="director@company.kz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Краткое описание задачи, где может помочь ИИ *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Опишите, какую задачу хотите решить или какой процесс автоматизировать..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Mandatory Privacy Policy Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consentPrivacy}
                    onChange={(e) => setConsentPrivacy(e.target.checked)}
                    className="accent-amber-400 rounded w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                  />
                  <span>
                    Я подтверждаю согласие на обработку персональных данных в соответствии с{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenPrivacy();
                      }}
                      className="text-amber-400 underline hover:text-amber-300 inline cursor-pointer"
                    >
                      Политикой конфиденциальности
                    </button>
                    .
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Синхронизация и бронирование...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Подтвердить запись на встречу</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Экран подтверждения записи */}
          {step === 5 && confirmedData && (
            <div className="py-6 text-center space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-white">
                  Вы успешно записаны!
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Событие зафиксировано в рабочем графике и отправлено в Google Календарь
                </p>
              </div>

              {/* Details card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Услуга:</span>
                  <span className="font-bold text-white">{confirmedData.serviceTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Дата:</span>
                  <span className="font-mono text-white">{confirmedData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Время встречи:</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {confirmedData.timeSlot} – {confirmedData.endSlot} ({confirmedData.timeZoneLabel})
                  </span>
                </div>
                {confirmedData.auditFormat === 'onsite' && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес выезда:</span>
                    <span className="text-white text-right">{confirmedData.onsiteAddress}</span>
                  </div>
                )}
                {confirmedData.meetLink && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-400 block mb-1">Ссылка на онлайн-встречу:</span>
                    <a
                      href={confirmedData.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-amber-400 text-xs hover:underline break-all"
                    >
                      {confirmedData.meetLink}
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {confirmedData.addToCalendarUrl && (
                  <a
                    href={confirmedData.addToCalendarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Добавить в Google Календарь</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  Готово, закрыть
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation (Step back if step 2, 3, 4) */}
        {step > 1 && step < 5 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Назад</span>
            </button>
            <span className="text-[11px] font-mono text-slate-500">
              Шаг {step} из 4
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
