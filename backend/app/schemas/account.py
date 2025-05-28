from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.account import AccountType

class AccountBase(BaseModel):
    code: str
    name: str
    type: AccountType
    parent_id: Optional[int] = None
    is_active: bool = True

class AccountCreate(AccountBase):
    company_id: int

class Account(AccountBase):
    id: int
    company_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True