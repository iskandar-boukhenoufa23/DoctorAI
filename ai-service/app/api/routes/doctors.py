"""Doctor directory is administered in NestJS; Python never edits doctor profiles."""
from fastapi import APIRouter, Depends, HTTPException
from app.api.routes.chat import authorize
from app.services.doctor_directory import list_specialists, DirectoryError

router = APIRouter(tags=["doctors"])

@router.get("/specialists", dependencies=[Depends(authorize)])
def specialists():
    try:
        return list_specialists()
    except DirectoryError:
        raise HTTPException(status_code=503, detail="Directory unavailable")
