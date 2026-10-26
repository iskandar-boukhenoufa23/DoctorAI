from app.llm.providers import get_llm

def evaluate_faithfulness(question: str, answer: str, contexts: list[str]) -> str:
    prompt = ("Evaluate whether each factual claim in ANSWER is supported by CONTEXT. "
              "Return a short list of unsupported claims; say NONE if none. "
              "Do not use external knowledge.\nQUESTION: " + question +
              "\nCONTEXT: " + repr(contexts) + "\nANSWER: " + answer)
    return str(get_llm().invoke(prompt).content)
