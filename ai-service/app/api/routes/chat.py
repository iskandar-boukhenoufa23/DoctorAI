import secrets
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile
from app.config import settings
from app.api.schemas.chat import ChatRequest
from app.api.schemas.response import ChatResponse
from app.services.chat_service import answer_chat

router = APIRouter(tags=["chat"])

def authorize(authorization: str = Header(default="")):
    print("AUTHORIZE FUNCTION CALLED")
    print("AUTHORIZATION HEADER:", repr(authorization))
    key = settings().internal_api_key
    token = authorization.removeprefix("Bearer ")
    print("TOKEN:", token)
    print("KEY CONFIGURED:", key)
    if not key or not secrets.compare_digest(key, token):
        raise HTTPException(status_code=401, detail="Unauthorized")


@router.post(
    "/chat",
    response_model=ChatResponse,
    dependencies=[Depends(authorize)]
)
async def chat(
    message: str = Form(...),
    doctor_id: Optional[str] = Form(None),
    consultation_id: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
):
    print("CHAT ROUTE REACHED")
    image_bytes = None
    if image is not None:
        if image.content_type not in {"image/jpeg", "image/png", "image/webp"}:
            raise HTTPException(status_code=415, detail="Unsupported image type")
        limit = settings().max_upload_mb * 1024 * 1024
        image_bytes = await image.read(limit + 1)
        if len(image_bytes) > limit:
            raise HTTPException(status_code=413, detail="Image too large")

    request = ChatRequest(
        message=message,
        doctor_id=doctor_id,
        consultation_id=consultation_id,
    )

    try:
        return await answer_chat(request, image_bytes=image_bytes)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="AI provider is unavailable") from exc
