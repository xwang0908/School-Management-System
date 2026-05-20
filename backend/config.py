from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str
    openai_api_key: str
    openai_model: str = "gpt-4o-mini"
    database_url: str = "sqlite:///./school_grading.db"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    class Config:
        env_file = ".env"


settings = Settings()
