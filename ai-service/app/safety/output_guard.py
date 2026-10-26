import re

def inspect_output(text: str) -> list[str]:
    flags = []
    if re.search(r"\b(you definitely have|guaranteed cure|100% safe)\b", text, re.I):
        flags.append("overconfident_medical_claim")
    return flags
