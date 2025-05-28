from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True)
    fiscal_year_start = Column(Date, nullable=False)
    currency = Column(String(3), default="USD")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    accounts = relationship("Account", back_populates="company")
    journal_entries = relationship("JournalEntry", back_populates="company")