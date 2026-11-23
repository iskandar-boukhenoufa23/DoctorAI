from app.safety.policy import EMERGENCY_MESSAGE

def emergency(state):
    return {"answer": EMERGENCY_MESSAGE, "decision": "emergency_escalation", "sources": [], "reason": "Possible emergency symptoms detected"}
