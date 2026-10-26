from app.safety.emergency_detector import detect_emergency

def inspect_input(text: str) -> list[str]:
    return ["possible_emergency"] if detect_emergency(text) else []
