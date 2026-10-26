from pydantic import BaseModel, Field

class TriageRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    user_id: str = Field(min_length=1)
    chat_id: str = Field(min_length=1)

class TriageResponse(BaseModel):
    decision: str
    specialty_slug: str | None = None
    doctor_id: str | None = None
    answer: str
