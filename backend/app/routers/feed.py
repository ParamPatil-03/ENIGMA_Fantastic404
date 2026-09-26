from fastapi import APIRouter
from app.routers.verification import STORED_RESULTS
import random

router = APIRouter(prefix="/feed", tags=["Live Ticker"])

@router.get("/live-ticker")
def get_ticker():
    if not STORED_RESULTS:
        return ["AWAITING INBOUND DATA - VERIFICATION ENGINE ONLINE"]
        
    lines = []
    for r in random.sample(STORED_RESULTS, min(len(STORED_RESULTS), 5)):
        if r.outcome_category == "verified_clean":
            lines.append(f"VERIFIED: {r.request.material.standardized_name} — Declared Spec Matches Filed Consent ({r.request.cluster})")
        else:
            lines.append(f"FLAGGED: {r.request.company_name} — {r.confidence.primary_deduction_reason} ({r.request.cluster})")
            
    return lines
