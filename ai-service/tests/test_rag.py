from app.evaluation.retrieval import recall_at_k, reciprocal_rank

def test_metrics():
    assert recall_at_k(["a", "b"], ["b", "c"]) == 0.5
    assert reciprocal_rank(["a", "b"], ["b"]) == 0.5
