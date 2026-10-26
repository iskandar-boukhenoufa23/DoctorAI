from app.safety.output_guard import inspect_output
from app.safety.policy import INSUFFICIENT_MESSAGE

def validate(state):
    flags = inspect_output(state.get("answer", ""))
    if flags:
        return {"answer": INSUFFICIENT_MESSAGE, "decision": "blocked_output",
                "sources": [], "safety_flags": state.get("safety_flags", []) + flags}
    return {"safety_flags": state.get("safety_flags", [])}
