#!/bin/sh
set -eu

python - <<'PY'
import os
import time
from urllib.parse import urlparse
import psycopg2

url = os.getenv('DATABASE_URL', 'postgresql://hastelecom:hastelecom_pass@postgres:5432/hastelecom')
parsed = urlparse(url)
if parsed.scheme.startswith('sqlite'):
    raise SystemExit(0)

max_attempts = int(os.getenv('DB_WAIT_ATTEMPTS', '40'))
wait_seconds = float(os.getenv('DB_WAIT_INTERVAL', '1.5'))

for attempt in range(1, max_attempts + 1):
    try:
        conn = psycopg2.connect(
            dbname=parsed.path.lstrip('/'),
            user=parsed.username,
            password=parsed.password,
            host=parsed.hostname,
            port=parsed.port or 5432,
        )
        conn.close()
        print('Database is available')
        break
    except Exception as exc:
        if attempt == max_attempts:
            raise SystemExit(f'Cannot connect to database after {max_attempts} attempts: {exc}')
        print(f'Waiting for database ({attempt}/{max_attempts}): {exc}')
        time.sleep(wait_seconds)
PY

python manage.py migrate --noinput
python manage.py runserver 0.0.0.0:8000
