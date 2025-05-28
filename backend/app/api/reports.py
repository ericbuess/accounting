from typing import List, Dict, Any
from datetime import date, datetime, timedelta
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Account, JournalLine, Company, User, JournalEntry
from ..models.account import AccountType
from ..core.auth import get_current_active_user

router = APIRouter()

def get_account_balance(db: Session, account_id: int, end_date: date) -> Decimal:
    """Calculate account balance up to a specific date"""
    result = db.query(
        func.coalesce(func.sum(JournalLine.debit), 0) - func.coalesce(func.sum(JournalLine.credit), 0)
    ).join(
        JournalLine.entry
    ).filter(
        JournalLine.account_id == account_id,
        JournalEntry.date <= end_date
    ).scalar()
    
    return Decimal(str(result)) if result else Decimal("0.00")

@router.get("/balance-sheet/{company_id}")
def get_balance_sheet(
    company_id: int,
    as_of_date: date = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if not as_of_date:
        as_of_date = date.today()
    
    # Verify company exists
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Get all accounts for the company
    accounts = db.query(Account).filter(Account.company_id == company_id).all()
    
    # Structure for balance sheet
    balance_sheet = {
        "company": company.name,
        "as_of_date": as_of_date.isoformat(),
        "assets": {"accounts": [], "total": Decimal("0.00")},
        "liabilities": {"accounts": [], "total": Decimal("0.00")},
        "equity": {"accounts": [], "total": Decimal("0.00")},
        "total_liabilities_and_equity": Decimal("0.00")
    }
    
    # Calculate balances for each account
    for account in accounts:
        balance = get_account_balance(db, account.id, as_of_date)
        
        if balance != 0:
            account_data = {
                "code": account.code,
                "name": account.name,
                "balance": float(balance)
            }
            
            if account.type == AccountType.ASSET:
                balance_sheet["assets"]["accounts"].append(account_data)
                balance_sheet["assets"]["total"] += balance
            elif account.type == AccountType.LIABILITY:
                balance_sheet["liabilities"]["accounts"].append(account_data)
                balance_sheet["liabilities"]["total"] += abs(balance)
            elif account.type == AccountType.EQUITY:
                balance_sheet["equity"]["accounts"].append(account_data)
                balance_sheet["equity"]["total"] += abs(balance)
    
    balance_sheet["total_liabilities_and_equity"] = (
        balance_sheet["liabilities"]["total"] + balance_sheet["equity"]["total"]
    )
    
    # Convert Decimal to float for JSON serialization
    balance_sheet["assets"]["total"] = float(balance_sheet["assets"]["total"])
    balance_sheet["liabilities"]["total"] = float(balance_sheet["liabilities"]["total"])
    balance_sheet["equity"]["total"] = float(balance_sheet["equity"]["total"])
    balance_sheet["total_liabilities_and_equity"] = float(balance_sheet["total_liabilities_and_equity"])
    
    return balance_sheet

@router.get("/income-statement/{company_id}")
def get_income_statement(
    company_id: int,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify company exists
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Get revenue and expense accounts
    accounts = db.query(Account).filter(
        Account.company_id == company_id,
        Account.type.in_([AccountType.REVENUE, AccountType.EXPENSE])
    ).all()
    
    income_statement = {
        "company": company.name,
        "period": f"{start_date.isoformat()} to {end_date.isoformat()}",
        "revenue": {"accounts": [], "total": Decimal("0.00")},
        "expenses": {"accounts": [], "total": Decimal("0.00")},
        "net_income": Decimal("0.00")
    }
    
    # Calculate balances for the period
    for account in accounts:
        # Get period activity
        result = db.query(
            func.coalesce(func.sum(JournalLine.credit), 0) - func.coalesce(func.sum(JournalLine.debit), 0)
        ).join(
            JournalLine.entry
        ).filter(
            JournalLine.account_id == account.id,
            JournalEntry.date >= start_date,
            JournalEntry.date <= end_date
        ).scalar()
        
        balance = Decimal(str(result)) if result else Decimal("0.00")
        
        if balance != 0:
            account_data = {
                "code": account.code,
                "name": account.name,
                "balance": float(abs(balance))
            }
            
            if account.type == AccountType.REVENUE:
                income_statement["revenue"]["accounts"].append(account_data)
                income_statement["revenue"]["total"] += balance
            elif account.type == AccountType.EXPENSE:
                income_statement["expenses"]["accounts"].append(account_data)
                income_statement["expenses"]["total"] += abs(balance)
    
    income_statement["net_income"] = (
        income_statement["revenue"]["total"] - income_statement["expenses"]["total"]
    )
    
    # Convert Decimal to float for JSON serialization
    income_statement["revenue"]["total"] = float(income_statement["revenue"]["total"])
    income_statement["expenses"]["total"] = float(income_statement["expenses"]["total"])
    income_statement["net_income"] = float(income_statement["net_income"])
    
    return income_statement

@router.get("/trial-balance/{company_id}")
def get_trial_balance(
    company_id: int,
    as_of_date: date = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if not as_of_date:
        as_of_date = date.today()
    
    # Verify company exists
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Get all accounts with balances
    accounts = db.query(Account).filter(Account.company_id == company_id).all()
    
    trial_balance = {
        "company": company.name,
        "as_of_date": as_of_date.isoformat(),
        "accounts": [],
        "total_debit": Decimal("0.00"),
        "total_credit": Decimal("0.00")
    }
    
    for account in accounts:
        # Calculate balance
        result = db.query(
            func.coalesce(func.sum(JournalLine.debit), 0).label('debit'),
            func.coalesce(func.sum(JournalLine.credit), 0).label('credit')
        ).join(
            JournalLine.entry
        ).filter(
            JournalLine.account_id == account.id,
            JournalEntry.date <= as_of_date
        ).first()
        
        total_debit = Decimal(str(result.debit)) if result.debit else Decimal("0.00")
        total_credit = Decimal(str(result.credit)) if result.credit else Decimal("0.00")
        balance = total_debit - total_credit
        
        if balance != 0:
            account_data = {
                "code": account.code,
                "name": account.name,
                "type": account.type.value,
                "debit": float(balance) if balance > 0 else 0,
                "credit": float(abs(balance)) if balance < 0 else 0
            }
            trial_balance["accounts"].append(account_data)
            
            if balance > 0:
                trial_balance["total_debit"] += balance
            else:
                trial_balance["total_credit"] += abs(balance)
    
    # Convert Decimal to float for JSON serialization
    trial_balance["total_debit"] = float(trial_balance["total_debit"])
    trial_balance["total_credit"] = float(trial_balance["total_credit"])
    
    return trial_balance

@router.get("/dashboard/")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get dashboard summary data for all companies"""
    # Get all companies
    companies = db.query(Company).all()
    
    dashboard_data = {
        "total_assets": Decimal("0.00"),
        "total_liabilities": Decimal("0.00"),
        "net_income": Decimal("0.00"),
        "companies": []
    }
    
    # Calculate totals across all companies
    for company in companies:
        # Get all accounts for the company
        accounts = db.query(Account).filter(Account.company_id == company.id).all()
        
        company_data = {
            "id": company.id,
            "name": company.name,
            "assets": Decimal("0.00"),
            "liabilities": Decimal("0.00"),
            "equity": Decimal("0.00"),
            "revenue": Decimal("0.00"),
            "expenses": Decimal("0.00")
        }
        
        # Calculate balances for each account
        for account in accounts:
            balance = get_account_balance(db, account.id, date.today())
            
            if account.type == AccountType.ASSET:
                company_data["assets"] += balance
                dashboard_data["total_assets"] += balance
            elif account.type == AccountType.LIABILITY:
                company_data["liabilities"] += abs(balance)
                dashboard_data["total_liabilities"] += abs(balance)
            elif account.type == AccountType.EQUITY:
                company_data["equity"] += abs(balance)
            elif account.type == AccountType.REVENUE:
                # Get current month revenue
                start_of_month = date.today().replace(day=1)
                result = db.query(
                    func.coalesce(func.sum(JournalLine.credit), 0) - func.coalesce(func.sum(JournalLine.debit), 0)
                ).join(
                    JournalLine.entry
                ).filter(
                    JournalLine.account_id == account.id,
                    JournalEntry.date >= start_of_month
                ).scalar()
                revenue = Decimal(str(result)) if result else Decimal("0.00")
                company_data["revenue"] += revenue
            elif account.type == AccountType.EXPENSE:
                # Get current month expenses
                start_of_month = date.today().replace(day=1)
                result = db.query(
                    func.coalesce(func.sum(JournalLine.debit), 0) - func.coalesce(func.sum(JournalLine.credit), 0)
                ).join(
                    JournalLine.entry
                ).filter(
                    JournalLine.account_id == account.id,
                    JournalEntry.date >= start_of_month
                ).scalar()
                expense = Decimal(str(result)) if result else Decimal("0.00")
                company_data["expenses"] += expense
        
        # Calculate net income for the company (current month)
        company_data["net_income"] = company_data["revenue"] - company_data["expenses"]
        dashboard_data["net_income"] += company_data["net_income"]
        
        # Convert Decimal to float for JSON serialization
        company_data["assets"] = float(company_data["assets"])
        company_data["liabilities"] = float(company_data["liabilities"])
        company_data["equity"] = float(company_data["equity"])
        company_data["revenue"] = float(company_data["revenue"])
        company_data["expenses"] = float(company_data["expenses"])
        company_data["net_income"] = float(company_data["net_income"])
        
        dashboard_data["companies"].append(company_data)
    
    # Convert Decimal to float for JSON serialization
    dashboard_data["total_assets"] = float(dashboard_data["total_assets"])
    dashboard_data["total_liabilities"] = float(dashboard_data["total_liabilities"])
    dashboard_data["net_income"] = float(dashboard_data["net_income"])
    
    return dashboard_data