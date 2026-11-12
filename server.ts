import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// ==========================================
// 1. Конфигурация бронирования и времени
// ==========================================
const TIMEZONE = 'Asia/Atyrau'; // UTC+5
const TIMEZONE_LABEL = 'время Казахстана (UTC+5)';

const WORKING_HOURS = {
  startHour: 10,
  startMinute: 0,
  endHour: 18,
  endMinute: 0,
};

const SERVICE_DURATIONS: Record<string, { duration: number; title: string }> = {
  consultation: { duration: 30, title: 'Бесплатная консультация' },
  audit: { duration: 90, title: 'Аудит процессов бизнеса' },
};

const BUFFER_MINUTES = 15;
const MAX_BOOKINGS_PER_CONTACT_PER_DAY = 3;

// ==========================================
// 2. Хранилище записей (Firestore + Local fallback)
// ==========================================
interface StoredBooking {
  id: string;
  service: 'consultation' | 'audit';
  serviceTitle: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  endSlot: string;  // HH:mm
  name: string;
  company: string;
  industry: string;
  phone: string;
  email: string;
  taskDescription: string;
  auditFormat?: 'online' | 'onsite';
  onsiteAddress?: string;
  meetLink?: string;
  googleEventId?: string;
  createdAt: string;
}

const memoryBookings: StoredBooking[] = [];

// Инициализация Firestore Admin (серверная сторона)
let firestoreDb: Firestore | null = null;
try {
  if (getApps().length === 0) {
    if (process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      firestoreDb = getFirestore();
      console.log('✅ Firebase Firestore Admin инициализирован на сервере.');
    } else {
      console.log('ℹ️ Firebase credentials не переданы. Записи сохраняются в локальное защищенное серверное хранилище.');
    }
  } else {
    firestoreDb = getFirestore();
  }
} catch (err) {
  console.warn('⚠️ Ошибка инициализации Firebase Admin:', err);
}

async function saveBookingToDb(booking: StoredBooking): Promise<void> {
  memoryBookings.push(booking);
  if (firestoreDb) {
    try {
      await firestoreDb.collection('bookings').doc(booking.id).set(booking);
      console.log(`✅ Запись ${booking.id} сохранена в Firestore.`);
    } catch (e) {
      console.error('Ошибка сохранения в Firestore:', e);
    }
  }
}

async function getBookingsForDate(dateStr: string): Promise<StoredBooking[]> {
  const fromMemory = memoryBookings.filter((b) => b.date === dateStr);
  if (!firestoreDb) return fromMemory;

  try {
    const snapshot = await firestoreDb.collection('bookings').where('date', '==', dateStr).get();
    const fromFirestore: StoredBooking[] = [];
    snapshot.forEach((doc: QueryDocumentSnapshot) => {
      fromFirestore.push(doc.data() as StoredBooking);
    });
    // Объединяем уникальные
    const ids = new Set(fromMemory.map((m) => m.id));
    for (const item of fromFirestore) {
      if (!ids.has(item.id)) {
        fromMemory.push(item);
      }
    }
  } catch (e) {
    console.warn('Ошибка чтения из Firestore:', e);
  }
  return fromMemory;
}

// ==========================================
// 3. Google Calendar API Клиент (OAuth 2.0)
// ==========================================
function getGoogleCalendarClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

// Запрос занятости из Google Календаря (freeBusy)
async function getGoogleBusyIntervals(dateStr: string): Promise<{ start: Date; end: Date }[]> {
  const calendar = getGoogleCalendarClient();
  if (!calendar) {
    return [];
  }

  const calendarId = process.env.CALENDAR_ID || 'primary';

  // Начало и конец рабочего дня в Asia/Atyrau (UTC+5)
  // Например: 2026-04-16T10:00:00+05:00 до 2026-04-16T18:00:00+05:00
  const timeMin = `${dateStr}T09:00:00+05:00`;
  const timeMax = `${dateStr}T19:00:00+05:00`;

  try {
    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    });

    const busy = res.data.calendars?.[calendarId]?.busy || [];
    return busy.map((b) => ({
      start: new Date(b.start || ''),
      end: new Date(b.end || ''),
    }));
  } catch (err) {
    console.error('Ошибка запроса Google Calendar freebusy:', err);
    return [];
  }
}

