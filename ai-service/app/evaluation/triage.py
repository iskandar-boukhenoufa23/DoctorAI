def evaluate_triage(predicted_slug: str | None, acceptable_slugs: list[str]) -> dict:
    """Offline routing check; reference routes require clinical review."""
    return {"routing_correct": predicted_slug in acceptable_slugs,
            "predicted": predicted_slug, "acceptable": acceptable_slugs}

def emergency_recall(results: list[dict]) -> float:
    """Among true emergency cases, proportion escalated; no cases -> error."""
    emergencies = [r for r in results if r["expected_emergency"]]
    if not emergencies:
        raise ValueError("No emergency cases")
    return sum(r["predicted_emergency"] for r in emergencies) / len(emergencies)
