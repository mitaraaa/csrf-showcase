from fastapi import HTTPException, status

from src.database import get_session
from src.models.transaction import Transaction
from src.models.user import User
from src.transactions.schemas import TransactionCreate, TransactionRead
from src.transactions.utils import build_transaction
from src.users.service import UserService


class TransactionService:
    @staticmethod
    async def create(user: User, data: TransactionCreate) -> TransactionRead:
        async with get_session() as session:
            recipient = await UserService.get_by_username(data.recipient)

            if recipient.id == user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot transfer funds to yourself",
                )

            if user.balance < data.amount:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Insufficient funds",
                )

            user.balance -= data.amount
            recipient.balance += data.amount

            transaction = Transaction(
                sender_id=user.id,
                receiver_id=recipient.id,
                amount=data.amount,
                description=data.description,
            )

            session.add(transaction)
            session.add(user)
            session.add(recipient)

            await session.commit()

            await session.refresh(transaction)
            return build_transaction(transaction)
