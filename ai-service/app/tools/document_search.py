from app.rag.retriever import search_knowledge

def document_search(question: str, user_id: str) -> list[dict]:
    return search_knowledge(question, scope=f"user:{user_id}")
