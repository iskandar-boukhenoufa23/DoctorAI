import io
import os
from functools import lru_cache

import torch
from PIL import Image, UnidentifiedImageError
from torchvision import transforms


class ImageClassifier:
    def __init__(self):
        self.model_path = os.getenv("MEDICAL_CNN_PATH", "")
        self.device = torch.device("cpu")

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
        ])

        self.model = None

        if self.model_path:
            self.model = torch.jit.load(
                self.model_path,
                map_location=self.device,
            )
            self.model.eval()

    def predict(self, image_bytes: bytes) -> dict:
        if self.model is None:
            return {
                "status": "unavailable",
                "reason": "No validated medical image model configured",
            }

        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()

            image = Image.open(io.BytesIO(image_bytes))
            image = image.convert("RGB")
        except (UnidentifiedImageError, OSError, ValueError):
            return {
                "status": "unsupported",
                "reason": "Invalid or unsupported image",
            }

        tensor = self.transform(image).unsqueeze(0)

        with torch.inference_mode():
            logits = self.model(tensor)
            probabilities = torch.softmax(logits, dim=1)

        return {
            "status": "model_output",
            "probabilities": probabilities[0].tolist(),
            "warning": (
                "Uncalibrated model output. "
                "Not a medical diagnosis."
            ),
        }


@lru_cache(maxsize=1)
def get_image_classifier() -> ImageClassifier:
    return ImageClassifier()