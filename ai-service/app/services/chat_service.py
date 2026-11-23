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

    print("RESULT::::::::    ", result)

    return ChatResponse(
        answer=result.get("answer", "The AI service could not complete this request."),
        decision=result.get("decision", "completed"),
        doctor_id=result.get("doctor_id"),
        specialty_slug=result.get("specialty_slug"),
        urgency="emergency" if result.get("decision") == "emergency_escalation" else "routine",
        needs_clarification=bool(result.get("needs_clarification")),
        reason=result.get("reason") or result.get("triage_reason"),
    )
