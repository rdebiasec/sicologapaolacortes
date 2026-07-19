from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, List, Optional

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class ConversionEvent(Base):
    __tablename__ = 'conversion_events'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    event_name: Mapped[str] = mapped_column(String(64), nullable=False, default='click_whatsapp')
    boton: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    source: Mapped[str] = mapped_column(String(128), nullable=False)
    path: Mapped[str] = mapped_column(String(255), nullable=False)
    referrer: Mapped[str] = mapped_column(String(255), nullable=False, default='')
    user_agent: Mapped[str] = mapped_column(String(255), nullable=False)
    ip_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    happened_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    metadata_json: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class ConsentRecord(Base):
    __tablename__ = 'consent_records'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    policy_version: Mapped[str] = mapped_column(String(32), nullable=False)
    consent_text: Mapped[str] = mapped_column(Text, nullable=False)
    consent_given: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    source: Mapped[str] = mapped_column(String(128), nullable=False)
    path: Mapped[str] = mapped_column(String(255), nullable=False)
    referrer: Mapped[str] = mapped_column(String(255), nullable=False, default='')
    user_agent: Mapped[str] = mapped_column(String(255), nullable=False)
    ip_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    happened_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    leads: Mapped[List['LeadSubmission']] = relationship(back_populates='consent_record')


class LeadSubmission(Base):
    __tablename__ = 'lead_submissions'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    consent_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('consent_records.id'), nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    contact_channel: Mapped[str] = mapped_column(String(24), nullable=False)
    contact_value: Mapped[str] = mapped_column(String(190), nullable=False)
    interest_channel: Mapped[str] = mapped_column(String(64), nullable=False)
    message_short: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    source: Mapped[str] = mapped_column(String(128), nullable=False)
    path: Mapped[str] = mapped_column(String(255), nullable=False)
    referrer: Mapped[str] = mapped_column(String(255), nullable=False, default='')
    user_agent: Mapped[str] = mapped_column(String(255), nullable=False)
    ip_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    consent_record: Mapped[ConsentRecord] = relationship(back_populates='leads')
    access_logs: Mapped[List['LeadAccessLog']] = relationship(back_populates='lead')


class LeadAccessLog(Base):
    __tablename__ = 'lead_access_log'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    lead_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('lead_submissions.id'), nullable=False, index=True)
    action: Mapped[str] = mapped_column(String(48), nullable=False)
    actor: Mapped[str] = mapped_column(String(64), nullable=False)
    details_json: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    lead: Mapped[LeadSubmission] = relationship(back_populates='access_logs')
