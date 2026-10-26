from langchain_core.messages import SystemMessage, HumanMessage
from app.llm.providers import get_llm
from app.llm.schemas import TriageDecision

def classify_specialty(question: str, specialties: list[dict]) -> TriageDecision:
    slugs = [str(x["slug"]) for x in specialties]
    if not slugs:
        raise ValueError("No specialties available")
    prompt = ("You route general medical INFORMATION requests, not diagnose. "
              "Choose only one allowed slug. If unclear, choose general-medicine if available "
              "and request clarification. Do not assume absence of an emergency. "
              "Available specialty slugs: " + ", ".join(slugs))
    result = get_llm().with_structured_output(TriageDecision).invoke([
        SystemMessage(content=prompt), HumanMessage(content=question)
    ])
    if result.specialty_slug not in slugs:
        result.specialty_slug = "general-medicine" if "general-medicine" in slugs else slugs[0]
        result.needs_clarification = True
    return result
