# API de persistencia (Render + Postgres)

Backend FastAPI para guardar:
- Fase 1: eventos de conversión (`conversion_events`)
- Fase 2: leads con consentimiento explícito (`lead_submissions`, `consent_records`, `lead_access_log`)

Versión objetivo de Python: **3.12.x**.

## Desarrollo local

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Healthcheck: `http://localhost:8000/healthz`

## Variables de entorno

- `DATABASE_URL` (obligatoria)
- `CORS_ALLOWED_ORIGINS` (lista separada por comas)
- `RATE_LIMIT_PER_MINUTE` (por IP y endpoint)
- `LEAD_POLICY_VERSION` (ej. `v1.0`)
- `IP_HASH_SALT` (secreto, no exponer en frontend)
- `ADMIN_API_KEY` (protege endpoints de resumen/metrics)

## Endpoints

- `POST /v1/events/whatsapp-click`
- `POST /v1/leads`
- `GET /v1/events/summary`
- `GET /v1/metrics`
- `GET /healthz`

> Si defines `ADMIN_API_KEY`, debes enviar `x-admin-key` para consultar `/v1/events/summary` y `/v1/metrics`.
