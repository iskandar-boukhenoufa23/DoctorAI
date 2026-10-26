from app.graph.state import DoctorState
from app.tools.medical_image import analyze_medical_image


def analyze_image(state: DoctorState) -> dict:
    image_bytes = state.get("image_bytes")

    if not image_bytes:
        return {"image_result": None}

    result = analyze_medical_image(image_bytes)

    return {
        "image_result": result,
        "image_bytes": None,
    }