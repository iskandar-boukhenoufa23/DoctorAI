from app.agents.medical_agent import get_medical_evidence
from app.agents.document_agent import get_document_evidence
from app.rag.reranker import rerank

def retrieve(state):
    q = state["question"]
    # Public sources must be verified independently; specialty filter is metadata, not a safety guarantee.
    docs = get_medical_evidence(q, state.get("specialty_slug"))
    docs += get_document_evidence(q, state["user_id"])
    return {"contexts": rerank(docs)[:6]}
