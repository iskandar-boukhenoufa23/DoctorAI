from app.tools.medical_search import medical_search

def get_medical_evidence(question: str, specialty_slug: str | None = None) -> list[dict]:
    return medical_search(question, specialty_slug)
