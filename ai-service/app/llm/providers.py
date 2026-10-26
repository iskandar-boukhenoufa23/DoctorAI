from functools import lru_cache
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from app.config import settings

@lru_cache
def get_llm():
    s = settings()
    if not s.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY must be configured")
    return ChatOpenAI(model=s.openai_model, temperature=0, api_key=s.openai_api_key)

@lru_cache
def get_embeddings():
    s = settings()
    if not s.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY must be configured")
    return OpenAIEmbeddings(model=s.embedding_model, api_key=s.openai_api_key)
