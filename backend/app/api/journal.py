from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import JournalEntry, JournalLine, Account, Company, User
from ..models.user import UserRole
from ..schemas import JournalEntryCreate, JournalEntry as JournalEntrySchema
from ..core.auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=JournalEntrySchema)
def create_journal_entry(
    entry: JournalEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.ACCOUNTANT]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Verify company exists
    company = db.query(Company).filter(Company.id == entry.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Verify all accounts exist and belong to the same company
    account_ids = [line.account_id for line in entry.lines]
    accounts = db.query(Account).filter(
        Account.id.in_(account_ids),
        Account.company_id == entry.company_id
    ).all()
    
    if len(accounts) != len(account_ids):
        raise HTTPException(status_code=404, detail="One or more accounts not found or don't belong to this company")
    
    # Create journal entry
    db_entry = JournalEntry(
        company_id=entry.company_id,
        date=entry.date,
        description=entry.description,
        reference=entry.reference,
        created_by=current_user.id
    )
    db.add(db_entry)
    db.flush()  # Get the entry ID
    
    # Create journal lines
    for line in entry.lines:
        db_line = JournalLine(
            entry_id=db_entry.id,
            account_id=line.account_id,
            debit=line.debit,
            credit=line.credit,
            description=line.description
        )
        db.add(db_line)
    
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/", response_model=List[JournalEntrySchema])
def read_journal_entries(
    company_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    entries = db.query(JournalEntry).filter(
        JournalEntry.company_id == company_id
    ).order_by(JournalEntry.date.desc()).offset(skip).limit(limit).all()
    return entries

@router.get("/{entry_id}", response_model=JournalEntrySchema)
def read_journal_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    if entry is None:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return entry