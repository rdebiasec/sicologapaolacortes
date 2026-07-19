"""Create lead and consent tables.

Revision ID: 0002_leads_and_consent
Revises: 0001_conversion_events
Create Date: 2026-07-19
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0002_leads_and_consent'
down_revision = '0001_conversion_events'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'consent_records',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('policy_version', sa.String(length=32), nullable=False),
        sa.Column('consent_text', sa.Text(), nullable=False),
        sa.Column('consent_given', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('source', sa.String(length=128), nullable=False),
        sa.Column('path', sa.String(length=255), nullable=False),
        sa.Column('referrer', sa.String(length=255), nullable=False, server_default=''),
        sa.Column('user_agent', sa.String(length=255), nullable=False),
        sa.Column('ip_hash', sa.String(length=64), nullable=False),
        sa.Column('happened_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )

    op.create_table(
        'lead_submissions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('consent_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=True),
        sa.Column('contact_channel', sa.String(length=24), nullable=False),
        sa.Column('contact_value', sa.String(length=190), nullable=False),
        sa.Column('interest_channel', sa.String(length=64), nullable=False),
        sa.Column('message_short', sa.String(length=500), nullable=True),
        sa.Column('source', sa.String(length=128), nullable=False),
        sa.Column('path', sa.String(length=255), nullable=False),
        sa.Column('referrer', sa.String(length=255), nullable=False, server_default=''),
        sa.Column('user_agent', sa.String(length=255), nullable=False),
        sa.Column('ip_hash', sa.String(length=64), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['consent_id'], ['consent_records.id'], ondelete='RESTRICT'),
    )
    op.create_index('ix_lead_submissions_created_at', 'lead_submissions', ['created_at'], unique=False)

    op.create_table(
        'lead_access_log',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('lead_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('action', sa.String(length=48), nullable=False),
        sa.Column('actor', sa.String(length=64), nullable=False),
        sa.Column('details_json', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['lead_id'], ['lead_submissions.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_lead_access_log_lead_id', 'lead_access_log', ['lead_id'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_lead_access_log_lead_id', table_name='lead_access_log')
    op.drop_table('lead_access_log')
    op.drop_index('ix_lead_submissions_created_at', table_name='lead_submissions')
    op.drop_table('lead_submissions')
    op.drop_table('consent_records')
