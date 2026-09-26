import json
from pathlib import Path
from rapidfuzz import fuzz
from app.models.schemas import IdentityVerificationResult

with open(Path(__file__).parent.parent / "data" / "identity_reference.json") as f:
    REF_DATA = json.load(f)

def verify_identity(company_name: str, pincode: str) -> IdentityVerificationResult:
    best_match = None
    highest_score = 0
    
    for entry in REF_DATA:
        score = fuzz.token_sort_ratio(company_name.lower(), entry["company_name"].lower())
        if score > highest_score:
            highest_score = score
            best_match = entry

    if highest_score < 85:
        return IdentityVerificationResult(status="unverified", matched_company=None, match_confidence=highest_score, reason=f"No matching registry entry found above threshold. Best match was {highest_score}%.")

    if best_match["pincode"] != pincode:
        return IdentityVerificationResult(status="unverified", matched_company=best_match["company_name"], match_confidence=highest_score, reason=f"Name matched at {highest_score}% but pincode {pincode} does not correspond to filed address ({best_match['pincode']}).")
        
    return IdentityVerificationResult(status="verified", matched_company=best_match["company_name"], match_confidence=highest_score, reason="Company name and pincode successfully matched GIDC registry.")