// Создание события в Google Календаре с Google Meet
async function createGoogleCalendarEvent(booking: StoredBooking): Promise<{ eventId?: string; meetLink?: string }> {
  const calendar = getGoogleCalendarClient();
  if (!calendar) {
    console.log('ℹ️ Google Calendar не настроен (секреты не заполнены).');
    return { meetLink: 'https://meet.google.com/ais-demo-meet' };
  }

  const calendarId = process.env.CALENDAR_ID || 'primary';
  const startDateTime = `${booking.date}T${booking.timeSlot}:00+05:00`;
  const endDateTime = `${booking.date}T${booking.endSlot}:00+05:00`;

  const summary = `${booking.serviceTitle} — ${booking.name}, ${booking.company}`;
  const description = [
    `Услуга: ${booking.serviceTitle}`,
    `Клиент: ${booking.name}`,
    `Компания: ${booking.company}`,
    `Сфера: ${booking.industry}`,
    `Телефон/WhatsApp: ${booking.phone}`,
    `E-mail: ${booking.email}`,
    booking.auditFormat ? `Формат: ${booking.auditFormat === 'onsite' ? 'Выезд по Атырау' : 'Онлайн'}` : '',
    booking.onsiteAddress ? `Адрес выезда: ${booking.onsiteAddress}` : '',
    '',
    'Описание задачи бизнеса:',
    booking.taskDescription,
    '',
    `Создано автоматически с сайта Алмаза Сабырова (${TIMEZONE_LABEL})`,
  ].filter(Boolean).join('\n');

  try {
    const isOnline = booking.service === 'consultation' || booking.auditFormat === 'online';

    const eventPayload: any = {
      summary,
      description,
      start: { dateTime: startDateTime, timeZone: TIMEZONE },
      end: { dateTime: endDateTime, timeZone: TIMEZONE },
      attendees: [{ email: booking.email, displayName: booking.name }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    if (isOnline) {
      eventPayload.conferenceData = {
        createRequest: {
          requestId: `meet-${booking.id}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
    }

    const createdEvent = await calendar.events.insert({
      calendarId,
      requestBody: eventPayload,
      conferenceDataVersion: isOnline ? 1 : 0,
      sendUpdates: 'all',
    });

    const meetLink = createdEvent.data.hangoutLink || createdEvent.data.conferenceData?.entryPoints?.[0]?.uri;
    return {
      eventId: createdEvent.data.id || undefined,
      meetLink: meetLink || (isOnline ? 'https://meet.google.com' : undefined),
    };
  } catch (err) {
    console.error('Ошибка создания события в Google Calendar:', err);
    return {};
  }
}

// ==========================================
// 4. Telegram Bot API Клиент
// ==========================================
async function sendTelegramNotification(booking: StoredBooking): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('ℹ️ Telegram-уведомление пропущено (TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы).');
    return;
  }

  const formatText = booking.auditFormat === 'onsite'
    ? `Выезд по Атырау (Адрес: ${booking.onsiteAddress || 'не указан'})`
    : 'Онлайн (Google Meet)';

  const text = [
    `🔔 *Новая онлайн-запись на сайте!*`,
    `📌 *Услуга:* ${booking.serviceTitle}`,
    `📅 *Дата и время:* ${booking.date} с ${booking.timeSlot} до ${booking.endSlot} (${TIMEZONE_LABEL})`,
    `👤 *Клиент:* ${booking.name}`,
    `🏢 *Компания:* ${booking.company} (${booking.industry})`,
    `📱 *Контакты:* ${booking.phone} | ${booking.email}`,
    `📍 *Формат:* ${formatText}`,
    booking.meetLink ? `🔗 *Ссылка Google Meet:* ${booking.meetLink}` : '',
    '',
    `📝 *Задача бизнеса:*`,
    booking.taskDescription,
  ].filter(Boolean).join('\n');

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.warn('Ошибка отправки в Telegram Bot API:', errText);
    } else {
      console.log('✅ Telegram-уведомление успешно доставлено.');
    }
  } catch (err) {
    console.error('Ошибка сети при отправке в Telegram:', err);
  }
}

// ==========================================
// 5. Вспомогательные функции генерации слотов
// ==========================================
function parseTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function formatMinutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Проверка: является ли день будним (Пн-Пт) в часовом поясе Asia/Atyrau
function isWorkingDay(dateStr: string): boolean {
  // dateStr format: YYYY-MM-DD
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const dayOfWeek = dateObj.getUTCDay(); // 0 - Sun, 6 - Sat
  return dayOfWeek >= 1 && dayOfWeek <= 5;
}

// ==========================================
// 6. API Маршруты
// ==========================================

// Проверка статуса сервера и секретов
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    ok: true,
    timeZone: TIMEZONE,
    timeZoneLabel: TIMEZONE_LABEL,
    googleCalendarConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN),
    telegramConfigured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    firestoreConfigured: !!firestoreDb,
  });
});

// Получение доступных слотов
app.get('/api/slots', async (req: Request, res: Response) => {
  const serviceType = (req.query.service as string) || 'consultation';
  const dateStr = req.query.date as string;

  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return res.status(400).json({ error: 'Укажите дату в формате YYYY-MM-DD' });
  }

  const serviceInfo = SERVICE_DURATIONS[serviceType] || SERVICE_DURATIONS.consultation;
  const duration = serviceInfo.duration;

  // 1. Проверяем, что дата — рабочий день (Пн–Пт)
  if (!isWorkingDay(dateStr)) {
    return res.json({
      ok: true,
      slots: [],
      reason: 'Выходной день (приём ведётся с понедельника по пятницу)',
      timeZone: TIMEZONE,
      timeZoneLabel: TIMEZONE_LABEL,
    });
  }

  // 2. Проверяем ограничение 14 дней вперёд и не позже чем за 12 часов
  // Текущее время в UTC
  const now = new Date();
  // Текущее время в Asia/Atyrau: UTC + 5 часов
  const atyrauNow = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  
  const [reqYear, reqMonth, reqDay] = dateStr.split('-').map(Number);
  const targetDateAtyrau = new Date(Date.UTC(reqYear, reqMonth - 1, reqDay));
  const todayAtyrau = new Date(Date.UTC(atyrauNow.getUTCFullYear(), atyrauNow.getUTCMonth(), atyrauNow.getUTCDate()));

  const diffDays = Math.round((targetDateAtyrau.getTime() - todayAtyrau.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0 || diffDays > 14) {
    return res.json({
      ok: true,
      slots: [],
      reason: 'Запись доступна на ближайшие 14 дней',
      timeZone: TIMEZONE,
      timeZoneLabel: TIMEZONE_LABEL,
    });
  }

  // 3. Собираем занятые интервалы
  const busyIntervals: { startMin: number; endMin: number }[] = [];

  // Занятость из базы (существующие подтверждённые брони)
  const existingBookings = await getBookingsForDate(dateStr);
  for (const b of existingBookings) {
    const s = parseTimeToMinutes(b.timeSlot);
    const e = parseTimeToMinutes(b.endSlot) + BUFFER_MINUTES;
    busyIntervals.push({ startMin: s, endMin: e });
  }

  // Занятость из Google Календаря
  const googleBusy = await getGoogleBusyIntervals(dateStr);
  for (const gb of googleBusy) {
    // Преобразуем в минуты относительно даты в Asia/Atyrau
    const startAtyrauHours = gb.start.getUTCHours() + 5;
    const startMins = startAtyrauHours * 60 + gb.start.getUTCMinutes();
    const endAtyrauHours = gb.end.getUTCHours() + 5;
    const endMins = endAtyrauHours * 60 + gb.end.getUTCMinutes() + BUFFER_MINUTES;
    busyIntervals.push({ startMin: startMins, endMin: endMins });
  }

  // 4. Генерируем возможные слоты в рабочем окне 10:00 - 18:00
  const workStartMin = WORKING_HOURS.startHour * 60 + WORKING_HOURS.startMinute;
  const workEndMin = WORKING_HOURS.endHour * 60 + WORKING_HOURS.endMinute;

  // Шаг между слотами: для консультации (30 мин) каждые 45 минут (30+15 buffer), или каждые 30 мин если буфер между ними
  // Удобный шаг: 45 минут для 30-мин консультаций (10:00, 10:45, 11:30, 12:15, 14:00, ...)
  // Для аудита (90 мин): 105 минут (90+15 buffer): 10:00, 11:45, 14:00, 15:45
  const stepMinutes = duration === 30 ? 45 : 105;

  const freeSlots: string[] = [];

  for (let currentMin = workStartMin; currentMin + duration <= workEndMin; currentMin += stepMinutes) {
    const slotEndMin = currentMin + duration;

    // Проверка 12 часов до встречи
    if (diffDays === 0) {
      // Сегодня: проверяем сколько часов осталось в Asia/Atyrau
      const currentAtyrauMinsNow = atyrauNow.getUTCHours() * 60 + atyrauNow.getUTCMinutes();
      if (currentMin - currentAtyrauMinsNow < 12 * 60) {
        continue; // менее 12 часов
      }
    } else if (diffDays === 1) {
      // Завтра: учитываем оставшееся время сегодня
      const currentAtyrauMinsNow = atyrauNow.getUTCHours() * 60 + atyrauNow.getUTCMinutes();
      const minutesUntilSlot = (24 * 60 - currentAtyrauMinsNow) + currentMin;
      if (minutesUntilSlot < 12 * 60) {
        continue;
      }
    }

    // Проверяем коллизии с занятыми интервалами
    const isCollision = busyIntervals.some((busy) => {
      // Отрезок [currentMin, slotEndMin + buffer] пересекается с [busy.startMin, busy.endMin]?
      return currentMin < busy.endMin && slotEndMin + BUFFER_MINUTES > busy.startMin;
    });

    if (!isCollision) {
      freeSlots.push(formatMinutesToTime(currentMin));
    }
  }

  res.json({
    ok: true,
    slots: freeSlots,
    date: dateStr,
    service: serviceType,
    durationMinutes: duration,
    timeZone: TIMEZONE,
    timeZoneLabel: TIMEZONE_LABEL,
  });
});

// Создание записи
app.post('/api/book', async (req: Request, res: Response) => {
  const {
    service,
    date,
    timeSlot,
    name,
    company,
    industry,
    phone,
    email,
    taskDescription,
    auditFormat,
    onsiteAddress,
    consentPrivacy,
    websiteTrap, // Honeypot spam trap
  } = req.body;

  // 1. Защита от спама: поле-ловушка
  if (websiteTrap) {
    console.warn('🚨 Спам-бот заблокирован через honeypot (websiteTrap).');
    return res.status(400).json({ error: 'Некорректный запрос.' });
  }

  // 2. Валидация обязательных полей
  if (!name?.trim() || !company?.trim() || !phone?.trim() || !email?.trim() || !taskDescription?.trim()) {
    return res.status(400).json({ error: 'Пожалуйста, заполните все обязательные поля.' });
  }

  if (!consentPrivacy) {
    return res.status(400).json({ error: 'Необходимо подтвердить согласие на обработку персональных данных.' });
  }

  if (!date || !timeSlot) {
    return res.status(400).json({ error: 'Выберите дату и свободное время.' });
  }

  const cleanPhone = phone.trim();
  const cleanEmail = email.trim().toLowerCase();

  // 3. Защита от спама: не более 3 записей с одного телефона или e-mail в сутки
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentBookingsCount = memoryBookings.filter((b) => {
    const isSameContact = b.phone === cleanPhone || b.email === cleanEmail;
    const createdAtDate = new Date(b.createdAt);
    return isSameContact && createdAtDate >= oneDayAgo;
  }).length;

  if (recentBookingsCount >= MAX_BOOKINGS_PER_CONTACT_PER_DAY) {
    return res.status(429).json({
      error: 'Превышен лимит записей: не более 3 заявок с одного телефона или e-mail в течение суток.',
    });
  }

  const serviceInfo = SERVICE_DURATIONS[service] || SERVICE_DURATIONS.consultation;
  const duration = serviceInfo.duration;
  const startMin = parseTimeToMinutes(timeSlot);
  const endMin = startMin + duration;
  const endSlot = formatMinutesToTime(endMin);

  // 4. Повторная проверка занятости (исключение двойной записи)
  const existingBookings = await getBookingsForDate(date);
  const hasConflictInDb = existingBookings.some((b) => {
    const bStart = parseTimeToMinutes(b.timeSlot);
    const bEnd = parseTimeToMinutes(b.endSlot) + BUFFER_MINUTES;
    return startMin < bEnd && endMin + BUFFER_MINUTES > bStart;
  });

  if (hasConflictInDb) {
    return res.status(409).json({
      error: 'Выбранный слот уже занят другим клиентом. Пожалуйста, выберите другое время.',
    });
  }

  // Повторная проверка через Google Calendar freebusy
  const googleBusy = await getGoogleBusyIntervals(date);
  const hasConflictInGoogle = googleBusy.some((gb) => {
    const gbStartAtyrau = (gb.start.getUTCHours() + 5) * 60 + gb.start.getUTCMinutes();
    const gbEndAtyrau = (gb.end.getUTCHours() + 5) * 60 + gb.end.getUTCMinutes() + BUFFER_MINUTES;
    return startMin < gbEndAtyrau && endMin + BUFFER_MINUTES > gbStartAtyrau;
  });

  if (hasConflictInGoogle) {
    return res.status(409).json({
      error: 'В календаре появилось пересекающееся событие. Пожалуйста, выберите другой слот.',
    });
  }

  // 5. Формирование объекта бронирования
  const bookingId = `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const bookingRecord: StoredBooking = {
    id: bookingId,
    service: service === 'audit' ? 'audit' : 'consultation',
    serviceTitle: serviceInfo.title,
    date,
    timeSlot,
    endSlot,
    name: name.trim(),
    company: company.trim(),
    industry: industry?.trim() || 'Производство / Бизнес',
    phone: cleanPhone,
    email: cleanEmail,
    taskDescription: taskDescription.trim(),
    auditFormat: service === 'audit' ? (auditFormat === 'onsite' ? 'onsite' : 'online') : 'online',
    onsiteAddress: onsiteAddress?.trim(),
    createdAt: new Date().toISOString(),
  };

  // 6. Создание события в Google Календаре (если настроен)
  const calendarResult = await createGoogleCalendarEvent(bookingRecord);
  bookingRecord.googleEventId = calendarResult.eventId;
  bookingRecord.meetLink = calendarResult.meetLink;

  // 7. Сохранение в Firestore / защищенную БД сервера
  await saveBookingToDb(bookingRecord);

  // 8. Отправка мгновенного уведомления в Telegram-бот
  await sendTelegramNotification(bookingRecord);

  // 9. Формирование ссылки для добавления в Google Календарь клиентом
  const startIso = `${date.replace(/-/g, '')}T${timeSlot.replace(':', '')}00`;
  const endIso = `${date.replace(/-/g, '')}T${endSlot.replace(':', '')}00`;
  const calTitle = encodeURIComponent(`${bookingRecord.serviceTitle} — Алмаз Сабыров`);
  const calDetails = encodeURIComponent(
    `Встреча с Алмазом Сабыровым по внедрению ИИ.\nКомпания: ${bookingRecord.company}\nКонтакты: ${bookingRecord.phone}\n${bookingRecord.meetLink ? `Ссылка Meet: ${bookingRecord.meetLink}` : ''}`
  );
  const addToCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${startIso}/${endIso}&details=${calDetails}&ctz=${TIMEZONE}`;

  res.status(201).json({
    ok: true,
    bookingId: bookingRecord.id,
    serviceTitle: bookingRecord.serviceTitle,
    date: bookingRecord.date,
    timeSlot: bookingRecord.timeSlot,
    endSlot: bookingRecord.endSlot,
    timeZoneLabel: TIMEZONE_LABEL,
    meetLink: bookingRecord.meetLink,
    addToCalendarUrl,
    auditFormat: bookingRecord.auditFormat,
    onsiteAddress: bookingRecord.onsiteAddress,
  });
});

// ==========================================
// 7. Интеграция с Vite (Dev / Prod)
// ==========================================
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`🕒 Часовой пояс: ${TIMEZONE} (${TIMEZONE_LABEL})`);
  });
}

startServer().catch((err) => {
  console.error('Критическая ошибка запуска сервера:', err);
});
