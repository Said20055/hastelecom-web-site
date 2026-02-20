# Хас-Телеком MVP (Monorepo)

## Структура
```
apps/
  api/      # Django + DRF
  crm/      # React/Vite SPA
  landing/  # React/Vite landing
infra/
  nginx.conf
docker-compose.yml
```

## Запуск
```bash
docker compose up --build
```
> API ждёт готовность Postgres перед миграциями и стартом приложения (устранён race condition первого запуска).
Приложение доступно на `http://has-telecom.local`:
- Landing: `/`
- CRM: `/crm/`
- API: `/crm/api/`
- Admin: `/crm/admin/`

## Миграции
```bash
docker compose exec api python manage.py migrate
```

## Seed
```bash
docker compose exec api python manage.py seed
```

## Дефолтные аккаунты
- `operator@has.local / Operator123!`
- `tech@has.local / Tech123!`

## Тесты
Backend:
```bash
docker compose exec api pytest
```
CRM:
```bash
docker compose exec crm npm run test
```
