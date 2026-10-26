import secrets
from fastapi import APIRouter, Header, HTTPException, Depends
from app.config import settings
from app.api.schemas.chat import ChatRequest
from app.api.schemas.response import ChatResponse
from app.services.chat_service import answer_chat

router = APIRouter(tags=["chat"])

def authorize(x_service_key: str = Header(default="")):
    key = settings().internal_api_key
    if not key or not secrets.compare_digest(key, x_service_key):
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
    image_bytes = None

    if image is not None:
        image_bytes = await image.read()

    request = ChatRequest(
        message=message,
        doctor_id=doctor_id,
        consultation_id=consultation_id,
    )

    return await answer_chat(
        request,
        image_bytes=image_bytes,
    )