from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..database import Base

class AccountType(str, enum.Enum):
    ASSET = "asset"
    LIABILITY = "liability"
    EQUITY = "equity"
    REVENUE = "revenue"
    EXPENSE = "expense"

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    type = Column(Enum(AccountType), nullable=False)
    parent_id = Column(Integer, ForeignKey("accounts.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    company = relationship("Company", back_populates="accounts")
    parent = relationship("Account", remote_side=[id])
    journal_lines = relationship("JournalLine", back_populates="account")