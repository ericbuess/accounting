from sqlalchemy import Column, Integer, String, Date, ForeignKey, Numeric, DateTime, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    description = Column(String, nullable=False)
    reference = Column(String)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    company = relationship("Company", back_populates="journal_entries")
    created_by_user = relationship("User", back_populates="journal_entries")
    lines = relationship("JournalLine", back_populates="entry", cascade="all, delete-orphan")

class JournalLine(Base):
    __tablename__ = "journal_lines"

    id = Column(Integer, primary_key=True, index=True)
    entry_id = Column(Integer, ForeignKey("journal_entries.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    debit = Column(Numeric(15, 2), default=0)
    credit = Column(Numeric(15, 2), default=0)
    description = Column(String)
    
    __table_args__ = (
        CheckConstraint('(debit = 0 AND credit > 0) OR (debit > 0 AND credit = 0)', name='debit_credit_check'),
    )
    
    entry = relationship("JournalEntry", back_populates="lines")
    account = relationship("Account", back_populates="journal_lines")