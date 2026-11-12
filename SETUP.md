# Инструкция по настройке секретов и интеграций для сайта Алмаза Сабырова

Данное руководство пошагово и простым языком объясняет, как получить и настроить все ключи для Google Календаря, Telegram-бота и базы данных.

Все секреты указываются в файле `.env` на сервере (шаблон находится в файле `.env.example`). Ни один секрет не попадает в браузер клиентов.

---

## 1. Google Calendar API (OAuth 2.0 от личного аккаунта)

> **Почему OAuth 2.0 от личного аккаунта, а не сервисный аккаунт?**
> Сервисный аккаунт Google на бесплатном личном Gmail (@gmail.com) не имеет права приглашать внешних участников в события календаря. OAuth 2.0 действует от вашего имени, автоматически создает события, добавляет клиента в участники и генерирует рабочую ссылку Google Meet.

### Шаг 1.1: Создание проекта в Google Cloud Console
1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/).
2. В верхнем левом углу нажмите на выпадающий список проектов и нажмите **«New Project»** (Новый проект).
3. Назовите проект, например: `almaz-ai-calendar`, и нажмите **«Create»** (Создать).
4. Убедитесь, что в верхнем меню выбран созданный проект.

### Шаг 1.2: Включение Google Calendar API
1. В левом боковом меню перейдите в раздел **«APIs & Services»** → **«Library»** (Библиотека).
2. В строке поиска введите: `Google Calendar API`.
3. Нажмите на карточку **Google Calendar API** и нажмите кнопку **«Enable»** (Включить).

### Шаг 1.3: Настройка экрана согласия (OAuth consent screen)
1. В левом меню перейдите в **«APIs & Services»** → **«OAuth consent screen»**.
2. Выберите тип пользователя: **«External»** (Внешний) и нажмите **«Create»**.
3. Заполните обязательные поля:
   - **App name**: `Запись к Алмазу Сабырову`
   - **User support email**: ваш личный e-mail
   - **Developer contact information**: ваш личный e-mail
4. Нажмите **«Save and Continue»**.
5. На шаге **Scopes** нажмите **«Add or Remove Scopes»**, найдите и отметьте:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
6. Нажмите **«Update»**, затем **«Save and Continue»**.
7. **КРИТИЧЕСКИ ВАЖНЫЙ ШАГ (In production):**
   - На шаге **Test users** нажмите «Save and Continue» и вернитесь на главную страницу экрана согласия (*OAuth consent screen*).
   - В блоке **Publishing status** нажмите кнопку **«Publish App»** (Опубликовать приложение) и подтвердите перевод в статус **«In production»**.
   - *Почему это обязательно:* Если оставить приложение в статусе «Testing», Google автоматически аннулирует ваш `refresh_token` ровно через 7 дней, и онлайн-запись перестанет работать. В статусе «In production» токен работает бессрочно.

### Шаг 1.4: Создание OAuth Client ID и Client Secret
1. В левом меню перейдите в **«APIs & Services»** → **«Credentials»** (Учетные данные).
2. Нажмите вверху **«+ Create Credentials»** → **«OAuth client ID»**.
3. В поле **Application type** выберите **«Web application»**.
4. В поле **Name** укажите: `Almaz Calendar Server`.
5. В поле **Authorized redirect URIs** (Разрешенные URI перенаправления) нажмите **«+ Add URI»** и добавьте:
   - `https://developers.google.com/oauthplayground` (это официальная песочница Google, через которую мы получим refresh token за 1 минуту).
6. Нажмите **«Create»**.
7. Скопируйте появившиеся значения:
   - **Client ID** → запишите в `GOOGLE_CLIENT_ID`
   - **Client Secret** → запишите в `GOOGLE_CLIENT_SECRET`

