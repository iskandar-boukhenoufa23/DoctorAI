import re

def inspect_output(text: str) -> list[str]:
    flags = []
    if re.search(r"\b(you definitely have|guaranteed cure|100% safe)\b", text, re.I):
        flags.append("overconfident_medical_claim")
    return flags

def require_evidence(contexts: list[dict] | None) -> list[str]:
    """Block normal medical generation when retrieval produced no source material."""
    return ["missing_retrieval_evidence"] if not contexts else []
