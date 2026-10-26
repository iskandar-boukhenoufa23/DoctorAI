from typing import Literal
from pydantic import BaseModel, Field

class TriageDecision(BaseModel):
    specialty_slug: str = Field(description="Choose a slug from the supplied specialty directory")
    needs_clarification: bool = False
    clarification_question: str = ""
    rationale: str = ""

class DoctorConfiguration(BaseModel):
    id: str
    name: str
    specialty_slug: str
    system_prompt: str = ""
    personality: dict = Field(default_factory=dict)
    is_active: bool = True
