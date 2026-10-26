# Doctor AI NestJS backend

NestJS 11 + Prisma 6 + PostgreSQL + Clerk JWT + FastAPI image/text proxy.

## Start

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Set `CLERK_SECRET_KEY`, `DATABASE_URL`, `AI_SERVICE_URL`, `AI_SERVICE_KEY`, `INTERNAL_API_KEY` in `.env`. Create an ADMIN user by setting `role=ADMIN` through a controlled database operation (never expose a public role assignment endpoint). Your frontend obtains a Clerk session JWT and passes `Authorization: Bearer <token>` to NestJS. All external endpoints require Clerk JWT; internal endpoints use a separate service key.

## Routes (prefixed with `/api`)

- `GET/PATCH /profile/me`
- `GET /specialists`, `GET /specialists/:id`; admin: `POST/PATCH/DELETE /specialists`
- `GET /doctors`, `GET /doctors/:id`; admin: `POST/PATCH/DELETE /doctors`
- `POST/GET /consultations`, `GET /consultations/:id`, `PATCH /consultations/:id/complete`
- `POST /consultations/:id/messages` — multipart `message` plus optional `image`; text-only can also be JSON. This sends to FastAPI `/chat` and saves only the text exchange, not image bytes.
- `GET /reviews/doctor/:doctorId`, `POST /reviews` (only after completed consultation)
- Internal: `GET /internal/specialists`, `GET /internal/doctor-agents?specialty=cardiology` (service Bearer token)

## Integration notes

- FastAPI must accept multipart `message`, optional `doctor_id`, `consultation_id`, optional `image`, and return `{ "answer": "..." }` (plus optional `urgency`, `specialty_slug`, `needs_clarification`, `reason`). Ensure your FastAPI chat schema and response agree.
- For authenticated user-scoped data, NestJS must supply verified user identity to FastAPI through trusted internal communication. The current starter does not transmit identity; do not expose the AI service publicly or enable user-document retrieval until that is implemented.
- If FastAPI selects a doctor during triage, the current starter does **not** persist the selected doctor on the consultation. Add a trusted validation of returned doctor ID and persist it before enabling auto-routing.
- Image uploads use Multer memory storage (up to 5 MiB). For no-disk retention, configure reverse proxy and hosting to avoid buffering/logging payloads; disable checkpoints/logs that contain images.
- This is an engineering starter, not a medically validated product. Add clinician-reviewed triage, emergency escalation, medical image validation, audit logs, privacy policy, tests, and rate limits before use with real patient data.
- NestJS owns PostgreSQL tables and schema migrations. Python should call internal endpoints, not independently migrate the same tables.
