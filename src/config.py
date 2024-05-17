from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str
    ALEMBIC_DATABASE_URL: str

    REDIS_HOST: str
    REDIS_PORT: int
    CACHE_EXPIRE_SECONDS: int

    SECRET: str


settings = Config()
