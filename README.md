# Booking App

[![CI](https://github.com/adambereg/booking-app/actions/workflows/ci.yml/badge.svg)](https://github.com/adambereg/booking-app/actions/workflows/ci.yml)
[![GitHub license](https://img.shields.io/github/license/adambereg/booking-app)](https://github.com/adambereg/booking-app/blob/main/LICENSE)

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

- React 18
- Vite 5
- Tailwind CSS 3
- Supabase
- Date-fns
- React Router 6
- Heroicons

## Требования

- Node.js 18.x или выше
- npm 9.x или выше

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/adambereg/booking-app.git
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

## Скрипты

- `npm run dev` - Запуск сервера разработки
- `npm run build` - Сборка проекта
- `npm run preview` - Предварительный просмотр сборки
- `npm run lint` - Проверка кода линтером

## Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для вашей функциональности (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add some amazing feature'`)
4. Отправьте изменения в ваш форк (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## Лицензия

MIT 