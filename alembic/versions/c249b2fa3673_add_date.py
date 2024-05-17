"""add date

Revision ID: c249b2fa3673
Revises: edf2cd67ac0e
Create Date: 2024-05-16 16:55:55.249099

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel



# revision identifiers, used by Alembic.
revision: str = 'c249b2fa3673'
down_revision: Union[str, None] = 'edf2cd67ac0e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('transaction', sa.Column('date', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('transaction', 'date')
    # ### end Alembic commands ###
