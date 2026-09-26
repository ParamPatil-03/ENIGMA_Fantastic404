from fastapi import APIRouter
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
