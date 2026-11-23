from typing import TypedDict, NotRequired, Any


class DoctorState(TypedDict):
    question: str
    consultation_id: NotRequired[str | None]

    # Existing routing
    is_emergency: NotRequired[bool]
    specialty_slug: NotRequired[str]
    doctor_id: NotRequired[str]
    selected_doctor: NotRequired[dict[str, Any]]
    needs_clarification: NotRequired[bool]
    clarification_question: NotRequired[str]
    triage_reason: NotRequired[str]
    decision: NotRequired[str]
    reason: NotRequired[str]
    safety_flags: NotRequired[list[str]]
    sources: NotRequired[list[dict[str, str]]]

    # Optional image
    image_bytes: NotRequired[bytes | None]
    image_result: NotRequired[dict[str, Any] | None]

    # RAG and response
    contexts: NotRequired[list[dict[str, Any]]]
    answer: NotRequired[str]
    is_valid: NotRequired[bool]