### Шаг 1.5: Получение бессрочного `GOOGLE_REFRESH_TOKEN`
1. Откройте сервис [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
2. В правом верхнем углу нажмите на **значок шестеренки (OAuth 2.0 configuration)**.
3. Поставьте галочку **«Use your own OAuth credentials»**.
4. Вставьте ваши `OAuth Client ID` и `OAuth Client secret`, полученные на предыдущем шаге.
5. Закройте панель шестеренки.
6. В левой колонке (Step 1 «Select & authorize APIs») найдите раздел **Google Calendar API v3**:
   - Отметьте `https://www.googleapis.com/auth/calendar`
   - Отметьте `https://www.googleapis.com/auth/calendar.events`
7. Нажмите синюю кнопку **«Authorize APIs»**.
8. Выберите свой Google-аккаунт, на котором ведется рабочий календарь, и нажмите «Продолжить / Разрешить».
9. Вы автоматически вернетесь на страницу Playground к шагу **Step 2 «Exchange authorization code for tokens»**.
10. Нажмите синюю кнопку **«Exchange authorization code for tokens»**.
11. В поле **Refresh token** появится длинная строка (начинается с `1//...`).
12. Скопируйте ее — это ваш `GOOGLE_REFRESH_TOKEN`.

### Шаг 1.6: Идентификатор календаря (`CALENDAR_ID`)
- Для вашего основного календаря Google значением по умолчанию является `primary`.
- Если вы хотите вести записи в отдельном дополнительном календаре:
  1. Откройте [Google Calendar](https://calendar.google.com/).
  2. В настройках нужного календаря найдите пункт «Идентификатор календаря» (выглядит как `ваш_календарь@group.calendar.google.com`).
  3. Вставьте его в `CALENDAR_ID`.

---

## 2. Настройка Telegram-бота для мгновенных уведомлений

Бот мгновенно отправляет вам в личные сообщения все данные новой брони: выбранную услугу, дату, время (время Казахстана), имя клиента, компанию, телефон, e-mail и описание задачи.

### Шаг 2.1: Создание бота через @BotFather
1. Откройте Telegram и в поиске найдите официального бота: [@BotFather](https://t.me/BotFather) (с синей галочкой).
2. Отправьте команду: `/newbot`.
3. Укажите читаемое имя бота, например: `Алмаз Сабыров | Записи на консультацию`.
4. Укажите юзернейм бота на латинице, заканчивающийся на `bot`, например: `almaz_sabyrov_booking_bot`.
5. BotFather поздравит вас и пришлет длинный токен вида:
   `7123456789:AAFnk7v6_bQxY9KjZ2w3e4r5t6y7u8i9o0p`
6. Скопируйте этот токен в переменную `TELEGRAM_BOT_TOKEN`.

### Шаг 2.2: Получение вашего `TELEGRAM_CHAT_ID`
1. Найдите своего созданного бота в Telegram и обязательно нажмите кнопку **«Start»** (или отправьте `/start`), чтобы разрешить боту писать вам.
2. Чтобы узнать ваш персональный цифровой ID в Telegram:
   - Откройте бота [@userinfobot](https://t.me/userinfobot) в Telegram.
   - Он сразу ответит сообщением с вашим `Id` (например, `987654321`).
3. Скопируйте этот номер в переменную `TELEGRAM_CHAT_ID`.

---

## 3. Firebase Firestore (База данных)

База данных хранит все подтвержденные заявки, историю слотов и данные клиентов.

- **Правила безопасности (`firestore.rules`)**: в проекте уже настроен строгий запрет на чтение и запись с браузера клиентов (`allow read, write: if false;`).
- С базой работает исключительно сервер Node.js.
- Для подключения укажите в переменных окружения:
  ```env
  FIREBASE_PROJECT_ID="ваш-проект-firebase"
  ```
  Или укажите путь к файлу сервисного ключа:
  ```env
  GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
  ```
- *Примечание:* Если Firebase временно не подключен, сервер автоматически сохраняет все заявки в защищенную локальную память и продолжает корректно выдавать слоты и отправлять уведомления в Telegram и Google Календарь.

---

## 4. Сводный список переменных в `.env`

Создайте в корне проекта файл `.env` со следующим содержимым:

```env
PORT=3000

# Google Calendar
GOOGLE_CLIENT_ID="ваш_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="ваш_client_secret"
GOOGLE_REFRESH_TOKEN="1//ваш_refresh_token"
CALENDAR_ID="primary"

# Telegram Bot
TELEGRAM_BOT_TOKEN="ваш_токен_от_BotFather"
TELEGRAM_CHAT_ID="ваш_цифровой_chat_id"

# Firebase (опционально)
FIREBASE_PROJECT_ID="ваш_firebase_project_id"
```

После сохранения файла перезапустите сервер (`npm run dev`). Теперь онлайн-запись работает полностью в автоматическом режиме с проверкой занятости в Google Календаре и защитой от спама.
