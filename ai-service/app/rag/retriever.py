from app.config import settings
from app.llm.providers import get_embeddings
from app.rag.vector_store import collection

def search_knowledge(query: str, scope: str = "public", specialty_slug: str | None = None) -> list[dict]:
    col = collection()
    if col.count() == 0:
        return []
    where = {"scope": scope}
    if scope == "public" and specialty_slug:
        # Existing general documents remain usable; specialty tagging is optional for MVP.
        # To enforce specialty-only retrieval, ingest specialty metadata and use an AND filter.
        pass
    vector = get_embeddings().embed_query(query)
    results = col.query(query_embeddings=[vector], n_results=min(settings().retrieval_k, col.count()),
                        where=where, include=["documents", "metadatas", "distances"])
    return [{"text": t, "title": m["title"], "source_id": i, "distance": d}
            for t, m, i, d in zip(results["documents"][0], results["metadatas"][0],
                                   results["ids"][0], results["distances"][0])]
