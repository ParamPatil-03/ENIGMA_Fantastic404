import json
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
