import json

from fastapi import APIRouter, Cookie, Depends, Response, status
from fastapi.responses import JSONResponse

from src.cache import Cache
from src.config import settings
from src.models.user import User
from src.users.dependencies import valid_session
from src.users.schemas import UserCreate, UserRead
from src.users.service import UserService

router = APIRouter()


def set_cookie(response: Response, user: User):
    """
    Set the session cookie in the response, and store the cookie:user_id pair in the cache
    """

    cookie = UserService.generate_cookie(user)
    Cache.set(
        cookie,
        user.id,
        settings.CACHE_EXPIRE_SECONDS,
    )

    response.set_cookie(
        key="session",
        value=cookie,
        max_age=settings.CACHE_EXPIRE_SECONDS,
        samesite="none",
        secure=True,
    )


@router.get(
    "/me",
    response_model=UserRead,
)
async def me(user: User = Depends(valid_session)):
    return await UserService.read_by_id(user.id)


@router.get(
    "/exists",
)
async def user_exists(username: str):
    return {"exists": await UserService.exists(username)}


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=UserRead,
)
async def register(data: UserCreate):
    user = await UserService.register(data)
    dump = json.loads(user.model_dump_json())

    response = JSONResponse(dump)

    set_cookie(response, user)

    return response


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    response_model=UserRead,
)
async def login(data: UserCreate):
    user = await UserService.authenticate(data)
    dump = json.loads(user.model_dump_json())

    response = JSONResponse(dump)

    set_cookie(response, user)

    return response


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(valid_session)],
)
async def logout(session: str = Cookie(alias="session")):
    Cache.delete(session)

    response = JSONResponse(
        content={"message": "Logged out"},
    )
    response.delete_cookie(key="session")

    return response
