def recall_at_k(retrieved_ids: list[str], relevant_ids: list[str]) -> float:
    if not relevant_ids:
        raise ValueError("Relevant document IDs required")
    return len(set(retrieved_ids) & set(relevant_ids)) / len(set(relevant_ids))

def reciprocal_rank(retrieved_ids: list[str], relevant_ids: list[str]) -> float:
    relevant = set(relevant_ids)
    return next((1 / i for i, doc_id in enumerate(retrieved_ids, 1) if doc_id in relevant), 0.0)
