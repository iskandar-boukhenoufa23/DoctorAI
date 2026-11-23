from pydantic import BaseModel, Field

class Source(BaseModel):
    title: str
    source_id: str

class ChatResponse(BaseModel):
    answer: str
    decision: str = "completed"
    sources: list[Source] = Field(default_factory=list)
    safety_flags: list[str] = Field(default_factory=list)
    doctor_id: str | None = None
    specialty_slug: str | None = None
    urgency: str | None = None
    needs_clarification: bool = False
    reason: str | None = None
