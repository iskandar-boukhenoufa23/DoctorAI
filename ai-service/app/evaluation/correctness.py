from app.llm.providers import get_llm

def evaluate_correctness(question: str, answer: str, reference: str) -> str:
    prompt = ("Compare ANSWER to a clinically reviewed REFERENCE. Report contradictions and "
              "missing critical facts. Do not assume the reference is exhaustive.\nQUESTION: " +
              question + "\nREFERENCE: " + reference + "\nANSWER: " + answer)
    return str(get_llm().invoke(prompt).content)
