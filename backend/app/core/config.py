from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "stock location"
    version: str = "1.0.0"
    SAGE_API_URL_STOCK: str
    SAGE_API_USER: str
    SAGE_API_PASSWORD: str
    DATABASE_URL: str
    SAGE_API_URL_MAT: str
    SAGE_API_URL_STOALL: str

    # authentication settings
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
