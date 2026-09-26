from fastapi import APIRouter
from app.models.schemas import VerificationRequest, VerificationResult, IdentityVerificationResult, ConfidenceScoreResult
from app.services.scoring_engine import compute_confidence_score
from app.services.identity_service import verify_identity
import uuid

router = APIRouter(prefix="/verification", tags=["Verification"])
STORED_RESULTS = []

@router.post("/request", response_model=VerificationResult)
def create_request(req: VerificationRequest):
    req.request_id = str(uuid.uuid4())
    id_res = verify_identity(req.company_name, "393002") # default pincode for demo
    conf_res = compute_confidence_score(req.material, req.company_name)
    
    if conf_res.confidence_score >= 80:
        outcome = "verified_clean"
    elif conf_res.confidence_score < 65:
        outcome = "discrepancy_flagged"
    else:
        outcome = "documentation_gap"
        
    res = VerificationResult(request=req, confidence=conf_res, identity=id_res, outcome_category=outcome)
    STORED_RESULTS.append(res)
    return res

@router.get("/cases")
def get_cases(outcome: str = None):
    return [r for r in STORED_RESULTS if not outcome or r.outcome_category == outcome]
