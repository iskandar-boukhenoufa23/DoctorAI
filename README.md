# Doctor AI

Doctor AI is an educational starter for a multi-specialty health information experience. It combines a Next.js frontend, a NestJS API with PostgreSQL persistence, and a FastAPI service for LLM and retrieval workflows.

> **Medical and privacy notice:** This project is not a medical device and is not clinically validated. It must not be used for diagnosis, treatment, emergency decisions, or real patient care. Do not submit real patient information or PHI. Emergency detection, generated answers, and evaluation datasets are not clinically reliable.

## Project structure

| Directory     | Purpose                                                  | Guide                                                                  |
| ------------- | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| `frontend/`   | Next.js web application with Clerk sign-in UI            | [frontend/README.md](frontend/README.md)                               |
| `backend/`    | NestJS API, Clerk authentication, Prisma, and PostgreSQL | [backend/README.md](backend/README.md)                                 |
| `ai-service/` | FastAPI chat, triage, document, and retrieval service    | [ai-service/README.md](ai-service/README.md)                           |
| `ai-service/` | Multi-doctor flow and its current limitations            | [ai-service/MULTI_DOCTOR_README.md](ai-service/MULTI_DOCTOR_README.md) |

## Architecture

```text
Browser
  -> Next.js frontend (localhost:3001)
  -> NestJS API (localhost:3000/api)
       -> PostgreSQL
       -> FastAPI AI service (localhost:8000)
            -> OpenAI model and embeddings
            -> Chroma local vector store
```

NestJS owns users, consultations, doctors, reviews, and database migrations. The AI service is an internal service and should not be exposed directly to browsers or the public internet. The frontend currently contains the landing page and Clerk sign-in UI; the API base URL is not yet used by the frontend source.

## Requirements

- Node.js 22 or newer
- pnpm 12 (frontend; see `frontend/package.json`)
- Python 3.11 or newer
- PostgreSQL 16, or Docker Compose for the database
- An OpenAI API key for AI-service requests
- Clerk keys for authenticated frontend and backend flows

## Local development

### 1. Configure environment files

Create service environment files from the checked-in examples:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item ai-service/.env.example ai-service/.env
```

Set real development values in each file. Keep `.env` files out of Git and never publish API keys or service secrets. The relevant shared values must agree:

- `backend/.env`: set `AI_SERVICE_KEY` to the same value as `ai-service/.env`'s `INTERNAL_API_KEY`.
- `backend/.env`: set `INTERNAL_API_KEY` to the same value as `ai-service/.env`'s `NEST_INTERNAL_API_KEY`.
- Configure `OPENAI_API_KEY` in `ai-service/.env` and Clerk credentials in the frontend/backend environment.
- Set `DATABASE_URL` in `backend/.env` to your local PostgreSQL database.

The Compose file also requires a root `.env` containing `POSTGRES_PASSWORD`. The database is bound to localhost. See the service READMEs for additional configuration and security notes.

### 2. Start PostgreSQL

With Docker Desktop running, create a root `.env` containing a development-only `POSTGRES_PASSWORD`, then start the database:

```powershell
docker compose up -d postgres
```

### 3. Start the backend

```powershell
cd backend
npm ci
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

The API listens on `http://localhost:3000`, with routes under `/api`.

### 4. Start the AI service

In another terminal:

```powershell
cd ai-service
py -3.11 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The health endpoint is available at `http://localhost:8000/health` if enabled by the current service version. Configure the internal service keys before making backend-to-AI requests.

### 5. Start the frontend

In another terminal, configure the Clerk publishable and secret keys in the frontend environment, then run:

```powershell
cd frontend
pnpm install
pnpm dev
```

Open `http://localhost:3000` for Next.js if its default port is available. To avoid colliding with the backend on port 3000, run the frontend on port 3001:

```powershell
pnpm dev -- --port 3001
```

## Tests and evaluations

Run backend build checks from `backend/`:

```powershell
npm run build
```

Run AI-service tests and the demonstration evaluation from `ai-service/`:

```powershell
pytest -q
python -m scripts.run_evaluation
```

The evaluation datasets and checks are illustrative only, not evidence of medical accuracy or safety.

## Safety and deployment

- Do not deploy this starter for clinical use or use it with real patient data.
- Keep the AI service on a private network and use distinct, strong service keys.
- The emergency detector and output checks are minimal heuristics and can miss emergencies or produce false positives.
- Retrieved sources do not guarantee that every generated claim is supported or correct.
- Uploaded documents and local vector data do not have production-grade encryption, retention, deletion, malware-scanning, or tenant-isolation controls.
- A production system would require clinical validation, privacy and security review, monitoring, access controls, audit trails, and jurisdiction-specific compliance.
"# DoctorAI" 
