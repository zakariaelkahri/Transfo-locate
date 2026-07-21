from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "stock location"

    DATABASE_URL: str
    SAGE_API_URL: str = "http://192.168.10.100:8124/api1/x3/erp/ENERGY/STOCK"
    SAGE_API_USER: str = "API"
    SAGE_API_PASSWORD: str

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
