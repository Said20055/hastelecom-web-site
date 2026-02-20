FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/api /app
RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]
