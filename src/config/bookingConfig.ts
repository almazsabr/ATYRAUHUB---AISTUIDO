/**
 * bookingConfig.ts
 * Единый файл конфигурации правил онлайн-записи к Алмазу Сабырову.
 * Часовой пояс: Asia/Atyrau (UTC+5), на сайте: «время Казахстана».
 */

export interface ServiceDefinition {
  id: 'consultation' | 'audit';
  title: string;
  durationMinutes: number;
  price: number;
  currency: string;
  isFree: boolean;
  formatDescription: string;
  allowedFormats: ('online' | 'onsite')[];
  description: string;
  resultForClient: string;
}

export const BOOKING_CONFIG = {
  // Часовой пояс эксперта
  timeZone: 'Asia/Atyrau',
  timeZoneLabel: 'время Казахстана (UTC+5)',

  // Рабочие дни недели: 1 (Пн) - 5 (Пт)
  workingDays: [1, 2, 3, 4, 5],

  // Рабочее окно по часам: 10:00 - 18:00
  workingHours: {
    startHour: 10,
    startMinute: 0,
    endHour: 18,
    endMinute: 0,
  },

  // Буфер (запас) между встречами в минутах
  bufferMinutesBetweenMeetings: 15,

  // Ограничения бронирования
  minNoticeHours: 12, // Не позже чем за 12 часов
  maxDaysAhead: 14,   // Не дальше 14 дней вперёд

  // Защита от спама: лимит записей с одного телефона / e-mail в сутки
  maxBookingsPerContactPerDay: 3,

  // Услуги
  services: {
    consultation: {
      id: 'consultation',
      title: 'Бесплатная консультация',
      durationMinutes: 30,
      price: 0,
      currency: '₸',
      isFree: true,
      formatDescription: 'Онлайн, Google Meet',
      allowedFormats: ['online'],
      description: 'Знакомство и разбор одной конкретной задачи вашего бизнеса, где может помочь искусственный интеллект.',
      resultForClient: 'Понимание применимости ИИ к вашей задаче и рекомендации по дальнейшим шагам.',
    } as ServiceDefinition,

    audit: {
      id: 'audit',
      title: 'Аудит процессов бизнеса',
      durationMinutes: 90,
      price: 80000,
      currency: '₸',
      isFree: false,
      formatDescription: 'Онлайн или выезд по Атырау (от 80 000 ₸)',
      allowedFormats: ['online', 'onsite'],
      description: 'Глубокий 90-минутный аудит текущих процессов компании, точек потерь, узких мест и рутины сотрудников.',
      resultForClient: 'Карта процессов, где ИИ даст реальную пользу, и пошаговый план внедрения. Оплата по договорённости после записи.',
    } as ServiceDefinition,
  },
} as const;

export type ServiceType = keyof typeof BOOKING_CONFIG.services;
