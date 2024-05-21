import json

from fastapi import APIRouter, Cookie, Depends, Request, Response, status
from fastapi.responses import JSONResponse

from src.cache import Cache
from src.config import settings
from src.models.user import User
from src.users.dependencies import valid_session
from src.users.schemas import UserCreate, UserReadWithSession
from src.users.service import UserService
from src.users.utils import build_with_session

router = APIRouter()


def set_cookie(response: Response, user: User, cookie: str):
    """
    Set the session cookie in the response, and store the cookie:user_id pair in the cache
    """
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


@router.get("/me", response_model=UserReadWithSession)
async def me(request: Request, user: User = Depends(valid_session)):
    session_cookie = request.cookies.get("session")
    user = await UserService.read_by_id(user.id)

    return build_with_session(user, session_cookie)


@router.get(
    "/exists",
    status_code=status.HTTP_200_OK,
)
async def user_exists(username: str):
    return {"exists": await UserService.exists(username)}


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=UserReadWithSession,
)
async def register(data: UserCreate):
    user = await UserService.register(data)
    cookie = UserService.generate_cookie(user)

    with_session = build_with_session(user, cookie)
    dump = json.loads(with_session.model_dump_json())

    response = JSONResponse(dump)
    set_cookie(response, user, cookie)

    return response


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    response_model=UserReadWithSession,
)
async def login(data: UserCreate):
    user = await UserService.authenticate(data)
    cookie = UserService.generate_cookie(user)

    with_session = build_with_session(user, cookie)
    dump = json.loads(with_session.model_dump_json())

    response = JSONResponse(dump)
    set_cookie(response, user, cookie)

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
