from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Literal, Optional

from pydantic import BaseModel, Field, field_validator, model_validator


WHATSAPP_BUTTONS = {
    'hero',
    'navbar',
    'es_para_mi',
    'primera_sesion',
    'urgencias',
    'contacto',
    'flotante',
    'pagina_404',
}

LEAD_INTEREST_CHANNELS = {
    'individual',
    'pareja',
    'familia',
    'duelo',
    'ansiedad',
    'depresion',
    'urgencia',
    'general',
}


def now_utc() -> datetime:
    return datetime.now(tz=timezone.utc)


def compact_text(value: str, max_len: int) -> str:
    return ' '.join(value.split())[:max_len]


class EventPayload(BaseModel):
    eventName: str = Field(default='click_whatsapp', max_length=64)
    boton: str = Field(min_length=2, max_length=64)
    happenedAt: datetime = Field(default_factory=now_utc)
    source: str = Field(default='desconocido', max_length=128)
    path: str = Field(default='/', max_length=255)
    referrer: str = Field(default='', max_length=255)
    userAgent: str = Field(default='desconocido', max_length=255)
    metadata: Optional[Dict[str, Any]] = None

    @field_validator('boton')
    @classmethod
    def validate_boton(cls, value: str) -> str:
        cleaned = compact_text(value, 64)
        if cleaned not in WHATSAPP_BUTTONS:
            raise ValueError('Botón de WhatsApp no permitido.')
        return cleaned

    @field_validator('source', 'path', 'referrer', 'userAgent', mode='before')
    @classmethod
    def sanitize_text_fields(cls, value: str) -> str:
        return compact_text(str(value or ''), 255)


class LeadPayload(BaseModel):
    name: Optional[str] = Field(default=None, max_length=120)
    contactChannel: Literal['whatsapp', 'email', 'phone']
    contactValue: str = Field(min_length=3, max_length=190)
    interestChannel: str = Field(default='general', max_length=64)
    messageShort: Optional[str] = Field(default=None, max_length=500)
    consentGiven: bool
    policyVersion: str = Field(default='v1.0', max_length=32)
    consentText: str = Field(min_length=12, max_length=500)
    happenedAt: datetime = Field(default_factory=now_utc)
    source: str = Field(default='desconocido', max_length=128)
    path: str = Field(default='/', max_length=255)
    referrer: str = Field(default='', max_length=255)
    userAgent: str = Field(default='desconocido', max_length=255)

    @field_validator('name', 'messageShort', mode='before')
    @classmethod
    def sanitize_optional_fields(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        cleaned = compact_text(str(value), 500)
        return cleaned or None

    @field_validator('contactValue', mode='before')
    @classmethod
    def sanitize_contact_value(cls, value: str) -> str:
        return compact_text(str(value or ''), 190)

    @field_validator('interestChannel')
    @classmethod
    def validate_interest_channel(cls, value: str) -> str:
        cleaned = compact_text(value, 64).lower()
        if cleaned not in LEAD_INTEREST_CHANNELS:
            return 'general'
        return cleaned

    @field_validator('source', 'path', 'referrer', 'userAgent', 'policyVersion', 'consentText', mode='before')
    @classmethod
    def sanitize_text(cls, value: str) -> str:
        return compact_text(str(value or ''), 500)

    @model_validator(mode='after')
    def validate_consent(self) -> 'LeadPayload':
        if not self.consentGiven:
            raise ValueError('No podemos guardar tu solicitud sin consentimiento explícito.')
        return self


class ApiOkResponse(BaseModel):
    ok: bool = True


class LeadCreatedResponse(ApiOkResponse):
    leadId: str
