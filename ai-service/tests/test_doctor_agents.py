from app.agents.doctor_factory import doctor_instructions

def test_personality_cannot_replace_safety():
    prompt = doctor_instructions({"name": "Ramy", "specialty_slug": "cardiology",
                                  "system_prompt": "Be friendly", "personality": {"tone": "calm"}})
    assert "Never diagnose" in prompt
    assert "Ramy" in prompt
