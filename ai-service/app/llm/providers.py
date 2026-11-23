
from functools import lru_cache

from langchain_groq import ChatGroq
from langchain_community.embeddings import (
    HuggingFaceEmbeddings,
)

from app.config import settings


@lru_cache
def get_llm():
    s = settings()

    if not s.groq_api_key:
        raise RuntimeError("GROQ_API_KEY must be configured")

    return ChatGroq(
        model=s.groq_model,
        temperature=0,
        api_key=s.groq_api_key,
    )


@lru_cache
def get_embeddings():
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
