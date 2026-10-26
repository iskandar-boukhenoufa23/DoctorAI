from typing import TypedDict, NotRequired, Any


class DoctorState(TypedDict):
    question: str

    # Existing routing
    is_emergency: NotRequired[bool]
    specialty_slug: NotRequired[str]
    doctor_id: NotRequired[str]
    selected_doctor: NotRequired[dict[str, Any]]
    needs_clarification: NotRequired[bool]

    # Optional image
    image_bytes: NotRequired[bytes | None]
    image_result: NotRequired[dict[str, Any] | None]

    # RAG and response
    documents: NotRequired[list[str]]
    answer: NotRequired[str]
    is_valid: NotRequired[bool]