from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status

from src.models.user import User
from src.transactions.schemas import TransactionCreate, TransactionRead
from src.transactions.service import TransactionService
from src.users.dependencies import valid_session

router = APIRouter()


@router.post(
    "/transfer/unsafe",
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


@router.post(
    "/transfer/naive",
    response_model=TransactionRead,
)
async def transfer_safe(
    request: Request,
    recipient: str,
    amount: float,
    description: Optional[str] = None,
    user: User = Depends(valid_session),
):
    """
    This endpoint is using a naive double submit cookie CSRF protection mechanism
    This is still vulnerable to MITM attacks
    """
    csrf_cookie = request.cookies.get("csrf")
    csrf_query = request.query_params.get("csrf")

    if not csrf_cookie or not csrf_query or csrf_cookie != csrf_query:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Missing CSRF token",
        )

    data = TransactionCreate(
        recipient=recipient,
        amount=amount,
        description=description,
    )

    return await TransactionService.create(user, data)
