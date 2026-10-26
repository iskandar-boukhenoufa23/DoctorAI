from app.services.doctor_directory import list_specialists, DirectoryError
from app.agents.triage_agent import classify_specialty

def triage(state):
    try:
        specialties = list_specialists()
        if not specialties:
            return {"decision": "directory_unavailable", "answer": "No medical assistants are available right now."}
        result = classify_specialty(state["question"], specialties)
        return {"specialty_slug": result.specialty_slug,
                "needs_clarification": result.needs_clarification,
                "clarification_question": result.clarification_question,
                "triage_reason": result.rationale}
    except (DirectoryError, ValueError):
        return {"decision": "directory_unavailable", "answer": "The assistant directory is temporarily unavailable."}
