from app.safety.input_guard import inspect_input

def classify(state):
    flags = inspect_input(state["question"])
    return {"safety_flags": flags, "intent": "medical_information"}
