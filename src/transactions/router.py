from typing import Optional

from fastapi import APIRouter, Depends

from src.models.user import User
from src.transactions.schemas import TransactionCreate, TransactionRead
from src.transactions.service import TransactionService
from src.users.dependencies import valid_session

router = APIRouter()


@router.post(
    "/transfer",
    response_model=TransactionRead,
)
async def transfer(
    recipient: str,
    amount: float,
    description: Optional[str] = None,
    user: User = Depends(valid_session),
):
    """
    CSRF vulnerable endpoint, transfers money from the user to the recipient
    """
    data = TransactionCreate(
        recipient=recipient,
        amount=amount,
        description=description,
    )

    return await TransactionService.create(user, data)
