from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings


def normalize_database_url(raw_url: str) -> str:
    url = raw_url.strip()
    if url.startswith('postgres://'):
        return url.replace('postgres://', 'postgresql+psycopg://', 1)
    if url.startswith('postgresql://'):
        return url.replace('postgresql://', 'postgresql+psycopg://', 1)
    return url


settings = get_settings()
DATABASE_URL = normalize_database_url(settings.database_url) if settings.database_url else ''

engine = create_engine(DATABASE_URL, future=True, pool_pre_ping=True) if DATABASE_URL else None
SessionLocal = (
    sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False) if engine else None
)


def get_db() -> Generator[Session, None, None]:
    if SessionLocal is None:
        raise RuntimeError('DATABASE_URL is required to use the API data endpoints.')
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
