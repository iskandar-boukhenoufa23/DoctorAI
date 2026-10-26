from app.safety.emergency_detector import detect_emergency
from app.safety.output_guard import inspect_output

def test_emergency():
    assert detect_emergency("I have chest pain")
    assert not detect_emergency("What is a healthy diet?")

def test_overconfidence():
    assert inspect_output("You definitely have diabetes")
