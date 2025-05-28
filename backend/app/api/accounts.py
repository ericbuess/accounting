from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Account, Company, User
from ..models.user import UserRole
from ..schemas import AccountCreate, Account as AccountSchema
from ..core.auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=AccountSchema)
def create_account(
    account: AccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.ACCOUNTANT]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Verify company exists
    company = db.query(Company).filter(Company.id == account.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Check for duplicate account code within company
    existing = db.query(Account).filter(
        Account.company_id == account.company_id,
        Account.code == account.code
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account code already exists in this company")
    
    # Verify parent account if specified
    if account.parent_id:
        parent = db.query(Account).filter(
            Account.id == account.parent_id,
            Account.company_id == account.company_id
        ).first()
        if not parent:
            raise HTTPException(status_code=404, detail="Parent account not found")
    
    db_account = Account(**account.dict())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

@router.get("/", response_model=List[AccountSchema])
def read_accounts(
    company_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    accounts = db.query(Account).filter(
        Account.company_id == company_id
    ).offset(skip).limit(limit).all()
    return accounts

@router.get("/{account_id}", response_model=AccountSchema)
def read_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    account = db.query(Account).filter(Account.id == account_id).first()
    if account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@router.put("/{account_id}", response_model=AccountSchema)
def update_account(
    account_id: int,
    account_update: AccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.ACCOUNTANT]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_account = db.query(Account).filter(Account.id == account_id).first()
    if not db_account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    for key, value in account_update.dict().items():
        setattr(db_account, key, value)
    
    db.commit()
    db.refresh(db_account)
    return db_account