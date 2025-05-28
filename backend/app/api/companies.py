from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Company, User
from ..models.user import UserRole
from ..schemas import CompanyCreate, Company as CompanySchema
from ..core.auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=CompanySchema)
def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_company = db.query(Company).filter(Company.code == company.code).first()
    if db_company:
        raise HTTPException(status_code=400, detail="Company code already exists")
    
    db_company = Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

@router.get("/", response_model=List[CompanySchema])
def read_companies(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    companies = db.query(Company).offset(skip).limit(limit).all()
    return companies

@router.get("/{company_id}", response_model=CompanySchema)
def read_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    company = db.query(Company).filter(Company.id == company_id).first()
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company