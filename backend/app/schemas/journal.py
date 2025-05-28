from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal

class JournalLineCreate(BaseModel):
    account_id: int
    debit: Decimal = Decimal("0.00")
    credit: Decimal = Decimal("0.00")
    description: Optional[str] = None
    
    @validator('debit', 'credit')
    def validate_amounts(cls, v):
        if v < 0:
            raise ValueError('Amount must be non-negative')
        return v
    
    @validator('credit')
    def validate_debit_credit(cls, v, values):
        if 'debit' in values:
            if (values['debit'] > 0 and v > 0) or (values['debit'] == 0 and v == 0):
                raise ValueError('Either debit or credit must be non-zero, but not both')
        return v

class JournalEntryCreate(BaseModel):
    company_id: int
    date: date
    description: str
    reference: Optional[str] = None
    lines: List[JournalLineCreate]
    
    @validator('lines')
    def validate_balanced(cls, v):
        total_debit = sum(line.debit for line in v)
        total_credit = sum(line.credit for line in v)
        if total_debit != total_credit:
            raise ValueError(f'Entry must be balanced. Debit: {total_debit}, Credit: {total_credit}')
        if len(v) < 2:
            raise ValueError('Entry must have at least 2 lines')
        return v

class JournalLine(BaseModel):
    id: int
    account_id: int
    debit: Decimal
    credit: Decimal
    description: Optional[str]
    
    class Config:
        from_attributes = True

class JournalEntry(BaseModel):
    id: int
    company_id: int
    date: date
    description: str
    reference: Optional[str]
    created_by: int
    created_at: datetime
    lines: List[JournalLine]
    
    class Config:
        from_attributes = True