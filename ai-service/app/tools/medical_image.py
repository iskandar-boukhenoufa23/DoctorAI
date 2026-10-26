from app.models.image_classifier import get_image_classifier


def analyze_medical_image(image_bytes: bytes) -> dict:
    if not image_bytes:
        return {
            "status": "no_image",
            "reason": "No image provided",
        }

    classifier = get_image_classifier()
    return classifier.predict(image_bytes)