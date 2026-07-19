from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = 'paola-cortes-data-api'
    app_env: str = 'development'
    app_port: int = 8000
    database_url: str = ''
    cors_allowed_origins: str = 'http://localhost:5181,http://127.0.0.1:5181'
    trusted_proxy_headers: bool = True
    rate_limit_per_minute: int = 45
    lead_policy_version: str = 'v1.0'
    ip_hash_salt: str = 'paola-cortes-default-salt'
    admin_api_key: str = ''

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    def allowed_origins(self) -> list[str]:
        parsed: list[str] = []
        for raw in self.cors_allowed_origins.split(','):
            item = raw.strip().rstrip('/')
            if item:
                parsed.append(item)
        return parsed


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
