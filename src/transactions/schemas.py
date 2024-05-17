from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TransactionCreate(BaseModel):
    amount: float
    recipient: str
    description: Optional[str]


class TransactionRead(BaseModel):
    id: int

    sender: str
    recipient: str

    amount: float
    description: Optional[str]

    date: datetime
