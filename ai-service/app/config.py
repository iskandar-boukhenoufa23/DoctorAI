from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    groq_api_key: str = ""
    groq_model: str = "llama-3.1-8b-instant"

    # Keep your existing settings below
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    internal_api_key: str = ""
    nest_internal_url: str = ""
    nest_internal_api_key: str = ""
    chroma_path: str = "./data/chroma"
    max_upload_mb: int = 10
    max_image_pixels: int = 20_000_000
    retrieval_k: int = 4
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache
def settings():
    return Settings()
