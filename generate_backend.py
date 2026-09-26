import os
import json

base_dir = 'backend'
os.makedirs(f'{base_dir}/app/routers', exist_ok=True)
os.makedirs(f'{base_dir}/app/models', exist_ok=True)
os.makedirs(f'{base_dir}/app/data', exist_ok=True)
os.makedirs(f'{base_dir}/app/services', exist_ok=True)
os.makedirs(f'{base_dir}/app/utils', exist_ok=True)
os.makedirs(f'{base_dir}/app/tests', exist_ok=True)

# Generate requirements.txt
with open(f'{base_dir}/requirements.txt', 'w') as f:
    f.write('fastapi\nuvicorn\npydantic\npandas\nrapidfuzz\npytest\n')

# Generate main.py
with open(f'{base_dir}/app/main.py', 'w') as f:
    f.write('''from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import identity, verification, documents, coverage, calculator, auth, dashboard, feed

app = FastAPI(title="Touchstone Backend", description="Independent verification and compliance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(identity.router)
app.include_router(verification.router)
app.include_router(documents.router)
app.include_router(coverage.router)
app.include_router(calculator.router)
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(feed.router)

@app.get("/")
def root():
    return {"status": "API is running"}
''')

# Generate __init__.py files
for d in ['routers', 'models', 'services', 'utils']:
    with open(f'{base_dir}/app/{d}/__init__.py', 'w') as f:
        pass

# Generate models/schemas.py
with open(f'{base_dir}/app/models/schemas.py', 'w') as f:
    f.write('''from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime

class IdentityVerificationResult(BaseModel):
    status: Literal["verified", "unverified"]
    matched_company: Optional[str]
    match_confidence: float
    reason: str

class MaterialDeclaration(BaseModel):
    standardized_name: str
    material_class: str
    cas_number: Optional[str]
    hazard_class: str
    declared_concentration: float
    quantity: float
    unit: str
    physical_state: str

class FactorScore(BaseModel):
    factor_name: str
    score: float
    weight: float
    weighted_contribution: float

class ConfidenceScoreResult(BaseModel):
    confidence_score: float
    factor_breakdown: List[FactorScore]
    primary_deduction_reason: str
    physical_assay_recommended: bool

class VerificationRequest(BaseModel):
    request_id: str
    company_name: str
    material: MaterialDeclaration
    transaction_role: Literal["buyer_requesting", "seller_precert"]
    cluster: str
    timestamp: datetime

class VerificationResult(BaseModel):
    request: VerificationRequest
    confidence: ConfidenceScoreResult
    identity: IdentityVerificationResult
    outcome_category: Literal["verified_clean", "discrepancy_flagged", "documentation_gap"]

class DocumentChecklistItem(BaseModel):
    document_type: str
    description: str
    status: Literal["on_file_verified", "expired", "missing"]
    required_for: Literal["hazardous", "non_hazardous", "both"]

class FacilitationRequest(BaseModel):
    company_name: str
    document_type: str
    service_description: str
    logged_at: datetime

class ClusterInfo(BaseModel):
    name: str
    latitude: float
    longitude: float
    assay_team_base: str
    avg_dispatch_hours: float
    active_cases_count: int
    verified_companies_count: int

class ROIResult(BaseModel):
    annual_risk_exposure: float
    annual_verification_cost: float
    net_annual_savings: float
    methodology_note: str
''')

# Generate blank router files to prevent import errors
for route in ['identity', 'verification', 'documents', 'coverage', 'calculator', 'auth', 'dashboard', 'feed']:
    with open(f'{base_dir}/app/routers/{route}.py', 'w') as f:
        f.write(f'''from fastapi import APIRouter\n\nrouter = APIRouter(prefix="/{route}", tags=["{route.capitalize()}"])\n''')

print('Structure created.')
