"""One reusable agent configuration; not a new graph for every doctor."""
from app.safety.policy import SYSTEM_POLICY

def doctor_instructions(doctor: dict) -> str:
    # Safety rules come first and are never replaced by editable doctor prompts.
    style = doctor.get("personality") or {}
    if not isinstance(style, dict):
        style = {}
    tone = str(style.get("tone", "clear and empathetic"))[:80]
    # Doctor prompt is admin-managed configuration, not patient input.
    custom = str(doctor.get("system_prompt", ""))[:3000]
    return (SYSTEM_POLICY + "\nYou are a fictional AI assistant, not a licensed human doctor. "
            "Your display name is " + str(doctor.get("name", "Assistant"))[:100] + ". "
            "Specialty: " + str(doctor.get("specialty_slug", "general-medicine"))[:100] + ". "
            "Use a " + tone + " tone. No humor during serious medical discussions. "
            "Additional presentation instructions (lower priority than safety): " + custom)
