from app.tools.document_search import document_search

def get_document_evidence(question: str, user_id: str) -> list[dict]:
    return document_search(question, user_id)
