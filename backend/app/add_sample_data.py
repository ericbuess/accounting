import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import JournalEntry, JournalLine, Account, User

def add_sample_journal_entries(db: Session):
    """Add sample journal entries to the database"""
    try:
        # Get the test user
        user = db.query(User).filter(User.email == "test@example.com").first()
        if not user:
            print("Test user not found!")
            return
        
        # Get accounts for Acme Corporation (company_id = 1)
        cash_account = db.query(Account).filter(Account.company_id == 1, Account.code == "1010").first()
        revenue_account = db.query(Account).filter(Account.company_id == 1, Account.code == "4100").first()
        expense_account = db.query(Account).filter(Account.company_id == 1, Account.code == "5100").first()
        ar_account = db.query(Account).filter(Account.company_id == 1, Account.code == "1200").first()
        
        if not all([cash_account, revenue_account, expense_account, ar_account]):
            print("Required accounts not found!")
            return
        
        # Get current date info
        today = date.today()
        start_of_month = today.replace(day=1)
        
        # Entry 1: Sales revenue (cash)
        entry1 = JournalEntry(
            company_id=1,
            date=start_of_month + timedelta(days=5),
            description="Sales revenue - cash payment",
            reference="INV-001",
            created_by=user.id
        )
        db.add(entry1)
        db.flush()
        
        # Debit Cash, Credit Revenue
        db.add(JournalLine(entry_id=entry1.id, account_id=cash_account.id, debit=15000.00, credit=0.00, description="Cash received"))
        db.add(JournalLine(entry_id=entry1.id, account_id=revenue_account.id, debit=0.00, credit=15000.00, description="Sales revenue"))
        
        # Entry 2: Sales revenue (on account)
        entry2 = JournalEntry(
            company_id=1,
            date=start_of_month + timedelta(days=10),
            description="Sales revenue - on account",
            reference="INV-002",
            created_by=user.id
        )
        db.add(entry2)
        db.flush()
        
        # Debit AR, Credit Revenue
        db.add(JournalLine(entry_id=entry2.id, account_id=ar_account.id, debit=25000.00, credit=0.00, description="Account receivable"))
        db.add(JournalLine(entry_id=entry2.id, account_id=revenue_account.id, debit=0.00, credit=25000.00, description="Sales revenue"))
        
        # Entry 3: Operating expenses
        entry3 = JournalEntry(
            company_id=1,
            date=start_of_month + timedelta(days=15),
            description="Monthly operating expenses",
            reference="EXP-001",
            created_by=user.id
        )
        db.add(entry3)
        db.flush()
        
        # Debit Expense, Credit Cash
        db.add(JournalLine(entry_id=entry3.id, account_id=expense_account.id, debit=8500.00, credit=0.00, description="Operating expenses"))
        db.add(JournalLine(entry_id=entry3.id, account_id=cash_account.id, debit=0.00, credit=8500.00, description="Cash payment"))
        
        # Entry 4: More expenses
        entry4 = JournalEntry(
            company_id=1,
            date=start_of_month + timedelta(days=20),
            description="Additional operating expenses",
            reference="EXP-002",
            created_by=user.id
        )
        db.add(entry4)
        db.flush()
        
        # Debit Expense, Credit Cash
        db.add(JournalLine(entry_id=entry4.id, account_id=expense_account.id, debit=6500.00, credit=0.00, description="Additional expenses"))
        db.add(JournalLine(entry_id=entry4.id, account_id=cash_account.id, debit=0.00, credit=6500.00, description="Cash payment"))
        
        # Add some entries for Tech Startup Inc (company_id = 2)
        tech_cash = db.query(Account).filter(Account.company_id == 2, Account.code == "1010").first()
        tech_revenue = db.query(Account).filter(Account.company_id == 2, Account.code == "4100").first()
        tech_expense = db.query(Account).filter(Account.company_id == 2, Account.code == "5100").first()
        
        if all([tech_cash, tech_revenue, tech_expense]):
            # Entry for Tech Startup
            tech_entry = JournalEntry(
                company_id=2,
                date=start_of_month + timedelta(days=8),
                description="Service revenue",
                reference="SRV-001",
                created_by=user.id
            )
            db.add(tech_entry)
            db.flush()
            
            db.add(JournalLine(entry_id=tech_entry.id, account_id=tech_cash.id, debit=35000.00, credit=0.00, description="Cash received"))
            db.add(JournalLine(entry_id=tech_entry.id, account_id=tech_revenue.id, debit=0.00, credit=35000.00, description="Service revenue"))
        
        db.commit()
        print("Sample journal entries added successfully!")
        
    except Exception as e:
        print(f"Error adding sample data: {e}")
        db.rollback()

def main():
    db = SessionLocal()
    try:
        add_sample_journal_entries(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()