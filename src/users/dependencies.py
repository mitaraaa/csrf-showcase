from fastapi import Cookie, HTTPException, status

from src.cache import Cache
from src.models.user import User
from src.users.service import UserService


async def valid_session(session: str = Cookie(alias="session")) -> User:
    """
    Check if the session exists in the cache and return the user,
    otherwise raise an Unauthorized exception
    """
    user_id: bytes = Cache.get(session)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session",
        )

    user = await UserService.get_by_id(int(user_id.decode()))
    return user
