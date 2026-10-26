from app.rag.retriever import search_knowledge

def medical_search(question: str, specialty_slug: str | None = None) -> list[dict]:
    return search_knowledge(question, scope="public", specialty_slug=specialty_slug)
