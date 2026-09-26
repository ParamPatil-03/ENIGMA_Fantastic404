from pydantic import BaseModel
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
