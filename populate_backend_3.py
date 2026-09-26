import os
import json
import uuid
base_dir = 'backend'

# MODULE 6: Coverage Router & Data
clusters_data = [
    {"name": "Ankleshwar GIDC", "latitude": 21.6264, "longitude": 73.0152, "assay_team_base": "Bharuch Central", "avg_dispatch_hours": 1.5, "active_cases_count": 0, "verified_companies_count": 0},
    {"name": "Dahej SEZ", "latitude": 21.7118, "longitude": 72.5855, "assay_team_base": "Bharuch Central", "avg_dispatch_hours": 2.1, "active_cases_count": 0, "verified_companies_count": 0}
]
with open(f'{base_dir}/app/data/clusters.json', 'w') as f:
    json.dump(clusters_data, f, indent=2)

coverage_router = """from fastapi import APIRouter
import json
from pathlib import Path
from app.routers.verification import STORED_RESULTS

router = APIRouter(prefix="/coverage", tags=["Coverage Map"])

with open(Path(__file__).parent.parent / "data" / "clusters.json") as f:
    CLUSTERS = json.load(f)

@router.get("/clusters")
def get_cluster_stats():
    # Dynamically compute stats based on STORED_RESULTS
    stats = []
    for c in CLUSTERS:
        active = sum(1 for r in STORED_RESULTS if r.request.cluster == c["name"] and r.outcome_category == "discrepancy_flagged")
        verified = sum(1 for r in STORED_RESULTS if r.request.cluster == c["name"] and r.outcome_category == "verified_clean")
        c_copy = c.copy()
        c_copy["active_cases_count"] = active
        c_copy["verified_companies_count"] = verified
        stats.append(c_copy)
    return stats
"""
with open(f'{base_dir}/app/routers/coverage.py', 'w') as f:
    f.write(coverage_router)

# MODULE 8: Auth & Dashboard Router
auth_router = """from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal
import uuid
from app.services.identity_service import verify_identity

router = APIRouter(prefix="/auth", tags=["Auth"])

class SignupReq(BaseModel):
    company_name: str
    cluster: str
    role: Literal["buyer", "seller", "both"]
    email: str

@router.post("/signup")
def signup(req: SignupReq):
    id_res = verify_identity(req.company_name, "393002")
    return {"token": str(uuid.uuid4()), "identity_verification": id_res}

class LoginReq(BaseModel):
    email: str
    
@router.post("/login")
def login(req: LoginReq):
    return {"token": str(uuid.uuid4())}
"""
with open(f'{base_dir}/app/routers/auth.py', 'w') as f:
    f.write(auth_router)

dashboard_router = """from fastapi import APIRouter
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
"""
with open(f'{base_dir}/app/routers/dashboard.py', 'w') as f:
    f.write(dashboard_router)

# MODULE 9: Feed
feed_router = """from fastapi import APIRouter
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
"""
with open(f'{base_dir}/app/routers/feed.py', 'w') as f:
    f.write(feed_router)

print("Modules 6, 8, 9 populated.")
