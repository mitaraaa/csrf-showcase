from redis import Redis

from src.config import settings

cache = Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)


class Cache:
    @staticmethod
    def get(key: str) -> str:
        return cache.get(key)

    @staticmethod
    def set(key: str, value: str, expire: int) -> None:
        cache.set(key, value, expire)

    @staticmethod
    def delete(key: str) -> None:
        cache.delete(key)
