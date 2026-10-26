from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from app.api.routes.chat import authorize
from app.config import settings
from app.services.document_service import ingest_pdf

router = APIRouter(tags=["documents"])

@router.post("/documents", dependencies=[Depends(authorize)])
async def upload_document(user_id: str = Form(...), file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "PDF files only")
    max_bytes = settings().max_upload_mb * 1024 * 1024
    data = await file.read(max_bytes + 1)
    if len(data) > max_bytes:
        raise HTTPException(413, "File too large")
    if not data.startswith(b"%PDF-"):
        raise HTTPException(400, "Invalid PDF")
    try:
        count = ingest_pdf(data, file.filename, user_id)
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from exc
    return {"chunks_indexed": count, "filename": file.filename}
