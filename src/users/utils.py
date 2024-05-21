from src.users.schemas import UserRead, UserReadWithSession


def build_with_session(user: UserRead, session: str) -> UserReadWithSession:
    return UserReadWithSession(
        id=user.id,
        username=user.username,
        balance=user.balance,
        transactions_count=user.transactions_count,
        transactions=user.transactions,
        session=session,
    )
