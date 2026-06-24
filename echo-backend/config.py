"""
Application configuration — loaded from environment / .env file.
"""
import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    ticketmaster_api_key: str = ""

    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False

    default_radius_km: int = 30
    max_radius_km: int = 500
    max_artists: int = 50

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


@lru_cache
def get_settings() -> Settings:
    return Settings()
