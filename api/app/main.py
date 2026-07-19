from __future__ import annotations

import logging
import time
from datetime import datetime, timezone
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.db import get_db
from app.migrations import upgrade_to_head
from app.models import ConsentRecord, ConversionEvent, LeadAccessLog, LeadSubmission
from app.rate_limit import InMemoryRateLimiter
from app.schemas import ApiOkResponse, EventPayload, LeadCreatedResponse, LeadPayload
from app.security import client_ip, hash_ip, normalized_header

settings = get_settings()
logger = logging.getLogger('paola-cortes-api')
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s %(message)s',
)

BOOT_AT = time.time()
REQUEST_COUNTERS: dict[str, int] = {'events': 0, 'leads': 0}
limiter = InMemoryRateLimiter(max_requests=settings.rate_limit_per_minute, per_seconds=60)


def create_app() -> FastAPI:
    app = FastAPI(title='Paola Cortes Data API', version='1.0.0')

    origins = settings.allowed_origins()
    if origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_methods=['POST', 'GET', 'OPTIONS'],
            allow_headers=['content-type', 'x-admin-key'],
            allow_credentials=False,
        )
    else:
        logger.warning('No CORS origins configured. API will reject browser cross-origin calls.')

    @app.on_event('startup')
    def on_startup() -> None:
        logger.info('Starting %s in %s mode', settings.app_name, settings.app_env)
        if not settings.database_url:
            raise RuntimeError('DATABASE_URL is required for API startup.')
        upgrade_to_head(settings.database_url)
        logger.info('Database migrations applied.')

    @app.middleware('http')
    async def access_log_middleware(request: Request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            'request method=%s path=%s status=%s elapsed_ms=%.2f ip=%s',
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
            client_ip(request),
        )
        return response

    @app.get('/healthz')
    def healthz() -> dict[str, Any]:
        return {
            'ok': True,
            'service': settings.app_name,
            'environment': settings.app_env,
            'uptime_seconds': round(time.time() - BOOT_AT, 2),
            'now': datetime.now(tz=timezone.utc).isoformat(),
        }

    def require_admin_key(request: Request) -> None:
        if not settings.admin_api_key:
            return
        submitted = request.headers.get('x-admin-key', '')
        if submitted != settings.admin_api_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Missing or invalid admin API key.',
            )

    @app.get('/v1/metrics')
    def metrics(_: None = Depends(require_admin_key)) -> dict[str, Any]:
        return {
            'ok': True,
            'counters': REQUEST_COUNTERS,
            'rate_limit_per_minute': settings.rate_limit_per_minute,
            'allowed_origins': settings.allowed_origins(),
        }

    @app.get('/v1/events/summary')
    def events_summary(
        db: Session = Depends(get_db), _: None = Depends(require_admin_key)
    ) -> dict[str, Any]:
        rows = db.execute(
            select(ConversionEvent.boton, func.count(ConversionEvent.id)).group_by(ConversionEvent.boton)
        ).all()
        return {'ok': True, 'items': [{'boton': boton, 'count': count} for boton, count in rows]}

    def enforce_rate_limit(request: Request) -> None:
        rate_key = f'{client_ip(request)}:{request.url.path}'
        if not limiter.allow(rate_key):
            logger.warning('rate_limit_blocked key=%s', rate_key)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail='Demasiadas solicitudes. Intenta de nuevo en un minuto.',
            )

    @app.post('/v1/events/whatsapp-click', response_model=ApiOkResponse)
    def create_whatsapp_event(
        payload: EventPayload,
        request: Request,
        db: Session = Depends(get_db),
        _: None = Depends(enforce_rate_limit),
    ) -> ApiOkResponse:
        ip = client_ip(request)
        row = ConversionEvent(
            event_name=payload.eventName,
            boton=payload.boton,
            source=payload.source or request.headers.get('origin') or 'desconocido',
            path=payload.path or request.url.path,
            referrer=payload.referrer or normalized_header(request.headers.get('referer', ''), 255),
            user_agent=payload.userAgent or normalized_header(request.headers.get('user-agent', ''), 255),
            ip_hash=hash_ip(ip, settings.ip_hash_salt),
            happened_at=payload.happenedAt,
            metadata_json=payload.metadata,
        )
        try:
            db.add(row)
            db.commit()
            REQUEST_COUNTERS['events'] += 1
        except SQLAlchemyError as exc:
            logger.exception('events_insert_failed: %s', exc)
            db.rollback()
            raise HTTPException(status_code=500, detail='No fue posible guardar el evento.') from exc
        return ApiOkResponse()

    @app.post('/v1/leads', response_model=LeadCreatedResponse)
    def create_lead(
        payload: LeadPayload,
        request: Request,
        db: Session = Depends(get_db),
        _: None = Depends(enforce_rate_limit),
    ) -> LeadCreatedResponse:
        ip = client_ip(request)
        ip_digest = hash_ip(ip, settings.ip_hash_salt)

        consent = ConsentRecord(
            policy_version=payload.policyVersion or settings.lead_policy_version,
            consent_text=payload.consentText,
            consent_given=payload.consentGiven,
            source=payload.source or request.headers.get('origin') or 'desconocido',
            path=payload.path or request.url.path,
            referrer=payload.referrer or normalized_header(request.headers.get('referer', ''), 255),
            user_agent=payload.userAgent or normalized_header(request.headers.get('user-agent', ''), 255),
            ip_hash=ip_digest,
            happened_at=payload.happenedAt,
        )
        lead = LeadSubmission(
            consent_record=consent,
            name=payload.name,
            contact_channel=payload.contactChannel,
            contact_value=payload.contactValue,
            interest_channel=payload.interestChannel,
            message_short=payload.messageShort,
            source=payload.source or request.headers.get('origin') or 'desconocido',
            path=payload.path or request.url.path,
            referrer=payload.referrer or normalized_header(request.headers.get('referer', ''), 255),
            user_agent=payload.userAgent or normalized_header(request.headers.get('user-agent', ''), 255),
            ip_hash=ip_digest,
        )
        access_log = LeadAccessLog(
            lead=lead,
            action='created',
            actor='public-api',
            details_json={'source': 'frontend_form'},
        )
        try:
            db.add(consent)
            db.add(lead)
            db.add(access_log)
            db.commit()
            REQUEST_COUNTERS['leads'] += 1
            db.refresh(lead)
        except SQLAlchemyError as exc:
            logger.exception('lead_insert_failed: %s', exc)
            db.rollback()
            raise HTTPException(status_code=500, detail='No fue posible guardar la solicitud.') from exc

        return LeadCreatedResponse(ok=True, leadId=str(lead.id))

    return app


app = create_app()
