from typing import TYPE_CHECKING

from sqlmodel import Field, SQLModel

if TYPE_CHECKING:
    pass


class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)

    username: str = Field(unique=True, index=True)
    hashed_password: bytes = Field(exclude=True)

    balance: float = Field(default=100)
