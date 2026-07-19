"""Create conversion_events table.

Revision ID: 0001_conversion_events
Revises:
Create Date: 2026-07-19
"""

from __future__ import annotations

from typing import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0001_conversion_events'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'conversion_events',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('event_name', sa.String(length=64), nullable=False, server_default='click_whatsapp'),
        sa.Column('boton', sa.String(length=64), nullable=False),
        sa.Column('source', sa.String(length=128), nullable=False),
        sa.Column('path', sa.String(length=255), nullable=False),
        sa.Column('referrer', sa.String(length=255), nullable=False, server_default=''),
        sa.Column('user_agent', sa.String(length=255), nullable=False),
        sa.Column('ip_hash', sa.String(length=64), nullable=False),
        sa.Column('happened_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('metadata_json', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('ix_conversion_events_boton', 'conversion_events', ['boton'], unique=False)
    op.create_index('ix_conversion_events_happened_at', 'conversion_events', ['happened_at'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_conversion_events_happened_at', table_name='conversion_events')
    op.drop_index('ix_conversion_events_boton', table_name='conversion_events')
    op.drop_table('conversion_events')
