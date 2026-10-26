import re
# Illustrative high-recall phrases only. NOT a validated clinical triage system.
PATTERNS = [r"\b(chest pain|crushing chest|can't breathe|cannot breathe|difficulty breathing)\b",
            r"\b(stroke|face droop|slurred speech|severe bleeding|unconscious)\b",
            r"\b(suicidal|kill myself|overdose)\b"]

def detect_emergency(text: str) -> bool:
    return any(re.search(p, text, re.I) for p in PATTERNS)
