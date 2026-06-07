from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "FastAPI Shop"
    debug: bool = True
    database_url: str = "sqlite:///./shop.db"
    cors_origins: list[str] = [
        "http://localhost:5175",
        "http://localhost:3002",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:3002",
    ]
    static_dir: str = "static"
    images_dir: str = "static/images"

    class Config:
        env_file = ".env"


settings = Settings()
