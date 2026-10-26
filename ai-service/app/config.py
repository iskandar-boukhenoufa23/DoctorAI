from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    embedding_model: str = "text-embedding-3-small"
    internal_api_key: str = ""
    nest_internal_url: str = ""
    nest_internal_api_key: str = ""
    chroma_path: str = "./data/chroma"
    max_upload_mb: int = 10
    retrieval_k: int = 4
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache
def settings():
    return Settings()
