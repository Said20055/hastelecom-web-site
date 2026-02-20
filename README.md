# Хас-Телеком MVP (Monorepo)

## Структура
```
apps/
  api/      # Django + DRF + JWT
  crm/      # Vite + React SPA
  landing/  # Vite landing
infra/
  nginx.conf
docker-compose.yml
```

## Запуск
```bash
docker compose up --build
```
Приложение доступно на `http://has-telecom.local`:
- Landing: `/`
- CRM: `/crm/`
- API: `/crm/api/`
- Admin: `/crm/admin/`

Если нужно сбросить БД volume и перезапустить с нуля:
```bash
docker compose down -v
docker compose up --build
```

## Миграции / статика / seed
```bash
docker compose exec api python manage.py migrate
docker compose exec api python manage.py collectstatic --noinput
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

## Debug checklist
- Проверка статики Django admin: `http://has-telecom.local/static/admin/css/base.css`
- Проверка SPA роутов CRM: `http://has-telecom.local/crm/dashboard`
- Проверка Public API: `http://has-telecom.local/crm/api/public/tariffs`
