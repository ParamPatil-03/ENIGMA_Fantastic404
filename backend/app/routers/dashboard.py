from fastapi import APIRouter
from app.routers.verification import STORED_RESULTS
from app.services.identity_service import verify_identity
import json
from pathlib import Path

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/{company_name}")
def get_dashboard(company_name: str):
    cases = [r for r in STORED_RESULTS if r.request.company_name.lower() == company_name.lower()]
    id_stat = verify_identity(company_name, "393002")
    return {
        "company_name": company_name,
        "identity_status": id_stat,
        "verification_history": cases
    }
