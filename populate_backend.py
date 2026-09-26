import os
import json

base_dir = 'backend'

# 1. Identity Reference Data
identity_data = [
    {"company_name": "Aarti Industries Limited", "registry_type": "MCA", "registration_number": "L24110GJ1984PLC007301", "registered_address": "Plot No 801/23, GIDC Estate, Ankleshwar", "status": "active", "pincode": "393002", "gidc_estate_match": True},
    {"company_name": "Meghmani Organics Ltd", "registry_type": "MCA", "registration_number": "L24299GJ1995PLC024052", "registered_address": "Plot No. Z/31/3, Dahej SEZ, Bharuch", "status": "active", "pincode": "392130", "gidc_estate_match": True},
    {"company_name": "UPL Limited", "registry_type": "MCA", "registration_number": "L24219GJ1985PLC025132", "registered_address": "Plot No 117/118, GIDC, Ankleshwar", "status": "active", "pincode": "393002", "gidc_estate_match": True},
    {"company_name": "Atul Ltd", "registry_type": "MCA", "registration_number": "L99999GJ1975PLC002859", "registered_address": "Atul, Valsad", "status": "active", "pincode": "396020", "gidc_estate_match": False},
    {"company_name": "Sajjan India Limited", "registry_type": "MCA", "registration_number": "U24230GJ1970PLC001712", "registered_address": "Plot No 6115, GIDC, Ankleshwar", "status": "active", "pincode": "393002", "gidc_estate_match": True}
]
with open(f'{base_dir}/app/data/identity_reference.json', 'w') as f:
    json.dump(identity_data, f, indent=2)

# 2. Material Profiles
material_data = [
    {"standardized_name": "Spent Sulfuric Acid", "material_class": "acid_byproduct", "cas_number": "7664-93-9", "hazard_class": "corrosive", "equivalent_virgin_material": "Commercial Grade Sulfuric Acid", "location": "Dahej SEZ"},
    {"standardized_name": "Phosphogypsum", "material_class": "gypsum_byproduct", "cas_number": "13397-24-5", "hazard_class": "non_hazardous", "equivalent_virgin_material": "Natural Gypsum", "location": "Ankleshwar GIDC"}
]
with open(f'{base_dir}/app/data/material_profiles.json', 'w') as f:
    json.dump({"_meta": "Modeled demonstration data", "data": material_data}, f, indent=2)

# 3. Regulatory Profiles
reg_data = {
    "Aarti Industries Limited": {
        "filed_hazard_categories": ["corrosive", "toxic"],
        "filed_concentration_range": {"min": 60, "max": 68},
        "last_filing_update_date": "2025-06-01T00:00:00Z",
        "rule9_status": "approved",
        "prior_discrepancy_count": 0
    },
    "UPL Limited": {
        "filed_hazard_categories": ["corrosive"],
        "filed_concentration_range": {"min": 50, "max": 55},
        "last_filing_update_date": "2025-01-01T00:00:00Z",
        "rule9_status": "pending",
        "prior_discrepancy_count": 2
    }
}
with open(f'{base_dir}/app/data/regulatory_profiles.json', 'w') as f:
    json.dump({"_meta": "Modeled demonstration data", "data": reg_data}, f, indent=2)

# 4. Services
identity_service_code = """import json
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
"""
with open(f'{base_dir}/app/services/identity_service.py', 'w') as f:
    f.write(identity_service_code)

print("Data & Services populated.")
