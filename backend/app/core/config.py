from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "stock location"
    SAGE_API_URL: str
    SAGE_API_USER: str
    SAGE_API_PASSWORD: str

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
