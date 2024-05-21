from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status

from src.cache import Cache
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
async def transfer_naive(
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

    # Check if the cookie and query parameter match
    if not csrf_cookie or not csrf_query:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Missing CSRF token",
        )

    # Note that we do not compare given values to any server-side value,
    # making this protection mechanism weak
    if csrf_cookie != csrf_query:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tokens do not match",
        )

    data = TransactionCreate(
        recipient=recipient,
        amount=amount,
        description=description,
    )

    return await TransactionService.create(user, data)


@router.post(
    "/transfer/signed",
    response_model=TransactionRead,
)
async def transfer_signed(
    request: Request,
    recipient: str,
    amount: float,
    session: str,
    description: Optional[str] = None,
    user: User = Depends(valid_session),
):
    """
    This endpoint is using a signed cookie CSRF protection mechanism
    Prevents cookie replacement attacks
    """

    # We don't need any null checks here,
    # as the valid_session dependency will raise an exception if the session cookie is missing
    # Same goes for session query parameter, FastAPI will raise an exception if it's missing
    session_cookie = request.cookies.get("session")

    if session_cookie != session:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tokens do not match",
        )

    # Check if the server signed the cookie, effectively preventing cookie replacement attacks
    cookie = Cache.get(session)
    if not user.id == int(cookie.decode()):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid session token",
        )

    data = TransactionCreate(
        recipient=recipient,
        amount=amount,
        description=description,
    )

    return await TransactionService.create(user, data)
