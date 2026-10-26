from pydantic import BaseModel, Field

class Source(BaseModel):
    title: str
    source_id: str

class ChatResponse(BaseModel):
    answer: str
    decision: str
    sources: list[Source] = Field(default_factory=list)
    safety_flags: list[str] = Field(default_factory=list)
    doctor_id: str | None = None
    specialty_slug: str | None = None
