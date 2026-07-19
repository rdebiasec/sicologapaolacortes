from __future__ import annotations

from pathlib import Path

from alembic import command
from alembic.config import Config

from app.db import normalize_database_url


def upgrade_to_head(database_url: str) -> None:
    root = Path(__file__).resolve().parents[1]
    cfg = Config(str(root / 'alembic.ini'))
    cfg.set_main_option('script_location', str(root / 'alembic'))
    cfg.set_main_option('sqlalchemy.url', normalize_database_url(database_url))
    command.upgrade(cfg, 'head')
