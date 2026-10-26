import json
from pathlib import Path
from app.evaluation.safety import emergency_recall

def main():
    cases = json.loads((Path(__file__).resolve().parents[1] / "tests/datasets/emergency_cases.json").read_text())
    print({"emergency_recall_on_toy_dataset": emergency_recall(cases)})
    print("WARNING: toy examples are not clinical validation")

if __name__ == "__main__":
    main()
