# Doctor AI Python Service (educational starter)

**Not a medical device. Not suitable for real patient care or production PHI.**

## Run locally

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # edit OPENAI_API_KEY and INTERNAL_API_KEY
uvicorn app.main:app --reload
```

## Add trusted public knowledge

```bash
python -m scripts.ingest_documents ./your-reviewed-source.pdf
```

Only ingest documents you have rights to use and whose medical accuracy/currency you have checked.

## Chat from NestJS

```bash
curl -X POST http://localhost:8000/v1/chat \
 -H 'X-Service-Key: change-this-long-random-key' \
 -H 'Content-Type: application/json' \
 -d '{"message":"What is hypertension?","user_id":"demo","chat_id":"demo"}'
```

`user_id` must be supplied by a trusted NestJS authentication layer, never directly from a browser. The AI service should only be reachable on an internal network. The demo header is a shared secret, not user authentication.

## Upload PDF (demo only)

```bash
curl -X POST http://localhost:8000/v1/documents \
 -H 'X-Service-Key: change-this-long-random-key' \
 -F 'user_id=demo' -F 'file=@example.pdf'
```

## Tests

```bash
pytest -q
python -m scripts.run_evaluation
```

## Important limitations

- Emergency regex detection is **not clinically validated**, misses many emergencies, and may generate false positives. Replace with clinically reviewed triage; never rely on it for real patients.
- The LLM output guard is minimal. There is no robust claim-by-claim factual verification or independent clinical evaluation.
- The model can hallucinate even when sources are retrieved. Returned source IDs indicate retrieved context, **not** proven support for every claim.
- No chat persistence or streaming: NestJS should own conversation history; SSE can be added after robust validation.
- Uploaded PDFs are stored as plaintext vector chunks in local Chroma; no encryption, retention/deletion workflow, malware scanning, or privacy compliance. Use only non-sensitive demo files.
- Ingested text is not verified for clinical reliability; source validation and licensing are manual.
- Evaluation functions are scaffolding; reference datasets must be reviewed by medical experts. Never infer clinical safety from the toy tests.
- No user isolation guarantees against a compromised internal service; production requires tenant isolation, audit trails, secure object storage, encryption, and access control.
- Dependencies are broad version ranges; generate and commit a tested lockfile before deployment.
