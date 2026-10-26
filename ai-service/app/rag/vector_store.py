from functools import lru_cache
import chromadb
from app.config import settings

@lru_cache
def collection():
    client = chromadb.PersistentClient(path=settings().chroma_path)
    return client.get_or_create_collection("medical_knowledge")
