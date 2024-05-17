import base64
import hashlib
import hmac
import random
import string

import bcrypt
from fastapi import status
from fastapi.exceptions import HTTPException
from sqlmodel import or_, select

from src.config import settings
from src.database import get_session
from src.models import Transaction, User
from src.transactions.utils import build_transaction
from src.users.schemas import UserCreate, UserRead


class UserService:
    @staticmethod
    async def get_by_id(user_id: int) -> User:
        async with get_session() as session:
            stmt = select(User).where(User.id == user_id)
            user = await session.scalar(stmt)

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )

            return user

    @staticmethod
    async def read_by_id(user_id: int) -> UserRead:
        async with get_session() as session:
            user = await UserService.get_by_id(user_id)

            stmt = select(Transaction).where(
                or_(
                    Transaction.sender_id == user.id, Transaction.receiver_id == user.id
                )
            )
            fetched = await session.scalars(stmt)
            transactions = fetched.all()

            return UserRead(
                id=user.id,
                username=user.username,
                balance=user.balance,
                transactions_count=len(transactions),
                transactions=[build_transaction(t) for t in transactions],
            )

    @staticmethod
    async def get_by_username(username: str) -> User:
        async with get_session() as session:
            stmt = select(User).where(User.username == username)
            user = await session.scalar(stmt)

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )

            return user

    @staticmethod
    async def exists(username: str) -> bool:
        async with get_session() as session:
            stmt = select(User).where(User.username == username)
            user = await session.scalar(stmt)

            return user is not None

    @staticmethod
    async def register(data: UserCreate) -> UserRead:
        async with get_session() as session:
            user = User(
                username=data.username,
                hashed_password=UserService.hash_password(data.password),
            )

            session.add(user)
            await session.commit()

            await session.refresh(user)
            return await UserService.read_by_id(user.id)

    @staticmethod
    async def authenticate(data: UserCreate) -> UserRead:
        async with get_session() as session:
            stmt = select(User).where(User.username == data.username)
            user = await session.scalar(stmt)

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )

            if not bcrypt.checkpw(data.password.encode(), user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password"
                )

            return await UserService.read_by_id(user.id)

    @staticmethod
    def hash_password(password: str) -> bytes:
        return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    @staticmethod
    def generate_cookie(user: User) -> str:
        random_value = "".join(
            random.SystemRandom().choice(string.ascii_uppercase + string.digits)
            for _ in range(8)
        )
        message = f"{user.id}:{random_value}".encode()

        digest = hmac.new(
            settings.SECRET.encode(),
            message,
            digestmod=hashlib.sha256,
        ).digest()

        return base64.b64encode(digest).decode()
