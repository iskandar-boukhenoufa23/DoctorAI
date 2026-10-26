def route_after_classify(state):
    return "emergency" if "possible_emergency" in state.get("safety_flags", []) else "triage"

def route_after_triage(state):
    if state.get("decision") == "directory_unavailable":
        return "end"
    if state.get("needs_clarification"):
        return "clarify"
    return "select_doctor"

def route_after_selection(state):
    return "end" if state.get("decision") == "no_doctor_available" else "retrieve"
