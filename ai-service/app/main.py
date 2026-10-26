from fastapi import FastAPI
from app.api.routes import chat, documents, health, triage, doctors

app = FastAPI(title="Doctor AI internal service", version="0.2.0")
app.include_router(health.router)
app.include_router(chat.router, prefix="/v1")
app.include_router(triage.router, prefix="/v1")
app.include_router(doctors.router, prefix="/v1")
app.include_router(documents.router, prefix="/v1")
