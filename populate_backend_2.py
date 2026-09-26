import os
import json

base_dir = 'backend'

# MODULE 3: Scoring Engine
scoring_engine_code = """import json
from datetime import datetime
from pathlib import Path
from app.models.schemas import MaterialDeclaration, ConfidenceScoreResult, FactorScore
from app.services.identity_service import verify_identity

with open(Path(__file__).parent.parent / "data" / "regulatory_profiles.json") as f:
    REG_DATA = json.load(f)["data"]

def compute_confidence_score(material: MaterialDeclaration, company_name: str, pincode: str = "393002") -> ConfidenceScoreResult:
    factors = []
    reg_profile = REG_DATA.get(company_name)
    
    # Factor 6: Identity (weight 10%)
    id_result = verify_identity(company_name, pincode)
    id_score = 100.0 if id_result.status == "verified" else 50.0
    factors.append(FactorScore(factor_name="Identity Verification Status", score=id_score, weight=0.10, weighted_contribution=id_score * 0.10))

    if not reg_profile:
        # Unknown company - basic fallback
        for name, weight in [("Declared vs Filed Concentration", 0.30), ("Documentation Currency", 0.15), 
                             ("Regulatory Authorization", 0.20), ("Historical Discrepancy Pattern", 0.15), 
                             ("Material Classification", 0.10)]:
            factors.append(FactorScore(factor_name=name, score=0, weight=weight, weighted_contribution=0))
        return ConfidenceScoreResult(confidence_score=10.0, factor_breakdown=factors, primary_deduction_reason="Company regulatory profile not found", physical_assay_recommended=True)

    # Factor 1: Concentration (weight 30%)
    min_conc = reg_profile["filed_concentration_range"]["min"]
    max_conc = reg_profile["filed_concentration_range"]["max"]
    decl_conc = material.declared_concentration
    MAX_DEV = 20.0
    if min_conc <= decl_conc <= max_conc:
        conc_score = 100.0
    else:
        dev = min(abs(decl_conc - min_conc), abs(decl_conc - max_conc))
        conc_score = max(0.0, 100.0 - (dev / MAX_DEV) * 100.0)
    factors.append(FactorScore(factor_name="Declared vs. Filed Concentration Match", score=conc_score, weight=0.30, weighted_contribution=conc_score * 0.30))

    # Factor 2: Currency (weight 15%)
    # simplified to assume filing is within 12 months for 100
    curr_score = 100.0
    factors.append(FactorScore(factor_name="Documentation Currency", score=curr_score, weight=0.15, weighted_contribution=curr_score * 0.15))

    # Factor 3: Rule 9 (weight 20%)
    r9 = reg_profile["rule9_status"]
    r9_score = 100.0 if r9 == "approved" else (50.0 if r9 == "pending" else 0.0)
    factors.append(FactorScore(factor_name="Regulatory Authorization Status", score=r9_score, weight=0.20, weighted_contribution=r9_score * 0.20))

    # Factor 4: Discrepancies (weight 15%)
    disc = reg_profile["prior_discrepancy_count"]
    disc_score = max(0.0, 100.0 - (disc * 20.0))
    factors.append(FactorScore(factor_name="Historical Discrepancy Pattern", score=disc_score, weight=0.15, weighted_contribution=disc_score * 0.15))

    # Factor 5: Hazard Class (weight 10%)
    haz_score = 100.0 if material.hazard_class in reg_profile["filed_hazard_categories"] else 0.0
    factors.append(FactorScore(factor_name="Material Classification Consistency", score=haz_score, weight=0.10, weighted_contribution=haz_score * 0.10))

    total = sum(f.weighted_contribution for f in factors)
    
    # XAI Reasoning
    weakest = min(factors, key=lambda x: x.score)
    reason = "Score meets threshold."
    if weakest.factor_name == "Regulatory Authorization Status" and weakest.score < 100:
        reason = "Rule 9 Utilization Approval is not on file — trade may not be legally authorized."
    elif weakest.factor_name == "Declared vs. Filed Concentration Match" and weakest.score < 100:
        reason = f"Declared concentration ({decl_conc}%) falls outside {company_name}'s filed historical range ({min_conc}-{max_conc}%)."
    elif weakest.factor_name == "Material Classification Consistency":
        reason = f"Declared hazard class ({material.hazard_class}) does not match filed records."
        
    return ConfidenceScoreResult(confidence_score=round(total, 1), factor_breakdown=factors, primary_deduction_reason=reason, physical_assay_recommended=(total < 65))
"""
with open(f'{base_dir}/app/services/scoring_engine.py', 'w') as f:
    f.write(scoring_engine_code)

# MODULE 4: Verification Router
verification_router = """from fastapi import APIRouter
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
"""
with open(f'{base_dir}/app/routers/verification.py', 'w') as f:
    f.write(verification_router)

# MODULE 5: Documents Data & Router
docs_data = {
    "hazardous": [
        {"document_type": "Rule 9 Utilization Approval", "description": "Required when receiver uses waste as raw material.", "required_for": "hazardous"},
        {"document_type": "Form 10 Manifest", "description": "Transport manifest.", "required_for": "hazardous"}
    ],
    "non_hazardous": [
        {"document_type": "CTO/CCA", "description": "Consent to operate.", "required_for": "both"}
    ]
}
with open(f'{base_dir}/app/data/document_requirements.json', 'w') as f:
    json.dump(docs_data, f, indent=2)

docs_router = """from fastapi import APIRouter
from pydantic import BaseModel
import json
from pathlib import Path

router = APIRouter(prefix="/documents", tags=["Documents"])

with open(Path(__file__).parent.parent / "data" / "document_requirements.json") as f:
    REQ = json.load(f)

@router.get("/requirements")
def get_requirements(hazardous: bool = True):
    return REQ["hazardous"] if hazardous else REQ["non_hazardous"]

class DocReq(BaseModel):
    company_name: str
    document_type: str
    
@router.post("/request-facilitation")
def req_fac(d: DocReq):
    return {"message": f"Touchstone can prepare your {d.document_type} and liaise directly with GPCB."}
"""
with open(f'{base_dir}/app/routers/documents.py', 'w') as f:
    f.write(docs_router)

# MODULE 7: Calculator Router
calc_router = """from fastapi import APIRouter
from app.models.schemas import ROIResult
from pydantic import BaseModel

router = APIRouter(prefix="/calculator", tags=["Calculator"])
VERIFICATION_FEE_PER_MT = 750

class CalcReq(BaseModel):
    monthly_volume_mt: float
    historical_dispute_rate_pct: float
    average_bad_batch_cost_per_mt: float

@router.post("/roi", response_model=ROIResult)
def compute_roi(req: CalcReq):
    exp = req.monthly_volume_mt * 12 * (req.historical_dispute_rate_pct / 100) * req.average_bad_batch_cost_per_mt
    cost = req.monthly_volume_mt * 12 * VERIFICATION_FEE_PER_MT
    net = exp - cost
    note = f"Based on {req.monthly_volume_mt} MT/month at {req.historical_dispute_rate_pct}% dispute rate vs ₹{VERIFICATION_FEE_PER_MT}/MT verification cost."
    return ROIResult(annual_risk_exposure=exp, annual_verification_cost=cost, net_annual_savings=net, methodology_note=note)
"""
with open(f'{base_dir}/app/routers/calculator.py', 'w', encoding='utf-8') as f:
    f.write(calc_router)

print("Generated remaining modules.")
