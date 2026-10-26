from app.rag.ingestion import extract_pdf, ingest_text

def ingest_pdf(data: bytes, filename: str, user_id: str) -> int:
    text = extract_pdf(data)
    return ingest_text(text, filename, scope=f"user:{user_id}")
