"""Doctor directory is owned by NestJS. No patient-supplied prompt is trusted."""
import httpx
from app.config import settings

class DirectoryError(RuntimeError):
    pass

def _client():
    cfg = settings()
    if not cfg.nest_internal_url or not cfg.nest_internal_api_key:
        raise DirectoryError("NestJS directory is not configured")
    return httpx.Client(base_url=cfg.nest_internal_url.rstrip("/"),
                        headers={"X-Service-Key": cfg.nest_internal_api_key}, timeout=8)

def list_specialists() -> list[dict]:
    try:
        with _client() as client:
            response = client.get("/internal/specialists")
            response.raise_for_status()
            data = response.json()
        if not isinstance(data, list):
            raise DirectoryError("Invalid specialist response")
        return [x for x in data if x.get("is_active", True)]
    except (httpx.HTTPError, ValueError, TypeError) as exc:
        raise DirectoryError("Unable to fetch specialists") from exc

def list_doctors(specialty_slug: str) -> list[dict]:
    try:
        with _client() as client:
            response = client.get("/internal/doctor-agents", params={"specialty": specialty_slug})
            response.raise_for_status()
            data = response.json()
        if not isinstance(data, list):
            raise DirectoryError("Invalid doctor response")
        return [x for x in data if x.get("is_active", True)
                and x.get("specialty_slug") == specialty_slug]
    except (httpx.HTTPError, ValueError, TypeError) as exc:
        raise DirectoryError("Unable to fetch doctors") from exc
