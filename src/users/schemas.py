from pydantic import BaseModel

from src.transactions.schemas import TransactionRead


class UserCreate(BaseModel):
    username: str
    password: str


class UserRead(BaseModel):
    id: int

    username: str
    balance: float

    transactions_count: int
    transactions: list[TransactionRead]
