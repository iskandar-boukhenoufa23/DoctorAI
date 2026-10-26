# Doctor AI multi-doctor upgrade

This is an educational starter, **not a clinically validated medical triage system**. Never use it for real patient decisions without professional review, extensive testing, privacy controls and jurisdiction-specific compliance.

## NestJS-owned directory contract

The Python service expects authenticated internal endpoints on NestJS:

- `GET /internal/specialists` returns `[ {"slug":"general-medicine","is_active":true}, {"slug":"cardiology","is_active":true} ]`
- `GET /internal/doctor-agents?specialty=cardiology` returns `[ {"id":"uuid","name":"Ramy","specialty_slug":"cardiology","system_prompt":"Be concise","personality":{"tone":"calm"},"is_active":true} ]`

Both endpoints must require `X-Service-Key` matching `NEST_INTERNAL_API_KEY`. Validate allowed specialty slugs and return only active, administrator-approved doctor records. Never let clients set doctor prompts or patient identity. NestJS must verify the patient before calling the Python service and must own consultations, reviews and persistence. Directory calls fail closed if unavailable.

## Flow

`classify (illustrative emergency phrases) -> emergency | triage -> clarify | select_doctor -> retrieve -> generate -> validate`

The optional `/v1/triage` endpoint currently executes the **entire** graph (including answer generation); use `/v1/chat` for normal calls. Both require `X-Service-Key: INTERNAL_API_KEY`.

## Limitations

- No real clinical triage. Keyword screening misses many emergencies, including negated/indirect phrasing.
- No persistent multi-turn chat state in Python; NestJS must add a secure history strategy.
- Public RAG is not yet specialty-filtered; tag ingested documents and implement metadata filtering before relying on specialty evidence separation.
- `validate` is a lightweight heuristic, not medical fact checking. Offline evaluations are demonstrations, not clinical evidence.
- No real doctor reviews or patient database in Python: those are NestJS responsibilities.
- Doctor choice is deterministic first ID, not rating-based or patient preference-based.
- If no approved source is ingested, the service declines to generate a substantive medical answer.

## Running

Install `requirements.txt`, configure `.env`, run `uvicorn app.main:app --reload`, and `pytest -q`.
