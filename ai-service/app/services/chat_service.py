from app.graph.builder import doctor_graph
from app.api.schemas.chat import ChatRequest
from app.api.schemas.response import ChatResponse

async def answer_chat(request: ChatRequest, image_bytes: bytes | None = None):
    result = await doctor_graph.ainvoke({
        "question": request.message,
        "doctor_id": request.doctor_id,
        "consultation_id": request.consultation_id,
        "image_bytes": image_bytes,
    })

    return ChatResponse(
        answer=result["answer"],
    )