# User Segments Management System

> Сервис для управления пользовательскими сегментами и проведения экспериментов

## Описание проекта

Этот проект представляет собой полнофункциональный сервис для управления пользовательскими сегментами, разработанный для
аналитиков VK. Система позволяет создавать, управлять и распределять сегменты среди пользователей.

### Основные возможности

- **Управление сегментами**: создание, редактирование и удаление сегментов
- **Управление пользователями**: добавление и удаление пользователей в/из сегментов
- **Случайное распределение**: автоматическое распределение сегментов на заданный процент пользователей
- **API для получения данных**: получение списка сегментов для конкретного пользователя
- **Web-интерфейс**: удобный интерфейс для аналитиков
- **Контейнеризация**: полная настройка через Docker Compose

## Архитектура

### Backend (Python/FastAPI)

```
backend/
├── main.py                 # Основное FastAPI приложение
├── config.py              # Конфигурация приложения
├── db_helper.py           # Подключение к БД
├── models/                # SQLAlchemy модели
│   ├── base.py           # Базовый класс
│   ├── table_user.py     # Модель пользователя
│   ├── table_segment.py  # Модель сегмента
│   └── user_segment.py   # Связующая таблица
├── schemes/              # Pydantic схемы
│   ├── user.py          # Схемы пользователей
│   ├── segment.py       # Схемы сегментов
│   └── utils.py         # Вспомогательные схемы
├── api/                 # API endpoints
│   ├── user/           # CRUD для пользователей
│   │   ├── crud.py     # Операции с БД
│   │   ├── dependencies.py # Зависимости
│   │   └── views.py    # HTTP endpoints
│   └── segment/        # CRUD для сегментов
│       ├── crud.py
│       ├── dependencies.py
│       └── views.py
└── utils/              # Утилиты
    └── distribute_segment.py # Случайное распределение
```

### Frontend (React)

```
frontend/
├── src/
│   ├── App.jsx                    # Главный компонент
│   ├── index.css                 # Стили
│   ├── components/               # React компоненты
│   │   ├── SegmentForm.jsx      # Создание сегментов
│   │   ├── SegmentManager.jsx   # Управление сегментами
│   │   ├── UserForm.jsx         # Создание пользователей
│   │   └── UserSegments.jsx     # Управление пользователями
│   └── services/
│       └── api.js               # API клиент
└── package.json
```

### База данных (PostgreSQL)

- **users**: информация о пользователях
- **segments**: информация о сегментах
- **user_segment_association**: связи many-to-many между пользователями и сегментами

## Установка и запуск

### Предварительные требования

- Docker и Docker Compose
- Git

### Быстрый старт

1. **Клонирование репозитория**

```bash
git clone https://github.com/Zattox/vk-segments-service.git
cd vk-segments-system
```

2. **Создание .env файла**

```bash
# backend/.env
DATABASE_URL=postgresql://user:password@db:5432/segments_db
```

3. **Запуск всех сервисов**

```bash
docker compose up --build
```

4. **Проверка работы**

- Backend API: http://localhost:8000/api/docs
- Frontend: http://localhost:3000
- Health Check: http://localhost:8000/api/health

## Технологии

### Backend

- **FastAPI** - современный веб-фреймворк для Python
- **SQLAlchemy** - ORM для работы с базой данных
- **Pydantic** - валидация данных и сериализация
- **PostgreSQL** - реляционная база данных
- **Alembic** - миграции базы данных

### Frontend

- **React** - библиотека для создания пользовательских интерфейсов
- **Axios** - HTTP клиент для API запросов
- **CSS3** - современная стилизация с Grid Layout

### DevOps

- **Docker** - контейнеризация приложений
- **Docker Compose** - оркестрация multi-container приложений
- **Nginx** - веб-сервер для frontend (в production)

