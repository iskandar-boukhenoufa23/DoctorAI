import hashlib
from pathlib import Path
from langchain_core.documents import Document
from pypdf import PdfReader
from app.rag.chunking import chunk_documents
from app.rag.vector_store import collection
from app.rag.embeddings import get_embeddings

def extract_pdf(data: bytes) -> str:
    import io
    reader = PdfReader(io.BytesIO(data))
    return "\n".join(page.extract_text() or "" for page in reader.pages)

def ingest_text(text: str, title: str, scope: str = "public") -> int:
    if not text.strip():
        raise ValueError("Document contains no extractable text")
    docs = chunk_documents([Document(page_content=text, metadata={"title": title, "scope": scope})])
    texts = [d.page_content for d in docs]
    vectors = get_embeddings().embed_documents(texts)
    ids = [hashlib.sha256((scope + title + str(i) + t).encode()).hexdigest() for i, t in enumerate(texts)]
    collection().upsert(ids=ids, embeddings=vectors, documents=texts,
                        metadatas=[{"title": title, "scope": scope} for _ in texts])
    return len(texts)
