# Booking App

Веб-приложение для бронирования жилья, созданное с использованием React, Vite, Tailwind CSS и Supabase.

## Функциональность

- Поиск и фильтрация жилья
- Система бронирования с календарём
- Профили пользователей
- Панель управления для владельцев жилья
- Система отзывов и рейтингов
- Списки желаний
- Уведомления
- Чат между гостями и хозяевами

## Технологии

- React
- Vite
- Tailwind CSS
- Supabase
- Date-fns
- React Router
- Heroicons

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/booking-app.git
```

2. Установите зависимости:
```bash
cd booking-app
npm install
```

3. Создайте файл `.env` и добавьте необходимые переменные окружения:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Запустите проект:
```bash
npm run dev
```

## Структура проекта

```
src/
  ├── components/     # Переиспользуемые компоненты
  ├── contexts/      # React контексты
  ├── layouts/       # Компоненты макетов
  ├── pages/         # Компоненты страниц
  ├── App.jsx        # Корневой компонент
  ├── main.jsx      # Точка входа
  └── index.css      # Глобальные стили
```

## Лицензия

MIT 