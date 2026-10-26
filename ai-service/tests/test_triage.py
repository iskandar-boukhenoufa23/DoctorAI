from app.evaluation.triage import evaluate_triage, emergency_recall
from app.graph.router import route_after_classify, route_after_triage

def test_emergency_routing():
    assert route_after_classify({"safety_flags": ["possible_emergency"]}) == "emergency"

def test_clarification_routing():
    assert route_after_triage({"needs_clarification": True}) == "clarify"

def test_evaluator():
    assert evaluate_triage("dermatology", ["dermatology"])["routing_correct"]
    assert emergency_recall([{"expected_emergency": True, "predicted_emergency": True}]) == 1.0
