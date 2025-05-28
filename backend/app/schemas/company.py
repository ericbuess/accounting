from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class CompanyBase(BaseModel):
    name: str
    code: str
    fiscal_year_start: date
    currency: str = "USD"

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True