# Хас-Телеком MVP Monorepo

Production-ready стартовый монорепозиторий с двумя Next.js приложениями под одним доменом:
- `has-telecom.ru/` → Landing
- `has-telecom.ru/crm` → CRM (basePath `/crm`)

## Стек
- Next.js 14 (App Router) + TypeScript
- PostgreSQL + Prisma
- TailwindCSS (UI skeleton/shadcn-style primitives)
- JWT auth (Access + Refresh cookie)
- Nginx reverse proxy
- Docker Compose

## Структура
```
apps/
  landing/
  crm/
packages/
  db/
  ui/
infra/
  nginx.conf
```

## Быстрый старт
1. Скопируйте env-шаблоны:
   - `cp .env.example .env`
   - `cp apps/crm/.env.example apps/crm/.env`
   - `cp apps/landing/.env.example apps/landing/.env`
2. Запуск:
```bash
docker compose up --build
```
3. Применить миграции и сиды (локально или в node-контейнере):
```bash
npm install
npm run db:migrate
npm run db:seed
```

## Дефолтные аккаунты
- `operator@has.local / Operator123!`
- `tech@has.local / Tech123!`

## Основные API
### Auth
- `POST /crm/api/auth/register`
- `POST /crm/api/auth/login`
- `POST /crm/api/auth/refresh`
- `POST /crm/api/auth/logout`

### Users
- `GET /crm/api/users` (operator)

### Tickets
- `POST /crm/api/tickets`
- `GET /crm/api/tickets`
- `GET /crm/api/tickets/:id`
- `PATCH /crm/api/tickets/:id`
- `POST /crm/api/tickets/:id/comments`

### Public
- `GET /crm/api/public/tariffs`
- `GET /crm/api/public/announcements`
- `POST /crm/api/public/tickets`

## Примечания
- Пароли хешируются через `bcrypt`.
- Access token передаётся в `Authorization: Bearer`.
- Refresh token хранится в `httpOnly` cookie.
- Для публичных endpoint включён in-memory rate-limit по IP.
