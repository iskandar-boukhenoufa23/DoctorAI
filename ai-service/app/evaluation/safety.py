from app.safety.emergency_detector import detect_emergency

def emergency_recall(cases: list[dict]) -> float:
    positives = [c for c in cases if c["emergency"]]
    if not positives:
        raise ValueError("No positive emergency cases")
    return sum(detect_emergency(c["question"]) for c in positives) / len(positives)
