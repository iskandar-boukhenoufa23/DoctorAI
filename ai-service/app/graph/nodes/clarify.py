def clarify(state):
    question = state.get("clarification_question", "").strip()
    return {"answer": question or "Could you describe your symptoms and how long you've had them?",
            "decision": "needs_clarification", "sources": []}
