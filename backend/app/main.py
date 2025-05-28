from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, companies, accounts, journal, reports
from .database import engine
from . import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Accounting Software API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(companies.router, prefix="/api/companies", tags=["companies"])
app.include_router(accounts.router, prefix="/api/accounts", tags=["accounts"])
app.include_router(journal.router, prefix="/api/journal", tags=["journal"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])

@app.get("/")
def read_root():
    return {"message": "Accounting Software API"}