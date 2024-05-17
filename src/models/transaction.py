from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import TIMESTAMP, Column, func
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class Transaction(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)

    sender_id: int = Field(foreign_key="user.id")
    sender: "User" = Relationship(
        sa_relationship_kwargs={
            "primaryjoin": "Transaction.sender_id == User.id",
            "lazy": "joined",
        }
    )

    receiver_id: int = Field(foreign_key="user.id")
    receiver: "User" = Relationship(
        sa_relationship_kwargs={
            "primaryjoin": "Transaction.receiver_id == User.id",
            "lazy": "joined",
        }
    )

    amount: float
    description: Optional[str] = None

    date: Optional[datetime] = Field(
        sa_column=Column(TIMESTAMP(timezone=True), server_default=func.now())
    )
