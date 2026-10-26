from fastapi import APIRouter, Depends
from app.api.routes.chat import authorize
from app.api.schemas.triage import TriageRequest, TriageResponse
from app.graph.builder import doctor_graph

router = APIRouter(tags=["triage"])

@router.post("/triage", response_model=TriageResponse, dependencies=[Depends(authorize)])
def triage_request(request: TriageRequest):
    # Same graph as chat: emergency screening must never be bypassed.
    state = doctor_graph.invoke({"question": request.message, "user_id": request.user_id,
                                 "chat_id": request.chat_id})
    return TriageResponse(decision=state["decision"], answer=state["answer"],
                          specialty_slug=state.get("specialty_slug"), doctor_id=state.get("doctor_id"))
