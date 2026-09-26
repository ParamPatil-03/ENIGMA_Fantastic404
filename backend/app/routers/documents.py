from fastapi import APIRouter
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
