from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    doctor_id: str | None = Field(default=None, max_length=128)
    consultation_id: str | None = Field(default=None, max_length=128)
