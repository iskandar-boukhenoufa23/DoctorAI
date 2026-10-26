def rerank(results: list[dict]) -> list[dict]:
    # Chroma returns vector-ranked results; replace with a cross-encoder if needed.
    return sorted(results, key=lambda r: r.get("distance", float("inf")))
